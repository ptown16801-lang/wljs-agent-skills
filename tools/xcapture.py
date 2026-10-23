#!/usr/bin/env python3
"""Capture one X11/XWayland window to PNG with XGetImage (no colormap query, unlike xwd, which fails with
BadColor on X_QueryColors for these TrueColor windows). Usage: xcapture.py WINDOW_ID OUT.png"""
import ctypes, ctypes.util, struct, sys, zlib

class XWindowAttributes(ctypes.Structure):
    _fields_ = [("x", ctypes.c_int), ("y", ctypes.c_int), ("width", ctypes.c_int), ("height", ctypes.c_int),
                ("border_width", ctypes.c_int), ("depth", ctypes.c_int), ("visual", ctypes.c_void_p),
                ("root", ctypes.c_ulong), ("class_", ctypes.c_int), ("bit_gravity", ctypes.c_int),
                ("win_gravity", ctypes.c_int), ("backing_store", ctypes.c_int), ("backing_planes", ctypes.c_ulong),
                ("backing_pixel", ctypes.c_ulong), ("save_under", ctypes.c_int), ("colormap", ctypes.c_ulong),
                ("map_installed", ctypes.c_int), ("map_state", ctypes.c_int), ("all_event_masks", ctypes.c_long),
                ("your_event_mask", ctypes.c_long), ("do_not_propagate_mask", ctypes.c_long),
                ("override_redirect", ctypes.c_int), ("screen", ctypes.c_void_p)]

class XImage(ctypes.Structure):
    _fields_ = [("width", ctypes.c_int), ("height", ctypes.c_int), ("xoffset", ctypes.c_int), ("format", ctypes.c_int),
                ("data", ctypes.POINTER(ctypes.c_ubyte)), ("byte_order", ctypes.c_int), ("bitmap_unit", ctypes.c_int),
                ("bitmap_bit_order", ctypes.c_int), ("bitmap_pad", ctypes.c_int), ("depth", ctypes.c_int),
                ("bytes_per_line", ctypes.c_int), ("bits_per_pixel", ctypes.c_int), ("red_mask", ctypes.c_ulong),
                ("green_mask", ctypes.c_ulong), ("blue_mask", ctypes.c_ulong)]

def main(win_id, out):
    x = ctypes.cdll.LoadLibrary(ctypes.util.find_library("X11"))
    x.XOpenDisplay.restype = ctypes.c_void_p
    x.XGetImage.restype = ctypes.POINTER(XImage)
    x.XGetImage.argtypes = [ctypes.c_void_p, ctypes.c_ulong, ctypes.c_int, ctypes.c_int, ctypes.c_uint, ctypes.c_uint,
                            ctypes.c_ulong, ctypes.c_int]
    x.XGetWindowAttributes.argtypes = [ctypes.c_void_p, ctypes.c_ulong, ctypes.POINTER(XWindowAttributes)]
    d = x.XOpenDisplay(None)
    if not d: sys.exit("cannot open display")
    attrs = XWindowAttributes()
    if not x.XGetWindowAttributes(d, win_id, ctypes.byref(attrs)): sys.exit("no such window")
    img = x.XGetImage(d, win_id, 0, 0, attrs.width, attrs.height, 0xFFFFFFFF, 2)  # ZPixmap
    if not img: sys.exit("XGetImage failed")
    im = img.contents
    if im.bits_per_pixel != 32: sys.exit(f"unsupported bits_per_pixel {im.bits_per_pixel}")
    raw = ctypes.string_at(im.data, im.bytes_per_line * im.height)
    rows = []
    for y in range(im.height):
        line = raw[y * im.bytes_per_line: y * im.bytes_per_line + 4 * im.width]
        px = bytearray(3 * im.width)
        px[0::3] = line[2::4]; px[1::3] = line[1::4]; px[2::3] = line[0::4]  # BGRX -> RGB
        rows.append(b"\0" + bytes(px))
    chunk = lambda t, c: struct.pack(">I", len(c)) + t + c + struct.pack(">I", zlib.crc32(t + c) & 0xffffffff)
    png = (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", im.width, im.height, 8, 2, 0, 0, 0))
           + chunk(b"IDAT", zlib.compress(b"".join(rows), 6)) + chunk(b"IEND", b""))
    open(out, "wb").write(png)
    print(im.width, im.height)

if __name__ == "__main__":
    main(int(sys.argv[1], 0), sys.argv[2])
