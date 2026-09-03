# 20 Ürün — Görsel Üretim Promptları

`urunler-ham/` içindeki 52 infografik incelendi, siteye girecek **20 ürün** seçildi.
Her ürün için **1 adet** showroom görseli üretilecek.

Her ürün siteye **2 görselle** girer:

1. **Kapak** — burada üreteceğin temiz showroom fotoğrafı (katalog kartında görünür)
2. **İkinci görsel** — ablamın gönderdiği infografik (ürün sayfasında, tüm bilgiler orada)

---

## Seçim nasıl yapıldı

Ölçüt sırasıyla: günlük/tekrar alım potansiyeli, tek başına iyi fotoğraflanabilirlik,
kategori dengesi, ve hastalık iddiası taşımaması.

**Seçilmeyenler** çoğunlukla belirli bir rahatsızlığı adıyla hedefleyen "destek
seti"leriydi (varis, topuk dikeni, sinüzit, kemik erimesi, eklem, mide, parazit,
sigara bırakma, egzama, vitiligo, akciğer, kanser/kemoterapi, gebelik, bebek
takviyesi vb.). Bunlar Sağlık Beyanı Yönetmeliği kapsamında; siteye adıyla
girerlerse riski sen taşırsın. Ürün olarak satılamaz demiyorum — sırası gelince
ablanla birlikte adlarını ve metinlerini konuşup ekleriz.

**Not:** Üzüm Pekmezi görselinde `SÜMEYYE DOĞAL ÜRÜNLER`, sarımsak sabununda
`Şifaver Natural BITTIM`, bazılarında `Dermolif` / `NÖVLEX` / `GENIXIR` logoları
var — başka firmaların görselleri. Üreteceğin showroom görsellerinde **hiçbir
marka/logo/yazı olmayacak**, prompt'larda bunu ayrıca belirttim.

---

## Ortak stil (HER prompt'un sonuna ekle)

Aşağıdaki blok 20 görselin birbirine benzemesini sağlar. Ürün açıklamasının
ardına **aynen** yapıştır:

```text
STYLE: Clean commercial product photography on a seamless pure white background.
Soft, even studio light from the upper left with a gentle natural shadow beneath
the product. Slight reflection on the surface. Shot on 85mm lens, f/5.6, sharp
focus on the product, subtle depth of field.

FRAMING: Single product centered, filling about 70% of the frame, generous white
space around it. Square 1:1 aspect ratio, 1600x1600 or larger.

PALETTE: Muted and natural — deep forest green, warm amber glass, pale bone,
soft cream. No neon, no candy colors, no heavy saturation.

CRITICAL — the packaging must be COMPLETELY BLANK:
no text, no letters, no words, no numbers, no labels, no logos, no brand names,
no barcodes, no symbols, no watermarks. Absolutely nothing written anywhere.

ALSO AVOID: no people, no hands, no faces, no infographic panels, no icons,
no borders or frames, no collage, no split screens, no colored background
blocks, no poster layout, no marketing badges. Just the product on white.
```

---

## Görselleri nereye kaydedeceksin

Depo kökünde `urun-gorselleri/` klasörü aç. Dosya adları **aynen** aşağıdaki gibi
olsun — yükleme betiği bu adlara göre eşleştirecek:

```
urun-gorselleri/
  01-zeytinyagi.png
  02-uzum-pekmezi.png
  03-propolis.png
  ...
  20-bebek-bakim-seti.png
```

PNG veya JPG fark etmez. Panel yüklerken zaten WebP'ye çeviriyor.

---

# Ürünler

Her başlığın altında: siteye girecek bilgiler + o ürünün prompt'u.
Prompt'un sonuna yukarıdaki **ortak stil bloğunu** eklemeyi unutma.

---

## 01 · Ayvalık Zeytinyağı — Soğuk Sıkım 5 L

