#!/usr/bin/env python3
"""Rebrand AgriVil Android native assets: replace KNUST Bazaar marks with the
real AgriVil 'A' wordmark from public/icon.svg. Generates both vector XML and
raster PNGs (legacy mipmaps + full-screen splash) for consumer and admin."""
import io, re, os, math
from PIL import Image, ImageDraw

ROOT = r"C:\Users\HP\Desktop\agrivil"
GREEN = (0x0F, 0x7A, 0x43, 255)
GOLD  = (0xF4, 0xC4, 0x30, 255)
WHITE = (255, 255, 255, 255)

# --- Real AgriVil 'A' wordmark paths (from public/icon.svg, 180x180 box) ---
A_PATHS = [
 "M101.141 53 H136.632 C151.023 53 162.689 64.6662 162.689 79.0573 V112.904 H148.112 V79.0573 C148.112 78.7105 148.098 78.3662 148.072 78.0251 L112.581 112.898 C112.701 112.902 112.821 112.904 112.941 112.904 H148.112 V126.672 H112.941 C98.5504 126.672 86.5638 114.891 86.5638 100.5 V66.7434 H101.141 V100.5 C101.141 101.15 101.191 101.792 101.289 102.422 L137.56 66.7816 C137.255 66.7563 136.945 66.7434 136.632 66.7434 H101.141 V53 Z",
 "M65.2926 124.136 L14 66.7372 H34.6355 L64.7495 100.436 V66.7372 H80.1365 V118.47 C80.1365 126.278 70.4953 129.958 65.2926 124.136 Z",
]

NUM = r'[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?'
TOKEN = re.compile(r'([MmLlHhVvCcSsQqTtAaZz])|' + NUM)

def parse_points(d):
    """Return list of (cmd, [numbers]) preserving order."""
    out, cmd = [], None
    for m in TOKEN.finditer(d):
        if m.group(1):
            cmd = m.group(1); out.append([cmd, []])
        else:
            out[-1][1].append(float(m.group(0)))
    return out

def transform_path(d, f, cx, cy, bx, by):
    """Affine: x' = cx + (x-bx)*f, y' = cy + (y-by)*f. Handles M L H V C Z."""
    parts = []
    for cmd, nums in parse_points(d):
        c = cmd
        if c in 'MmLlTt':
            pts = nums
            out = []
            for i in range(0, len(pts), 2):
                x, y = pts[i], pts[i+1]
                out += [round(cx + (x-bx)*f, 3), round(cy + (y-by)*f, 3)]
            parts.append(f"{c}{out[0]} {out[1]}" + "".join(f" {v}" for v in out[2:]))
        elif c == 'H':
            out = [round(cx + (x-bx)*f, 3) for x in nums]
            parts.append(f"{c}{out[0]}" + "".join(f" {v}" for v in out[1:]))
        elif c == 'V':
            out = [round(cy + (y-by)*f, 3) for y in nums]
            parts.append(f"{c}{out[0]}" + "".join(f" {v}" for v in out[1:]))
        elif c in 'Cc':
            out = []
            for i in range(0, len(nums), 2):
                x, y = nums[i], nums[i+1]
                out += [round(cx + (x-bx)*f, 3), round(cy + (y-by)*f, 3)]
            parts.append(f"{c}{out[0]} {out[1]}" + "".join(f" {v}" for v in out[2:]))
        elif c == 'Z' or c == 'z':
            parts.append("Z")
        else:
            raise ValueError(f"unsupported cmd {c}")
    return " ".join(parts)

def bbox():
    xs, ys = [], []
    for d in A_PATHS:
        for cmd, nums in parse_points(d):
            if cmd in 'MmLlTtCcSsQq':
                for i in range(0, len(nums), 2):
                    xs.append(nums[i]); ys.append(nums[i+1])
            elif cmd == 'H':
                xs += nums
            elif cmd == 'V':
                ys += nums
    return min(xs), min(ys), max(xs), max(ys)

def fit_paths(vb, fill=0.7):
    minx, miny, maxx, maxy = bbox()
    bw, bh = maxx-minx, maxy-miny
    f = (vb*fill)/max(bw, bh)
    cx, cy = (minx+maxx)/2, (miny+maxy)/2
    return [transform_path(d, f, vb/2, vb/2, cx, cy) for d in A_PATHS]

def write_vector(path, vb, paths, fill="#FFFFFFFF"):
    body = "\n".join(f'    <path android:fillColor="{fill}" android:pathData="{p}"/>' for p in paths)
    xml = f'''<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp" android:height="108dp"
    android:viewportWidth="{vb}" android:viewportHeight="{vb}">
{body}
</vector>
'''
    with open(path, "w") as fh:
        fh.write(xml)

