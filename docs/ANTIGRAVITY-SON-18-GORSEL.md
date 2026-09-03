# Son Liste — 18 Görsel Yeniden Üretilecek

105 ürünün **104'ü tek tek açılıp gözle doğrulandı** (kalan 1 tanesi zaten
kullanılmayan mükerrer dosya). Denetim sonucu:

| | Adet |
|---|---|
| Eşleşmesi doğrulanan | **104 / 105** |
| Yanlış görsel bağlanmış — düzeltildi | 5 |
| Görseli sorunsuz, dokunulmayacak | 87 |
| **Yeniden üretilecek** | **18** |

---

## Düzeltilen eşleme hataları (5)

Parti hâlinde bakarken sıra kaydırmışım. Tek tek açınca yakalandı:

| Ürün | Bağlıydı | O dosya aslında | Düzeltildi |
|---|---|---|---|
| Hassas Cilt Bakım Seti | `16.47.01 (2)` | Eklem Seti | `02.08.50 (10)` |
| Dide-i Nur Damla | `16.47.01 (4)` | Propolisli Göz/Kulak Damlası | `16.47.03 (10)` |
| Misk Amber Sidr Mum | `16.47.04 (1)` | Saç Onarım Seti | `16.47.03 (11)` |
| Saç Onarım ve Bakım Seti | `16.47.04 (2)` | Enfeksiyon Seti | `16.47.04 (1)` |
| Direnç Destek Seti | `16.47.04 (3)` | Varis Seti | `16.47.04 (2)` |

---

## A · Ambalaj yanlış — 10 görsel

Çeşitlilik olsun diye kabı ben değiştirmişim. Gerçek ürün serisi neredeyse
tamamen **amber cam kavanoz + parlak siyah kapak**.

| No | Ürün | GERÇEK kap | Ürettiğim (yanlış) |
|---|---|---|---|
| 06 | Güzellik Kremi | amber cam + siyah kapak | buzlu beyaz + altın kapak |
| 07 | Yoğun Nemlendirici | amber cam + siyah kapak | mat yeşil tüp |
| 08 | Hindistan Cevizi Kremi | amber cam + siyah kapak | seramik tub + ahşap kapak |
| 09 | Kuyruk Yağlı Krem | amber cam + siyah kapak | koyu mor cam tub |
| 10 | Aynısefa Macun | **şeffaf cam + beyaz kapak** | alüminyum teneke |
| 11 | Sivilce Kremi | amber cam + siyah kapak | buzlu pompalı şişe |
| 12 | Göz Altı Kremi | amber cam + siyah kapak (küçük) | nane yeşili + gül rengi |
| 13 | Güneş Kremi | amber cam + siyah kapak | beyaz sıkma tüp |
| 14 | Traş Sonrası Krem | amber cam + siyah kapak | koyu yeşil pompalı şişe |
| 15 | Pişik Kremi | amber cam + siyah kapak | pudra mavisi cam |

**Kural:** kap referanstaki ürünün aynısı. Çeşitlilik açı, ışık, zemin,
kapak durumu ve yanındaki malzemeden gelir.

---

## B · Ham görselde ekran görüntüsü / amatör çekim — 8 görsel

Bu ürünlerin kapağı ablamın ham görseli ve **sunuma hazır değil**:

| No | Ürün | Dosya | Sorun |
|---|---|---|---|
| 31 | Hint Yağı | `16.47.01` | %36 siyah bant, telefon oranı |
| 32 | Sidr Kil Diş Macunu | `16.47.03` | %38 siyah bant, gezinti tuşları |
| 33 | Anti-Aging Serum | `16.47.05 (4)` | %29 siyah bant |
| 34 | İştah ve Kilo Destek Seti | `02.05.26 (1)` | %22 siyah bant, story çerçevesi |
| 35 | Zihin Yağı (roll-on) | `16.47.03 (3)` | Ürünün üstünde emoji çıkartması |
| 36 | Tüy Bakım Seti | `02.05.27 (5)` | İçinde WhatsApp sohbet ss + öncesi/sonrası cilt fotoğrafı |
| 37 | Selülit & Çatlak Bakım Seti | `02.05.26 (2)` | Uygulama düğmesi, üstte kesik yazı şeridi |
| 38 | Çocuk ve Genç Gelişim Seti | `02.08.51 (1)` | Amatör kolaj, gri degrade zemin, poşet |

