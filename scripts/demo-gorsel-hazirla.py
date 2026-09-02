"""
Demo görsellerini hazırlar.

src/lib/image-analysis.ts içindeki algoritmanın BİREBİR aynısını uygular:
tek renk kenarları kırp -> kenar rengini ölç -> WebP'ye çevir.
Yani panelden yüklendiğinde ne oluyorsa burada da o oluyor.
"""
import json
import os
import glob
from PIL import Image

KOK = os.path.join(os.path.dirname(__file__), "..")
KAYNAK = os.path.join(KOK, "docs", "ornek-gorseller")
HEDEF = os.path.join(KOK, "public", "demo")
os.makedirs(HEDEF, exist_ok=True)


def yakin(a, b, tol):
    return all(abs(a[i] - b[i]) <= tol for i in range(3))


def tek_renk_kenarlari_kirp(im, tolerans=8):
    """image-analysis.ts > tekRenkKenarlariKirp"""
    px = im.load()
    g, y = im.size
    if g < 4 or y < 4:
        return (0, 0, g, y)

    referans = px[0, 0][:3]
    ust, alt, sol, sag = 0, y - 1, 0, g - 1

    def satir_referans(yy):
        return all(yakin(px[xx, yy][:3], referans, tolerans) for xx in range(sol, sag + 1))

    def sutun_referans(xx):
        return all(yakin(px[xx, yy][:3], referans, tolerans) for yy in range(ust, alt + 1))

    while ust < alt and satir_referans(ust):
        ust += 1
    while alt > ust and satir_referans(alt):
        alt -= 1
    while sol < sag and sutun_referans(sol):
        sol += 1
    while sag > sol and sutun_referans(sag):
        sag -= 1

    w, h = sag - sol + 1, alt - ust + 1
    if w < 2 or h < 2:
        return (0, 0, g, y)
    return (sol, ust, w, h)


def zemin_rengi(im, kutu):
    """image-analysis.ts > zeminRengi"""
    px = im.load()
    x0, y0, w, h = kutu
    adim = max(1, max(w, h) // 64)
    r, g, b = [], [], []

    for x in range(x0, x0 + w, adim):
        for yy in (y0, y0 + h - 1):
            p = px[x, yy][:3]
            r.append(p[0]); g.append(p[1]); b.append(p[2])
    for y in range(y0, y0 + h, adim):
        for xx in (x0, x0 + w - 1):
            p = px[xx, y][:3]
            r.append(p[0]); g.append(p[1]); b.append(p[2])

    def ortanca(v):
        s = sorted(v)
        return s[len(s) // 2] if s else 0

    rr, gg, bb = ortanca(r), ortanca(g), ortanca(b)

    parlaklik = 0.2126 * rr + 0.7152 * gg + 0.0722 * bb
    if parlaklik < 40:
        kat = 40 / max(parlaklik, 1)
        rr = min(255, rr * kat + 24)
        gg = min(255, gg * kat + 24)
        bb = min(255, bb * kat + 24)

    return "#%02X%02X%02X" % (round(rr), round(gg), round(bb))


# (dosya boyutu) -> (cikti adi, urun anahtari)
ESLEME = {
    (720, 910): ("d-vitamini-altin-yag", "d-vitamini"),
    (720, 1600): ("hucre-yenileyici-merhem", "merhem"),
    (1080, 1659): ("uyuz-seti", "uyuz-seti"),
    (1080, 1920): ("zayiflama-detox-seti", "detox-seti"),
}

sonuc = {}

for yol in glob.glob(os.path.join(KAYNAK, "*.jpeg")):
    im = Image.open(yol).convert("RGB")
    if im.size not in ESLEME:
        continue
    ad, anahtar = ESLEME[im.size]

    kutu = tek_renk_kenarlari_kirp(im)
    renk = zemin_rengi(im, kutu)

    kirpik = im.crop((kutu[0], kutu[1], kutu[0] + kutu[2], kutu[1] + kutu[3]))

    # Tarayicidaki gibi en uzun kenar 1600'e indiriliyor
    en_uzun = max(kirpik.size)
    if en_uzun > 1600:
        olcek = 1600 / en_uzun
        kirpik = kirpik.resize(
            (round(kirpik.width * olcek), round(kirpik.height * olcek)),
            Image.LANCZOS,
        )

    cikti = os.path.join(HEDEF, ad + ".webp")
    kirpik.save(cikti, "WEBP", quality=82, method=6)

    sonuc[anahtar] = {
        "url": "/demo/" + ad + ".webp",
        "storagePath": "demo/" + ad + ".webp",
        "genislik": kirpik.width,
        "yukseklik": kirpik.height,
        "zeminRengi": renk,
        "boyutKb": round(os.path.getsize(cikti) / 1024),
    }
    print(
        f"{ad:32s} {kirpik.width}x{kirpik.height}  zemin={renk}  "
        f"{sonuc[anahtar]['boyutKb']} KB"
    )

with open(os.path.join(HEDEF, "gorseller.json"), "w", encoding="utf-8") as f:
    json.dump(sonuc, f, ensure_ascii=False, indent=2)

print("\n" + str(len(sonuc)) + " gorsel hazir -> public/demo/")