- **Kategori:** Bitkisel Yağlar
- **Fiyat:** 2.450 ₺
- **Kısa:** Balıkesir Ayvalık, erken hasat, soğuk sıkım. Asit oranı %0,3.
- **Açıklama:** Balıkesir Ayvalık bölgesinden erken hasat zeytinlerin soğuk sıkım
  yöntemiyle elde edildiği sızma zeytinyağı. Asit oranı %0,3. Soğuk sıkımda zeytin
  ısıya maruz kalmadığı için doğal aroması ve polifenol içeriği korunur. Salata,
  kahvaltı, zeytinyağlı yemekler ve marinasyonda kullanılır. Kışın doğal olarak
  yoğunlaşıp bulanıklaşabilir veya donabilir; bu saflığın göstergesidir, oda
  sıcaklığında kısa sürede eski hâline döner. 5 litre bidon.

```text
A large 5-liter olive oil jug made of tinted green PET plastic with a moulded
handle and a dark green screw cap, filled with clear golden-green olive oil.
Completely blank surface — no label at all. A few fresh green olives and two
olive branches with leaves resting on the white surface beside the base.
```

---

## 02 · Üzüm Pekmezi

- **Kategori:** Takviye Ürünler
- **Fiyat:** 320 ₺
- **Kısa:** Geleneksel yöntemle kaynatılmış, katkısız üzüm pekmezi.
- **Açıklama:** Siyah üzümün geleneksel yöntemle kaynatılarak koyulaştırılmasıyla
  elde edilir. Şeker, koruyucu veya katkı maddesi içermez. Doğal karbonhidrat ve
  mineral kaynağıdır. Kahvaltıda tahin ile, sütle karıştırılarak veya tatlılarda
  kullanılır. Cam kavanoz. Serin ve kuru yerde saklayın.

```text
A wide-mouth clear glass jar filled with thick, dark, glossy grape molasses,
with a matte gold metal screw lid resting beside it. A wooden honey-style spoon
lifted above the jar with a thick ribbon of the dark molasses slowly dripping
back down. A small cluster of dark purple grapes and one green vine leaf on the
white surface. Completely blank jar — no label, no tag, no string.
```

---

## 03 · Propolis Damla 50 ml — Alkolsüz

- **Kategori:** Takviye Ürünler
- **Fiyat:** 480 ₺
- **Kısa:** Alkol içermeyen propolis özütü, damlalıklı şişe.
- **Açıklama:** Arıların kovan girişini korumak için ürettiği reçinemsi maddeden
  elde edilen özüt. Alkol içermeyen formülü sayesinde her gün kullanıma uygundur.
  Damlalıklı 50 ml amber cam şişe. Amber cam, içeriği ışıktan korur. Serin ve
  ışık almayan yerde saklayın.

```text
A 50ml amber glass dropper bottle with a black rubber-bulb pipette cap, filled
with dark golden-brown liquid. The glass is completely blank — no label. Beside
it, a small shallow wooden bowl holding raw brown propolis granules, and a
honey dipper resting on the white surface. A soft honey-gold reflection under
the bottle.
```

---

## 04 · Kombu Çayı (Kombucha) 500 ml

- **Kategori:** Çay & Detoks
- **Fiyat:** 180 ₺
- **Kısa:** Doğal fermente çay. Rafine şeker ve koruyucu içermez.
- **Açıklama:** Özenle fermente edilen kombu çayı; doğal probiyotikler, enzimler
  ve organik asitler içerir. Rafine şeker, koruyucu ve katkı maddesi içermez.
  Vegan. Günde 1 şişe, soğuk olarak tüketilmesi önerilir. 500 ml. Açıldıktan
  sonra buzdolabında saklayın.

```text
A 500ml clear PET drink bottle with a green screw cap, filled with amber-red
translucent fermented tea. Completely blank bottle — no label, no printing.
Standing on a rough pale limestone slab. Two fresh green tea leaves and a small
scattering of dried tea leaves on the white surface beside it. Light passes
through the liquid, casting a warm amber glow on the white background.
```

---

## 05 · Probiyotik Konsantre İçecek 500 ml