---

## Ortak stil (HER prompt'un sonuna ekle)

```text
STYLE: Clean commercial product photography. Sharp focus, 85mm lens, subtle
depth of field. Photorealistic, not rendered or CGI.

FRAMING: Product fills about 65-70% of the frame with generous breathing
space. Square 1:1 aspect ratio, 1600x1600 or larger.

PALETTE: Muted and natural — warm amber, deep forest green, pale bone, soft
cream, slate. No neon, no candy colors, no heavy saturation.

LABEL RULE: The container carries a real, physical label — a clean rectangle
of matte cream paper, slightly raised, with visible edges and a soft shadow,
wrapped naturally around the curve. The label surface must be COMPLETELY
EMPTY: no text, no letters, no words, no numbers, no logos, no brand names,
no barcodes, no symbols. A clean unprinted label, as it looks before
printing. The real text is added afterwards.

AVOID: no people, no hands, no faces, no phone screenshots, no user interface
elements, no status bars, no reply buttons, no emoji, no stickers, no
timestamps, no page numbers, no before/after comparisons, no chat bubbles,
no infographic panels, no borders or frames, no collage, no split screens,
no poster layout, no marketing badges, no watermarks.
```

---

## Kaydetme

```
urun-gorselleri/
  06-guzellik-kremi.jpg            ← ÜZERİNE YAZ
  07-yogun-nemlendirici-krem.jpg   ← ÜZERİNE YAZ
  08-hindistan-cevizi-krem.jpg     ← ÜZERİNE YAZ
  09-kuyruk-yagli-krem.jpg         ← ÜZERİNE YAZ
  10-aynisefa-macun.jpg            ← ÜZERİNE YAZ
  11-sivilce-kremi.jpg             ← ÜZERİNE YAZ
  12-goz-alti-morluk-kremi.jpg     ← ÜZERİNE YAZ
  13-dogal-gunes-kremi.jpg         ← ÜZERİNE YAZ
  14-tras-sonrasi-krem.jpg         ← ÜZERİNE YAZ
  15-pisik-kremi.jpg               ← ÜZERİNE YAZ
  31-hint-yagi.jpg
  32-sidr-kil-dis-macunu.jpg
  33-anti-aging-serum.jpg
  34-istah-kilo-seti.jpg
  35-zihin-yagi-rolon.jpg
  36-tuy-bakim-seti.jpg
  37-selulit-catlak-seti.jpg
  38-cocuk-genc-gelisim-seti.jpg
```

---

# A · AMBALAJ DÜZELTMESİ

Kap hep aynı: **amber cam kavanoz, parlak siyah vidalı kapak.**
Farkı açı, ışık, zemin, kapak durumu ve yanındaki malzeme yaratıyor.

---

## 06 · Güzellik Kremi

```text
An amber brown glass cosmetic jar with a flat glossy black screw lid, closed,
standing centred on a round pale travertine stone disc. Shot straight on at
eye level. Warm ivory seamless background. Soft diffused light from the upper
left with a gentle gradient shadow. Two argan nuts, one cracked open showing
the pale kernel, and a single small white jasmine flower with green leaves
resting on the surface to the right of the stone.
```

## 07 · Yoğun Nemlendirici El & Yüz Kremi

```text
An amber brown glass cosmetic jar with a tall glossy black screw lid, closed,
standing on a rough natural pale limestone rock. Shot from a slightly
elevated angle looking down so the black lid reads as a full circle. Soft
green-tinted background with out of focus foliage. Bright airy light. A fresh
aloe vera leaf segment cut open showing clear gel leans against the rock, and
a few water droplets sit on the stone surface.
```

## 08 · Hindistan Cevizi Yağlı Krem

```text
An amber brown glass cosmetic jar, open, with its glossy black lid lying flat
beside it, revealing a smooth swirl of white coconut cream inside catching
the light. Standing on a rustic dark wood board with visible grain. Shot from
a three-quarter angle slightly above, looking into the jar. Warm golden light
from the upper right. Half a fresh coconut showing white flesh behind and to
the left, softly out of focus, and a green palm leaf at the frame edge.
```

