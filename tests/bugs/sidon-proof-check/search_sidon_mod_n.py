import math,sys
def exists(n,k):
    # is there a k-element Sidon set in Z_n (all nonzero differences distinct)? fix 0 as an element
    used=[False]*n; cur=[0]
    def rec(start):
        if len(cur)==k: return True
        for x in range(start,n):
            ds=[];ok=True
            for a in cur:
                for d in ((x-a)%n,(a-x)%n):
                    if d==0 or used[d] or d in ds: ok=False;break
                    ds.append(d)
                if not ok: break
            if not ok: continue
            for d in ds: used[d]=True
            cur.append(x)
            if rec(x+1): return True
            cur.pop()
            for d in ds: used[d]=False
        return False
    return rec(1)
b=lambda n: math.floor((1+math.sqrt(4*n-3))/2)
fails=[n for n in range(2,41) if not exists(n,b(n))]
print("failures 2..40:",fails)
for n,k in [(44,7),(58,8)]: print(n,k,"exists:",exists(n,k))