- **Kategori:** Çay & Detoks
- **Fiyat:** 640 ₺
- **Kısa:** Canlı kültür içeren konsantre içecek.
- **Açıklama:** Canlı kültür içeren konsantre içecek. Günlük beslenmeye probiyotik
  desteği eklemek isteyenler için. 500 ml şişe. Kullanmadan önce çalkalayın,
  açıldıktan sonra buzdolabında saklayın.

```text
A 500ml opaque white HDPE plastic bottle with a wide white screw cap, matte
finish, completely blank — no label, no print, no logo. Beside it a small clear
drinking glass holding deep cranberry-red liquid, and three fresh red
cranberries on the white surface. Clean, minimal, pharmacy-like.
```

---

## 06 · Güzellik Kremi

- **Kategori:** Cilt Bakımı
- **Fiyat:** 590 ₺
- **Kısa:** Argan, aloe vera ve E vitamini içeren günlük yüz kremi.
- **Açıklama:** Argan yağı, aloe vera, hindistan cevizi yağı, kuşburnu yağı,
  papatya özü ve E vitamini ile hazırlanmış günlük bakım kremi. Yüz, boyun,
  dekolte, el ve vücutta kullanılabilir. Temiz cilde sabah ve akşam nazikçe
  masaj yaparak uygulayın. Paraben, sülfat ve alkol içermez. Tüm cilt tipleri
  için uygundur.

```text
An amber brown glass cosmetic jar, about 60ml, with a glossy black screw lid,
standing on a small round pale travertine stone disc. The jar is completely
blank — no label, no text. Two argan nuts and a single small white jasmine
flower with green leaves resting on the white surface beside the stone.
```

---

## 07 · Yoğun Nemlendirici El & Yüz Kremi

- **Kategori:** Cilt Bakımı
- **Fiyat:** 420 ₺
- **Kısa:** Aloe vera ve shea yağı ile yoğun nem, yağlı his bırakmaz.
- **Açıklama:** Aloe vera, shea yağı, jojoba yağı, E vitamini, papatya özü ve
  hindistan cevizi yağı içerir. Yüz, eller, dirsek, diz ve boyun gibi kuru
  bölgelerde kullanılır. Hafif dokusu sayesinde hızla emilir, yağlı his bırakmaz.
  Gün içinde ihtiyaç duydukça tekrarlanabilir. Paraben, sülfat ve renklendirici
  içermez.

```text
An amber brown glass cosmetic jar with a glossy black lid, standing on a pale
cream travertine stone disc. Completely blank jar — no label. A fresh green aloe
vera leaf segment cut open showing clear gel, and two water droplets on the
white surface beside it. Cool, fresh, hydrated feeling.
```

---

## 08 · Hindistan Cevizi Yağlı Krem

- **Kategori:** Cilt Bakımı
- **Fiyat:** 380 ₺
- **Kısa:** Hindistan cevizi yağı ile yoğun nem ve bakım.
- **Açıklama:** Hindistan cevizi yağı ile hazırlanmış nemlendirici krem. Yüz,
  eller, vücut, bacaklar ve ayaklarda kullanılabilir. Paraben, silikon,
  renklendirici ve hayvansal içerik içermez. Günlük kullanıma uygundur.

```text
An amber brown glass cosmetic jar with a glossy black lid on a round rustic
wood slice with visible bark edge. Completely blank jar — no label. Half a
fresh coconut showing white flesh beside it, one green palm frond leaf, and a
small swirl of white cream on the white surface. Bright and tropical but with
a muted natural palette.
```

---

## 09 · Kuyruk Yağlı Cilt Kremi

- **Kategori:** Cilt Bakımı
- **Fiyat:** 450 ₺
- **Kısa:** Kuyruk yağı ile zenginleştirilmiş, kuru ve pullanan ciltler için.
- **Açıklama:** Kuyruk yağı ile zenginleştirilmiş bakım kremi. Kuru ve pullanan
  cilt bölgelerinde, tahriş ve kızarıklıkta, yüz ve vücutta kullanılır. Yoğun nem
  sağlar. Dermatolojik olarak test edilmiştir. Paraben, sülfat ve renklendirici
  içermez.

