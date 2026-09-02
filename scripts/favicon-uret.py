"""
Sadeleştirilmiş sekme simgesi üretir — `python scripts/favicon-uret.py`

Neden gerekli: ana logodaki ince botanik çizgiler 16 pikselde (tarayıcı
sekmesinin gerçek boyutu) tanınmaz hale geliyor. Bu betik aynı marka
dilinden — apotek kemeri + yaprak — ama kalın ve dolu biçimlerle,
küçük boyutta okunabilen bir simge çiziyor.

Çıktılar:
  src/app/icon.png        512x512
  src/app/apple-icon.png  180x180
  favicon-kontrol.png     16/32/48 px önizleme
"""

import os
from PIL import Image, ImageDraw

KOK = os.path.join(os.path.dirname(__file__), "..")

YESIL = (31, 81, 56, 255)     # #1F5138
ACIK = (237, 241, 232, 255)   # #EDF1E8

# 4x'te çizip küçültüyoruz: kenarlar yumuşak çıksın diye
O = 4
B = 512 * O


def simge_ciz() -> Image.Image:
    im = Image.new("RGBA", (B, B), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    # --- Zemin: köşeleri yuvarlatılmış kare ---
    d.rounded_rectangle([0, 0, B - 1, B - 1], radius=int(B * 0.22), fill=YESIL)

    # --- Apotek kemeri (kalın kontur) ---
    kalinlik = int(B * 0.055)
    sol = int(B * 0.255)
    sag = int(B * 0.745)
    ust = int(B * 0.215)
    alt = int(B * 0.795)
    yaricap = (sag - sol) // 2
    kemer_alt = ust + yaricap  # yarım dairenin bittiği yükseklik

    # Üst yarım daire
    d.arc([sol, ust, sag, ust + 2 * yaricap], start=180, end=360,
          fill=ACIK, width=kalinlik)
    # Yan duvarlar
    d.line([sol + kalinlik // 2, kemer_alt, sol + kalinlik // 2, alt],
           fill=ACIK, width=kalinlik)
    d.line([sag - kalinlik // 2, kemer_alt, sag - kalinlik // 2, alt],
           fill=ACIK, width=kalinlik)
    # Taban
    d.line([sol, alt - kalinlik // 2, sag, alt - kalinlik // 2],
           fill=ACIK, width=kalinlik)

    # --- Yaprak: DOLU biçim (ince çizgi küçük boyutta kaybolur) ---
    yaprak = Image.new("RGBA", (B, B), (0, 0, 0, 0))
    yd = ImageDraw.Draw(yaprak)
    yw, yh = int(B * 0.135), int(B * 0.33)
    ym_x, ym_y = B // 2, int(B * 0.50)
    yd.ellipse(
        [ym_x - yw // 2, ym_y - yh // 2, ym_x + yw // 2, ym_y + yh // 2],
        fill=ACIK,
    )
    # Orta damar: yeşil bir çizgiyle yapraktan oyulur
    yd.line([ym_x, ym_y - yh // 2 + int(B * 0.02),
             ym_x, ym_y + yh // 2 - int(B * 0.02)],
            fill=YESIL, width=int(B * 0.014))
    yaprak = yaprak.rotate(-24, resample=Image.BICUBIC, center=(ym_x, ym_y))
    im.alpha_composite(yaprak)

    # --- Sap ---
    d.line([B // 2 + int(B * 0.035), int(B * 0.60),
            B // 2 - int(B * 0.01), int(B * 0.735)],
           fill=ACIK, width=int(B * 0.022))

    return im


def main():
    ham = simge_ciz()

    hedefler = [("src/app/icon.png", 512), ("src/app/apple-icon.png", 180)]
    for yol, boyut in hedefler:
        tam = os.path.join(KOK, yol)
        ham.resize((boyut, boyut), Image.LANCZOS).save(tam)
        print(f"{yol:26s} {boyut}x{boyut}  {round(os.path.getsize(tam)/1024)} KB")

    # Gerçek tarayıcı boyutlarında önizleme
    icon = Image.open(os.path.join(KOK, "src/app/icon.png")).convert("RGBA")
    genislik = 16 * 10 + 32 * 10 + 48 * 10 + 80
    sayfa = Image.new("RGBA", (genislik, 520), (255, 255, 255, 255))
    x = 20
    for boyut in (16, 32, 48):
        k = icon.resize((boyut, boyut), Image.LANCZOS)
        sayfa.paste(k.resize((boyut * 10, boyut * 10), Image.NEAREST), (x, 20))
        x += boyut * 10 + 20
    sayfa.save(os.path.join(KOK, "favicon-kontrol.png"))
    print("favicon-kontrol.png       16/32/48 px onizleme")


if __name__ == "__main__":
    main()
