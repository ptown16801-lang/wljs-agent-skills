import sys,struct,zlib
d=open(sys.argv[1],'rb').read()
h=struct.unpack('>25I',d[:100]); hs=h[0]; w,hh=h[4],h[5]; bpl=h[12]; ncol=h[19]; bpp=h[11]
off=hs+ncol*12
rows=[]
for y in range(hh):
    r=d[off+y*bpl: off+y*bpl+w*4]
    px=bytearray()
    for x in range(w):
        b,g,rr,a=r[4*x:4*x+4] if h[7]==0 else r[4*x:4*x+4][::-1]
        px+=bytes((rr,g,b))
    rows.append(b'\0'+bytes(px))
def chunk(t,c): return struct.pack('>I',len(c))+t+c+struct.pack('>I',zlib.crc32(t+c)&0xffffffff)
png=b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',w,hh,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(b''.join(rows),6))+chunk(b'IEND',b'')
open(sys.argv[2],'wb').write(png); print(w,hh,bpp,h[7])