```text
An amber brown glass cosmetic jar with a glossy black lid, resting on two
stacked flat pale river stones. Completely blank jar — no label. A small brass
spoon holding a dollop of rich ivory cream beside it, and a few glossy green
leaves. Warm golden light. Rich, nourishing, traditional feeling.
```

---

## 10 · Aynısefa Özlü Kremsi Macun 110 ml

- **Kategori:** Cilt Bakımı
- **Fiyat:** 520 ₺
- **Kısa:** Aynısefa (calendula) özlü, el yapımı kremsi macun. 110 ml.
- **Açıklama:** Aynısefa (calendula) özü ile hazırlanmış el yapımı kremsi macun.
  Kızarıklık ve tahriş görülen bölgelerde, kuruyan ve yıpranan ciltte kullanılır.
  Yumuşatır ve yoğun nem verir. 110 ml cam kavanoz.

```text
A clear glass cosmetic jar with a smooth white screw lid, filled with a warm
golden-amber balm that catches the light. Completely blank jar — no label.
Three bright orange calendula (marigold) flowers with green leaves arranged
beside it on the white surface, one flower slightly overlapping the jar base.
Warm golden glow.
```

---

## 11 · Sivilce Kremi

- **Kategori:** Cilt Bakımı
- **Fiyat:** 390 ₺
- **Kısa:** Çay ağacı yağı, kil ve çinko oksit içeren bakım kremi.
- **Açıklama:** Çay ağacı yağı, aloe vera, kil, papatya özü, shea yağı ve çinko
  oksit içerir. Yüz, alın, çene, sırt ve göğüs bölgesinde kullanılabilir. Cildin
  yağ dengesini korumaya yardımcı olur. Paraben, sülfat ve renklendirici içermez.
  Tüm cilt tiplerine uygundur.

```text
An amber brown glass cosmetic jar with a glossy black lid, standing on a rough
pale limestone rock. Completely blank jar — no label. A small sprig of fresh
tea tree leaves and a tiny pile of pale grey-green clay powder on the white
surface beside it. Clean, clinical, fresh green accents.
```

---

## 12 · Göz Altı Morluk Kremi

- **Kategori:** Cilt Bakımı
- **Fiyat:** 460 ₺
- **Kısa:** Kafein, C vitamini ve hyaluronik asit içeren göz çevresi kremi.
- **Açıklama:** Kafein, aloe vera, C vitamini, hyaluronik asit ve yeşil çay özü
  içerir. Göz çevresindeki hassas cilt için formüle edilmiştir. Temiz cilde
  parmak uçlarıyla hafifçe vurarak uygulayın, sabah ve akşam kullanılabilir.
  Paraben, sülfat ve renklendirici içermez.

```text
A small amber brown glass cosmetic jar, compact size, with a glossy black lid,
on a round pale travertine disc. Completely blank jar — no label. A few roasted
coffee beans and two small white jasmine flowers with green leaves on the white
surface beside it. Soft, calm, restful mood.
```

---

## 13 · Doğal Güneş Kremi

- **Kategori:** Cilt Bakımı
- **Fiyat:** 540 ₺
- **Kısa:** Dört mevsim kullanıma uygun doğal içerikli koruyucu krem.
- **Açıklama:** Doğal içerikli koruyucu ve bakım kremi. Yazın güneşin etkilerine,
  kışın kuruluk ve çatlak oluşumuna karşı bakım sağlar. Yetişkin ve çocuklarda,
  hassas ciltlerde kullanılabilir. Güneşe çıkmadan yaklaşık 30 dakika önce
  uygulayın, gün içinde yenileyin. Paraben ve kimyasal katkı içermez.

