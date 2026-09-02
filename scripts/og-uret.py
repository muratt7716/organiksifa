"""
WhatsApp / Instagram / Facebook paylaşım kartını üretir.
`python scripts/og-uret.py`

Kartı gerçek logo dosyasından (public/marka/logo-yatay.png) oluşturur;
böylece sitedeki logo ile paylaşım kartındaki logo birebir aynı olur.
AI'ya yeniden ürettirilirse ikisi birbirini tutmaz.

Çıktı: src/app/opengraph-image.png (1200x630)
"""

import os
from PIL import Image, ImageDraw, ImageFont

KOK = os.path.join(os.path.dirname(__file__), "..")

G, Y = 1200, 630
ZEMIN = (237, 241, 232)   # #EDF1E8 açık yeşil
YESIL = (31, 81, 56)      # #1F5138
MUREKKEP = (23, 33, 27)   # #17211B
SOLUK = (92, 102, 92)     # #5C665C
BEYAZ = (255, 255, 255)

KENAR = 72

BASLIK = ["Doğanın kendi eczanesinden,", "sofrana."]
ALT = ["Bitkisel yağlar, doğal takviyeler ve", "el yapımı cilt bakım ürünleri."]
ROZET = "WhatsApp'tan sipariş"


def yazi_tipi(adaylar, boyut):
    """Sistemde bulunan ilk yazı tipini yükler."""
    for ad in adaylar:
        for klasor in (r"C:\Windows\Fonts", "/usr/share/fonts/truetype", ""):
            yol = os.path.join(klasor, ad) if klasor else ad
            try:
                return ImageFont.truetype(yol, boyut)
            except OSError:
                continue
    return ImageFont.load_default()


def main():
    im = Image.new("RGB", (G, Y), ZEMIN)
    d = ImageDraw.Draw(im)

    # --- Sağ altta soluk yaprak dokusu (logo sembolünden) ---
    sembol_yolu = os.path.join(KOK, "public/marka/logo-sembol.png")
    if os.path.exists(sembol_yolu):
        sembol = Image.open(sembol_yolu).convert("RGBA")
        boy = 460
        sembol = sembol.resize((boy, boy), Image.LANCZOS)
        soluk = Image.new("RGBA", sembol.size, (0, 0, 0, 0))
        for x in range(sembol.width):
            for y in range(sembol.height):
                r, g, b, a = sembol.getpixel((x, y))
                if a > 0:
                    soluk.putpixel((x, y), (r, g, b, int(a * 0.10)))
        im.paste(soluk, (G - boy + 60, Y - boy + 90), soluk)

    # --- Sol üstte logo ---
    logo_yolu = os.path.join(KOK, "public/marka/logo-yatay.png")
    if os.path.exists(logo_yolu):
        logo = Image.open(logo_yolu).convert("RGBA")
        hedef_y = 84
        oran = hedef_y / logo.height
        logo = logo.resize((int(logo.width * oran), hedef_y), Image.LANCZOS)
        im.paste(logo, (KENAR - 8, KENAR - 10), logo)

    # --- Başlık ---
    baslik_font = yazi_tipi(["georgiab.ttf", "Georgia Bold.ttf", "times.ttf"], 62)
    alt_font = yazi_tipi(["segoeui.ttf", "arial.ttf", "DejaVuSans.ttf"], 30)
    rozet_font = yazi_tipi(["segoeuib.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"], 27)

    y = 232
    for satir in BASLIK:
        d.text((KENAR, y), satir, font=baslik_font, fill=MUREKKEP)
        y += 76

    # --- Alt açıklama ---
    y += 22
    for satir in ALT:
        d.text((KENAR, y), satir, font=alt_font, fill=SOLUK)
        y += 42

    # --- Rozet ---
    y += 30
    kutu = d.textbbox((0, 0), ROZET, font=rozet_font)
    rw, rh = kutu[2] - kutu[0], kutu[3] - kutu[1]
    pad_x, pad_y = 30, 20
    d.rounded_rectangle(
        [KENAR, y, KENAR + rw + pad_x * 2, y + rh + pad_y * 2],
        radius=10,
        fill=YESIL,
    )
    d.text((KENAR + pad_x, y + pad_y - kutu[1]), ROZET, font=rozet_font, fill=BEYAZ)

    hedef = os.path.join(KOK, "src/app/opengraph-image.png")
    im.save(hedef, optimize=True)
    print(f"src/app/opengraph-image.png  {G}x{Y}  {round(os.path.getsize(hedef)/1024)} KB")


if __name__ == "__main__":
    main()