## 09 · Kuyruk Yağlı Cilt Kremi

```text
A large amber brown glass cosmetic jar, taller and wider than a face-cream
jar, with a flat matte black screw lid, closed. Standing on a mid-grey
seamless background. Shot from a low hero angle looking slightly upward so
the jar feels substantial and heavy. Dramatic hard side light from the right
rakes across the amber glass, leaving a deep shadow to the left and a bright
rim highlight down the right edge. Two glossy dark green bay leaves lying
flat in the foreground shadow.
```

## 10 · Aynısefa Özlü Kremsi Macun

```text
A clear glass cosmetic jar with a smooth white screw lid, closed, filled with
a warm golden-amber balm clearly visible through the glass and glowing where
light passes through it. Standing centred on a soft cream-coloured surface.
Shot straight on at eye level. Warm golden backlight creating a gentle halo
around the jar. Three bright orange calendula flowers with green leaves
arranged at the base, one slightly overlapping the jar.
```

## 11 · Sivilce Kremi

```text
An amber brown glass cosmetic jar, open, with its glossy black lid standing
upright behind the jar and leaning against it. A smooth pale cream surface
visible inside. Standing on a cool white seamless background. Shot straight
on at eye level. Crisp directional light producing a defined shadow to the
right. A small sprig of fresh tea tree leaves and a tiny neat mound of pale
grey-green clay powder on the surface to the left. Clean and clinical.
```

## 12 · Göz Altı Bakım Kremi

```text
A small amber brown glass cosmetic jar, noticeably compact — eye-cream sized,
roughly a third the height of a face-cream jar — with a glossy black screw
lid, closed. Standing on a soft grey-white surface. Shot as a close macro at
a three-quarter angle so the small jar fills the frame generously and its
size reads clearly. Very soft wraparound light with almost no hard shadow.
Three roasted coffee beans and one tiny white jasmine blossom close to the
jar base.
```

## 13 · Doğal Güneş Kremi

```text
An amber brown glass cosmetic jar with a flat glossy black screw lid, closed,
standing on a round light wood disc. A small peak of white cream sits on the
wood beside the jar. Shot at a three-quarter angle. Bright warm summer
sunlight from the upper left casting a sharp defined shadow across a pale
cream surface. A sprig of rosemary, two small white blossoms and three smooth
pale pebbles arranged around the wood disc.
```

## 14 · Traş Sonrası Bakım Kremi

```text
An amber brown glass cosmetic jar with a flat glossy black screw lid, closed,
standing centred on a dark slate grey stone slab. Shot straight on at eye
level. Cool directional light from the left producing a controlled highlight
down the left edge of the amber glass and a soft shadow to the right.
Scattered water droplets on the slate around the jar, two fresh green tea
tree leaves and one small white chamomile flower lying flat. Cool, fresh,
restrained masculine mood.
```

## 15 · Pişik Kremi

```text
An amber brown glass cosmetic jar with a glossy black screw lid, closed,
sitting directly on a soft folded white waffle-weave cotton towel which fills
the lower third of the frame and shows clear fabric texture. Shot at a gentle
three-quarter angle. Very soft, almost shadowless diffused light, high-key
and airy. Three small white chamomile flowers with yellow centres resting on
the towel beside the jar. Tender, gentle, nursery mood.
```

---

# B · HAM GÖRSEL DÜZELTMESİ

Bu sekizinde kabı **referanstaki gerçek üründen** aldım.

---

## 31 · Hint Yağı

Referans: damlalıklı amber cam şişe, siyah damlalık kapağı.

```text
A tall amber glass dropper bottle with a black rubber-bulb pipette cap,
filled with clear pale golden castor oil, standing on a pale marble surface.
Beside it, the glass pipette lies flat with a single golden drop at its tip.
Shot straight on at eye level. Soft daylight from the left with a clean gentle
shadow. A few castor beans and two glossy green leaves scattered on the
marble. Calm and clinical.
```

## 32 · Sidr İçerikli Kil Diş Macunu