```text
An amber brown glass cosmetic jar with a matte black lid on a smooth pale
sandstone slab. Completely blank jar — no label. Small white jasmine blossoms,
a sprig of rosemary and three smooth pale pebbles on the white surface. Bright
warm sunlight from the upper left casting a soft defined shadow. Summer feeling
but still muted and natural.
```

---

## 14 · Traş Sonrası Bakım Kremi

- **Kategori:** Cilt Bakımı
- **Fiyat:** 350 ₺
- **Kısa:** Traş sonrası tahrişi yatıştıran, hızlı emilen bakım kremi.
- **Açıklama:** Aloe vera, papatya özü, jojoba yağı, E vitamini ve çay ağacı yağı
  içerir. Traş sonrası oluşan kızarıklık ve yanma hissini yatıştırır. Yüzü ılık
  su ile yıkayıp kuruladıktan sonra nazikçe uygulayın. Hızlı emilir, yağlı his
  bırakmaz. Paraben ve alkol içermez.

```text
An amber brown glass cosmetic jar with a glossy black lid, standing on a pale
grey stone disc with a few water droplets scattered on the white surface around
it. Completely blank jar — no label. Two fresh green tea tree leaves and one
small white chamomile flower beside it. Cool, fresh, clean masculine mood.
```

---

## 15 · Pişik Kremi

- **Kategori:** Cilt Bakımı
- **Fiyat:** 280 ₺
- **Kısa:** Bebeklerin hassas cildi için zeytinyağı ve çinko oksit içeren krem.
- **Açıklama:** Zeytinyağı, papatya özü, aloe vera, çinko oksit ve shea yağı ile
  hazırlanmıştır. Bebeklerin hassas cildi için formüle edilmiştir; bez bölgesinde
  ve tahrişe eğilimli ciltte her bez değişiminde kullanılabilir. Paraben, sülfat
  ve renklendirici içermez. Dermatolojik olarak test edilmiştir.

```text
An amber brown glass cosmetic jar with a glossy black lid, standing on a round
light wood disc. Completely blank jar — no label. Three white chamomile flowers
with yellow centers and a soft folded cream-colored cotton towel in the
background, slightly out of focus. Soft, gentle, warm light. Tender and calm.
```

---

## 16 · Hamilelik Çatlak & Selülit Kremi

- **Kategori:** Cilt Bakımı
- **Fiyat:** 620 ₺
- **Kısa:** Shea, badem ve kakao yağı içeren, cilde esneklik veren krem.
- **Açıklama:** Shea yağı, badem yağı, centella asiatica, E vitamini, kakao yağı
  ve jojoba yağı içerir. Karın, basen, göğüs, kalça ve bacak bölgelerinde
  kullanılır. Cildi derinlemesine nemlendirir ve esneklik kazandırır. Paraben,
  sülfat ve renklendirici içermez. Dermatolojik olarak test edilmiştir.
  Hamilelik döneminde kullanmadan önce doktorunuza danışın.

```text
An amber brown glass cosmetic jar with a matte black lid on a round pale
travertine disc. Completely blank jar — no label. Two shea nuts, three whole
almonds and a small sprig of soft green olive-like leaves on the white surface.
Very soft diffused light, calm and reassuring mood.
```

---

## 17 · Saç Kremi

- **Kategori:** Saç Bakımı *(yeni kategori — panelden eklenecek)*
- **Fiyat:** 340 ₺
- **Kısa:** Argan, zeytinyağı ve buğday proteini içeren saç kremi.
- **Açıklama:** Argan yağı, zeytinyağı, aloe vera, hindistan cevizi yağı, papatya
  özü ve buğday proteini içerir. Şampuan sonrası nemli saça uygulayın, 2-3 dakika
  bekletip iyice durulayın. Tüm saç tipleri için uygundur. Paraben, sülfat ve
  renklendirici içermez.

```text
An amber brown glass cosmetic jar with a glossy black lid, standing on a round
rustic wood slice with bark edge. Completely blank jar — no label. Two argan
nuts, one cracked open showing the pale kernel, a few green olives and a small
sprig of olive leaves on the white surface. A thin ribbon of golden oil pooling
lightly beside the base.
```

