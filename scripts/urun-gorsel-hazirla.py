"""
Ürün görsellerini siteye yüklenmeye hazır hale getirir.
`python scripts/urun-gorsel-hazirla.py <klasor>`

Tarayıcının panelde yaptığı işlemin AYNISINI uygular:
tek renk kenarları kırp -> kenar rengini ölç -> WebP'ye çevir -> küçült.

Klasördeki dosyalar ADA GÖRE SIRALANIR; ilk dosya kapak olur.
Bu yüzden 01-, 02-, 03- ön eki kullan.

Çıktı: <klasor>/hazir/ içinde .webp dosyaları + gorseller.json
"""

import json
import os
import sys
import glob
from PIL import Image


def yakin(a, b, tol):
    return all(abs(a[i] - b[i]) <= tol for i in range(3))


def tek_renk_kenarlari_kirp(im, tolerans=8):
    """src/lib/image-analysis.ts > tekRenkKenarlariKirp ile birebir aynı."""
    px = im.load()
    g, y = im.size
    if g < 4 or y < 4:
        return (0, 0, g, y)

    referans = px[0, 0][:3]
    ust, alt, sol, sag = 0, y - 1, 0, g - 1

    def satir(yy):
        return all(yakin(px[xx, yy][:3], referans, tolerans)
                   for xx in range(sol, sag + 1))

    def sutun(xx):
        return all(yakin(px[xx, yy][:3], referans, tolerans)
                   for yy in range(ust, alt + 1))

    while ust < alt and satir(ust):
        ust += 1
    while alt > ust and satir(alt):
        alt -= 1
    while sol < sag and sutun(sol):
        sol += 1
    while sag > sol and sutun(sag):
        sag -= 1

    w, h = sag - sol + 1, alt - ust + 1
    if w < 2 or h < 2:
        return (0, 0, g, y)
    return (sol, ust, w, h)


def zemin_rengi(im, kutu):
    """src/lib/image-analysis.ts > zeminRengi ile birebir aynı."""
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


def main():
    if len(sys.argv) < 2:
        print("Kullanim: python scripts/urun-gorsel-hazirla.py <klasor>")
        sys.exit(1)

    klasor = sys.argv[1]
    if not os.path.isdir(klasor):
        print(f"Klasor bulunamadi: {klasor}")
        sys.exit(1)

    hedef = os.path.join(klasor, "hazir")
    os.makedirs(hedef, exist_ok=True)

    dosyalar = sorted(
        p for p in glob.glob(os.path.join(klasor, "*"))
        if p.lower().endswith((".png", ".jpg", ".jpeg", ".webp"))
    )
    if not dosyalar:
        print(f"{klasor} icinde gorsel yok.")
        sys.exit(1)

    sonuc = []
    for sira, yol in enumerate(dosyalar):
        im = Image.open(yol).convert("RGB")
        kutu = tek_renk_kenarlari_kirp(im)
        renk = zemin_rengi(im, kutu)

        kirpik = im.crop((kutu[0], kutu[1], kutu[0] + kutu[2], kutu[1] + kutu[3]))
        en_uzun = max(kirpik.size)
        if en_uzun > 1600:
            olcek = 1600 / en_uzun
            kirpik = kirpik.resize(
                (round(kirpik.width * olcek), round(kirpik.height * olcek)),
                Image.LANCZOS,
            )

        ad = f"{sira + 1:02d}.webp"
        cikti = os.path.join(hedef, ad)
        kirpik.save(cikti, "WEBP", quality=82, method=6)

        sonuc.append({
            "dosya": ad,
            "genislik": kirpik.width,
            "yukseklik": kirpik.height,
            "zeminRengi": renk,
            "tur": "kapak" if sira == 0 else (
                "infografik" if kirpik.height > kirpik.width * 1.4 else "galeri"
            ),
            "sira": sira,
        })
        print(f"  {os.path.basename(yol):28s} -> {ad}  "
              f"{kirpik.width}x{kirpik.height}  {renk}  "
              f"{round(os.path.getsize(cikti)/1024)} KB")

    with open(os.path.join(hedef, "gorseller.json"), "w", encoding="utf-8") as f:
        json.dump(sonuc, f, ensure_ascii=False, indent=2)

    print(f"\n{len(sonuc)} gorsel hazir -> {hedef}")
    print("Simdi: npm run urun:yukle")


if __name__ == "__main__":
    main()
