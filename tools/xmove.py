#!/usr/bin/env python3
"""Move one X11/XWayland window (e.g. a WLJS window that opened on monitor 1) to X,Y via the window manager
(_NET_MOVERESIZE_WINDOW client message; plain XMoveWindow as a fallback). No xdotool/wmctrl needed.
Usage: xmove.py WINDOW_ID X Y"""
import ctypes, ctypes.util, sys

class XClientMessageEvent(ctypes.Structure):
    _fields_ = [("type", ctypes.c_int), ("serial", ctypes.c_ulong), ("send_event", ctypes.c_int),
                ("display", ctypes.c_void_p), ("window", ctypes.c_ulong), ("message_type", ctypes.c_ulong),
                ("format", ctypes.c_int), ("data", ctypes.c_long * 5)]

class XEvent(ctypes.Union):
    _fields_ = [("xclient", XClientMessageEvent), ("pad", ctypes.c_long * 24)]

def main(win, x, y):
    X = ctypes.cdll.LoadLibrary(ctypes.util.find_library("X11"))
    X.XOpenDisplay.restype = ctypes.c_void_p
    X.XInternAtom.restype = ctypes.c_ulong
    X.XInternAtom.argtypes = [ctypes.c_void_p, ctypes.c_char_p, ctypes.c_int]
    X.XDefaultRootWindow.restype = ctypes.c_ulong
    X.XDefaultRootWindow.argtypes = [ctypes.c_void_p]
    X.XSendEvent.argtypes = [ctypes.c_void_p, ctypes.c_ulong, ctypes.c_int, ctypes.c_long, ctypes.POINTER(XEvent)]
    X.XMoveWindow.argtypes = [ctypes.c_void_p, ctypes.c_ulong, ctypes.c_int, ctypes.c_int]
    d = X.XOpenDisplay(None)
    if not d: sys.exit("cannot open display")
    ev = XEvent()
    ev.xclient.type = 33  # ClientMessage
    ev.xclient.send_event = 1
    ev.xclient.window = win
    ev.xclient.message_type = X.XInternAtom(d, b"_NET_MOVERESIZE_WINDOW", 0)
    ev.xclient.format = 32
    # gravity static (10) | x set (1<<8) | y set (1<<9) | source = pager (2<<12)
    ev.xclient.data[0] = 10 | (1 << 8) | (1 << 9) | (2 << 12)
    ev.xclient.data[1], ev.xclient.data[2] = x, y
    mask = (1 << 19) | (1 << 20)  # SubstructureNotify | SubstructureRedirect
    X.XSendEvent(d, X.XDefaultRootWindow(d), 0, mask, ctypes.byref(ev))
    X.XFlush(d)
    if "--direct" in sys.argv:
        X.XMoveWindow(d, win, x, y); X.XFlush(d)
    X.XCloseDisplay(d)

if __name__ == "__main__":
    main(int(sys.argv[1], 0), int(sys.argv[2]), int(sys.argv[3]))