---

## 18 · Doğal Tırnak Bakım Yağı

- **Kategori:** Bitkisel Yağlar
- **Fiyat:** 240 ₺
- **Kısa:** Fırça uçlu tırnak ve tırnak eti bakım yağı. Vegan.
- **Açıklama:** Tırnak ve tırnak çevresindeki cildin bakımı için hazırlanmış
  bitkisel yağ karışımı. Fırça uçlu uygulayıcı sayesinde doğrudan tırnak
  yüzeyine ve tırnak etine uygulanır. Vegan. Düzenli kullanım önerilir.

```text
A slim conical nail-care applicator bottle with a glossy black tapered cap and
a transparent body filled with clear golden oil, an internal brush applicator
visible through the glass. Completely blank bottle — no label, no printing.
Standing upright on a small white marble tile. Two sprigs of fresh lavender
with purple buds lying on the white surface beside it. Elegant and slim.
```

---

## 19 · Sarımsak Özlü Sabun

- **Kategori:** Sabun & Temizlik
- **Fiyat:** 160 ₺
- **Kısa:** Sarımsak özü ile hazırlanmış doğal katı sabun.
- **Açıklama:** Sarımsak özü ile zenginleştirilmiş doğal sabun. Günlük yüz ve
  vücut kullanımına uygundur; yağlı ve akneye meyilli ciltlerde tercih edilir.
  Islak cilde nazikçe masaj yaparak uygulayın, birkaç dakika bekledikten sonra
  bol su ile durulayın. Hayvanlar üzerinde test edilmemiştir.

```text
Two rustic handmade soap bars in a pale cream-beige color with a slightly rough
natural texture, one lying flat and one leaning upright against it, arranged on
a round dark wood cutting board. The soap surface is completely smooth and
blank — no stamp, no engraving, no letters, no logo. Two whole garlic bulbs and
three loose garlic cloves beside them, plus a small sprig of rosemary. Warm
natural light.
```

---

## 20 · Bebek ve Çocuk Bakım Seti

- **Kategori:** Setler
- **Fiyat:** 1.480 ₺
- **Set içeriği** *(her satıra bir ürün olarak gir)*:
  ```
  Bebek şampuanı
  Bebek vücut yağı
  Pişik kremi
  Gaz giderici krem
  Diş masaj yağı
  ```
- **Kısa:** Bebek ve çocukların hassas cildi için beş parçalık bakım seti.
- **Açıklama:** Bebek ve çocukların hassas cildi için hazırlanmış beş parçalık
  bakım seti. Bebek şampuanı saçı nazikçe temizler ve kolay taranmasını sağlar;
  bebek vücut yağı cildi nemlendirir ve masaj için kullanılır; pişik kremi bez
  bölgesinde her değişimde uygulanır; gaz giderici krem karın bölgesine nazikçe
  masajla sürülür; diş masaj yağı diş çıkarma döneminde diş etlerine uygulanır.
  Hepsi harici kullanım içindir. Paraben içermez.

```text
A group of five blank white and amber cosmetic containers arranged together on
a round white marble podium: one tall white pump bottle, one shorter white
bottle with a flip cap, two small amber glass jars with black lids, and one
small amber glass dropper bottle. Every container is completely blank — no
labels, no text, no logos anywhere. A soft folded cream muslin cloth behind
them, slightly out of focus, and two small white daisy flowers on the white
surface. Gentle, warm, calm nursery mood.
```

---

## Üretim bitince

1. Görselleri `urun-gorselleri/` klasörüne yukarıdaki adlarla kaydet
2. Bana haber ver — panele yükleme betiğini yazıp hepsini bir seferde girerim
3. Ürünler **rastgele fiyatlarla ve yayında** olarak girilecek; ablanla
   inceleyip fiyatları panelden düzeltirsiniz

Beğenmediğin bir görsel olursa o ürünün prompt'unu tekrar çalıştır — hepsi
birbirinden bağımsız.