# --- Raster: clean 'A' on leaf rosette mark (unambiguous at icon scale) ---
def reg_poly(cx, cy, r, n, rot_deg):
    pts = []
    for i in range(n):
        a = math.radians(rot_deg + 360.0*i/n)
        pts.append((cx + r*math.cos(a), cy + r*math.sin(a)))
    return pts

def mark_layer(size):
    """Return an 'L' mask: white where the 'A'-on-leaf mark is present.
    Leaf rosette (filled) with the 'A' subtracted via XOR."""
    img = Image.new("RGBA", (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    cx = cy = size/2
    leaf = reg_poly(cx, cy, size*0.40, 10, -90)
    d.polygon(leaf, fill=(255,255,255,255))
    # 'A' hole
    ap = [
        (cx - size*0.22, cy + size*0.26),
        (cx,             cy - size*0.28),
        (cx + size*0.22, cy + size*0.26),
        (cx + size*0.09, cy + size*0.26),
        (cx,             cy - size*0.04),
        (cx - size*0.09, cy + size*0.26),
    ]
    bar_y = cy + size*0.09
    bar = [(cx - size*0.12, bar_y), (cx + size*0.12, bar_y),
           (cx + size*0.12, bar_y + size*0.06), (cx - size*0.12, bar_y + size*0.06)]
    layer = Image.new("L", (size, size), 0)
    ld = ImageDraw.Draw(layer)
    ld.polygon(ap, fill=255)
    ld.polygon(bar, fill=255)
    cur = img.split()[3]; xored = Image.new("L", (size, size))
    cd, ldd, xd = cur.load(), layer.load(), xored.load()
    for y in range(size):
        for x in range(size):
            xd[x, y] = 255 if (cd[x, y] > 0) != (ldd[x, y] > 0) else 0
    img.putalpha(xored)
    return img.split()[3]

def render_mark_rgba(size, shape_fill):
    """Return the mark rendered in `shape_fill` color (RGB tuple) on transparent bg."""
    alpha = mark_layer(size)
    out = Image.new("RGBA", (size, size), (0,0,0,0))
    od, ad = out.load(), alpha.load()
    r, g, b = shape_fill[:3]
    for y in range(size):
        for x in range(size):
            if ad[x, y] > 0:
                od[x, y] = (r, g, b, 255)
    return out

def save_icon_png(path, size, round_icon=False):
    if round_icon:
        base = Image.new("RGBA", (size, size), (0,0,0,0))
        ImageDraw.Draw(base).ellipse([0,0,size-1,size-1], fill=GREEN)
    else:
        base = rounded_square(size)
    mark = render_mark_rgba(size, WHITE)
    base.alpha_composite(mark)
    base.save(path)

def save_splash(path, w, h):
    img = Image.new("RGBA", (w, h), GREEN)
    m = render_mark_rgba(min(w, h), WHITE)
    m = m.resize((int(min(w,h)*0.5), int(min(w,h)*0.5)), Image.LANCZOS)
    img.alpha_composite(m, ((w-m.size[0])//2, (h-m.size[1])//2))
    img.convert("RGB").save(path)

# import ImageChops only if needed
from PIL import ImageChops

def flatten(d):
    """Flatten an SVG path into line segments [(cmd,(x,y),prev)]. Supports M L H V C Z."""
    out = []
    cx = cy = 0.0
    start = (0.0, 0.0)
    for cmd, nums in parse_points(d):
        if cmd == 'M':
            x, y = nums[0], nums[1]; start = (x, y); cx, cy = x, y
            out.append(('M', (x, y), None))
        elif cmd == 'm':
            x, y = cx+nums[0], cy+nums[1]; start=(x,y); cx, cy = x, y
            out.append(('M', (x, y), None))
        elif cmd == 'L':
            x, y = nums[0], nums[1]; out.append(('L', (x, y), (cx, cy))); cx, cy = x, y
        elif cmd == 'l':
            x, y = cx+nums[0], cy+nums[1]; out.append(('L', (x, y), (cx, cy))); cx, cy = x, y
        elif cmd == 'H':
            x = nums[0]; out.append(('L', (x, cy), (cx, cy))); cx = x
        elif cmd == 'h':
            x = cx+nums[0]; out.append(('L', (x, cy), (cx, cy))); cx = x
        elif cmd == 'V':
            y = nums[0]; out.append(('L', (cx, y), (cx, cy))); cy = y
        elif cmd == 'v':
            y = cy+nums[0]; out.append(('L', (cx, y), (cx, cy))); cy = y
        elif cmd == 'C':
            for i in range(0, len(nums), 6):
                x1,y1,x2,y2,x,y = nums[i:i+6]
                out += bezier((cx,cy),(x1,y1),(x2,y2),(x,y))
                cx, cy = x, y
        elif cmd == 'c':
            for i in range(0, len(nums), 6):
                x1,y1,x2,y2,x,y = nums[i:i+6]
                out += bezier((cx,cy),(cx+x1,cy+y1),(cx+x2,cy+y2),(cx+x,cy+y))
                cx, cy = cx+x, cy+y
        elif cmd in 'Zz':
            out.append(('L', start, (cx, cy))); cx, cy = start
    return out

def bezier(p0, p1, p2, p3, steps=24):
    segs = []
    for i in range(1, steps+1):
        t = i/steps
        mt = 1-t
        x = mt**3*p0[0] + 3*mt**2*t*p1[0] + 3*mt*t**2*p2[0] + t**3*p3[0]
        y = mt**3*p0[1] + 3*mt**2*t*p1[1] + 3*mt*t**2*p2[1] + t**3*p3[1]
        segs.append(('L', (x, y), None))
    return segs

def rounded_square(size, radius_ratio=0.22):
    img = Image.new("RGBA", (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    r = int(size*radius_ratio)
    d.rounded_rectangle([0,0,size-1,size-1], radius=r, fill=GREEN)
    return img

def save_icon_png(path, size, round_icon=False):
    if round_icon:
        base = Image.new("RGBA", (size, size), (0,0,0,0))
        ImageDraw.Draw(base).ellipse([0,0,size-1,size-1], fill=GREEN)
    else:
        base = rounded_square(size)
    mark = render_mark_rgba(size, WHITE)
    base.alpha_composite(mark)
    base.save(path)

def save_splash(path, w, h):
    img = Image.new("RGBA", (w, h), GREEN)
    m = render_mark_rgba(min(w, h), WHITE)
    m = m.resize((int(min(w,h)*0.5), int(min(w,h)*0.5)), Image.LANCZOS)
    img.alpha_composite(m, ((w-m.size[0])//2, (h-m.size[1])//2))
    img.convert("RGB").save(path)

MIP = {"mdpi":48, "hdpi":72, "xhdpi":96, "xxhdpi":144, "xxxhdpi":192}
SPLASH = {"mdpi":(320,480), "hdpi":(480,800), "xhdpi":(720,1280), "xxhdpi":(960,1600), "xxxhdpi":(1280,1920)}

for module in ["consumer", "admin"]:
    res = os.path.join(ROOT, "mobile", "android", module, "src", "main", "res")
    # vectors
    fg = fit_paths(108, fill=0.62)
    mono = fit_paths(100, fill=0.66)
    splash_mark = fit_paths(100, fill=0.36)
    write_vector(os.path.join(res, "drawable", "ic_launcher_foreground.xml"), 108, fg, "#FFFFFFFF")
    write_vector(os.path.join(res, "drawable-v24", "ic_launcher_foreground.xml"), 108, fg, "#FFFFFFFF")
    write_vector(os.path.join(res, "drawable", "ic_launcher_monochrome.xml"), 100, mono, "#FFFFFFFF")
    write_vector(os.path.join(res, "drawable", "splash_precision_icon.xml"), 100, splash_mark, "#FFFFFFFF")
    # mipmaps
    for dens, sz in MIP.items():
        d = os.path.join(res, f"mipmap-{dens}")
        save_icon_png(os.path.join(d, "ic_launcher.png"), sz, round_icon=False)
        save_icon_png(os.path.join(d, "ic_launcher_round.png"), sz, round_icon=True)
        # foreground raster (white mark on transparent)
        a = render_mark_rgba(sz, WHITE)
        a.save(os.path.join(d, "ic_launcher_foreground.png"))
        # background raster (solid green)
        Image.new("RGBA", (sz, sz), GREEN).save(os.path.join(d, "ic_launcher_background.png"))
    # splash (port + land)
    for dens, (w, h) in SPLASH.items():
        save_splash(os.path.join(res, f"drawable-port-{dens}", "splash.png"), w, h)
        save_splash(os.path.join(res, f"drawable-land-{dens}", "splash.png"), w, h)
    # remove leftover Bazaar notification icon
    for root, _, files in os.walk(res):
        for fn in files:
            if fn.startswith("ic_stat_bazaar"):
                os.remove(os.path.join(root, fn))
                print("removed", os.path.join(root, fn))

print("ASSET REGEN COMPLETE")