Referans: amber cam kavanoz, siyah kapak, gri-yeşil kil macunu içinde;
yanında bambu diş fırçası.

```text
An amber brown glass jar with a glossy black screw lid, open, filled to the
rim with a smooth grey-green clay toothpaste. A bamboo toothbrush with pale
natural bristles rests diagonally across the open jar, a small amount of the
clay paste on its bristles. Standing on a pale grey stone surface. Shot at a
three-quarter angle. Fresh cool light. Two fresh mint sprigs and three small
ice-clear water droplets beside the jar.
```

## 33 · Anti-Aging Bakım Serumu

Referans: damlalıklı amber cam şişe, siyah kapak.

```text
An amber glass serum bottle with a black dropper cap, standing upright on a
round pale travertine disc, with the glass pipette resting beside it and a
single clear golden droplet suspended at its tip. Shot straight on at eye
level, slightly macro so the bottle fills the vertical space. Soft warm
diffused light, gentle gradient shadow. Warm ivory seamless background. Two
small white jasmine blossoms and one green leaf at the base.
```

## 34 · İştah ve Kilo Destek Seti

Referans: iki koyu cam kavanoz altın kapaklı (macunlar), damlalıklı amber
şişe (D vitamini), kraft doypack (iğde tozu).

```text
Four containers arranged as a group on a round light wood board: two dark
glass jars with gold twist lids filled with dark paste, one small amber glass
dropper bottle with a black cap, and one kraft paper stand-up pouch with a
clear window showing pale beige powder. Every container carries a clean
unprinted label. Shot straight on at eye level so all four read as distinct
shapes, stepped in height. Warm soft daylight from the left, natural shadows.
Cream seamless background.
```

## 35 · Zihin Yağı — Roll-on

Referans: küçük amber cam roll-on şişe, siyah kapak.

```text
A small amber glass roll-on bottle with a black screw cap removed and lying
beside it, the white roller ball clearly visible at the top. Standing upright
on a pale grey stone slab. Shot as a close macro at a three-quarter angle so
the small bottle fills the frame. Soft cool directional light from the left.
Two sprigs of fresh rosemary and three dried lavender buds on the stone
beside it. Calm, focused, restrained.
```

## 36 · Tüy Bakım Seti

Referans: iki beyaz pompalı sprey şişe ve kabak lifi.

```text
Two white plastic pump spray bottles of slightly different heights standing
side by side on a pale cream surface, with a round natural loofah sponge
resting in front of them. Both bottles carry clean unprinted labels. Shot
straight on at eye level. Soft high-key light with gentle shadows, airy and
clean. A folded white cotton towel out of focus in the background. Fresh,
spa-like, minimal.
```

## 37 · Selülit & Çatlak Bakım Seti

Referans: beyaz pompalı sprey (mentollü serum), amber cam kavanoz siyah
kapaklı (çatlak kremi), ahşap saplı vücut fırçası.

```text
Three items arranged together on a round white marble podium: a white plastic
pump spray bottle, an amber brown glass jar with a glossy black screw lid,
and a wooden-handled body brush with pale natural bristles leaning at an
angle. Both bottle and jar carry clean unprinted labels. Shot straight on at
eye level. Soft even light, pale lilac-tinted background, gentle shadows.
Two eucalyptus sprigs lying flat in front.
```

## 38 · Çocuk ve Genç Gelişim Destek Seti

Referans: koyu cam kavanoz siyah kapaklı (macun), damlalıklı amber şişe
(vitamin), kraft doypack (iğde tozu).

```text
Three containers arranged as a group on a light oak wooden surface: one dark
glass jar with a black screw lid filled with dark herbal paste, one amber
glass dropper bottle with a black cap, and one kraft paper stand-up pouch
with a clear window showing pale beige powder. Every container carries a
clean unprinted label. Shot straight on at eye level, stepped in height so
each reads clearly. Warm natural daylight from the left, soft shadows. Cream
seamless background.
```

---

## Üretim bitince

Haber ver. Bu 18 görsel klasöre girince **tek seferde** yükleyip pushlarım —
parça parça canlıya yansıtmayacağım.

Beğenmediğin olursa yalnızca o ürünün prompt'unu tekrar çalıştır.
