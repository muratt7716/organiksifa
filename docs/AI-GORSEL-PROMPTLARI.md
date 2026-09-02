# AI Görsel Üretim Promptları

Üretilen dosyaları **tam olarak belirtilen klasöre, belirtilen isimle** koy.
Hazır olduğunda haber ver, gerisini ben hallederim.

Önerilen araç: **Gemini (Nano Banana Pro)** — metin işleme ve marka tutarlılığı
en iyisi. ChatGPT de olur.

**Marka renkleri** (prompt'larda geçiyor, değiştirme):

| Ad | Kod |
|---|---|
| Şifa yeşili | `#1F5138` |
| Açık yeşil | `#EDF1E8` |
| Amber | `#A8681C` |
| Mürekkep | `#17211B` |
| Kâğıt | `#FFFFFF` |

---

# 1. LOGO

## 1a. Ana logo — yatay (site başlığı için)

**Kayıt yeri:** `public/marka/logo-yatay.png`
**Boyut:** 1200 × 300 px, **şeffaf arka plan**

```
Minimalist bir logo tasarla: "Organik Şifa" yazısı ve solunda bir sembol.

SEMBOL: Tek parça, sade bir yaprak. Bir ucu sivri, diğer ucu yuvarlak.
İçinde ince bir orta damar çizgisi olsun. Gereksiz detay, gradyan, gölge,
parlama YOK. Düz tek renk: #1F5138 koyu yeşil.

YAZI: "Organik Şifa" — zarif, okunaklı bir serif yazı tipi.
Renk #1F5138. Türkçe karakterler doğru olmalı: Ş harfi altındaki çengelle,
"Organik" içindeki i noktalı.

DÜZEN: Sembol solda, yazı sağında, dikeyde ortalanmış. Aralarında rahat boşluk.
Arka plan tamamen ŞEFFAF.

STİL: Apotek/aktar sadeliği. Modern ama zamansız. Kalabalık değil.
Yuvarlak çerçeve, daire, rozet, kurdele, çelenk KULLANMA.
Sadece sembol + yazı.

Çıktı: şeffaf arka planlı PNG, 1200x300.
```

## 1b. Sembol tek başına — favicon ve simge için

**Kayıt yeri:** `public/marka/logo-sembol.png`
**Boyut:** 1024 × 1024 px, **şeffaf arka plan**

```
1a'da tasarladığın yaprak sembolünün tek başına, kare kadraj hâli.

Sembol kadrajın ortasında, kenarlarda %15 boşluk bırakacak şekilde.
Tek renk #1F5138. Arka plan tamamen şeffaf.
Yazı YOK, sadece sembol.

Bu görsel 32x32 piksele küçültüldüğünde bile tanınabilir olmalı —
bu yüzden çizgiler kalın ve sade olsun, ince detay kullanma.

Çıktı: şeffaf arka planlı PNG, 1024x1024.
```

## 1c. Sekme simgesi (favicon)

**Kayıt yeri:** `src/app/icon.png`
**Boyut:** 512 × 512 px

```
1b'deki yaprak sembolünü, köşeleri yuvarlatılmış dolu bir kare
üzerine yerleştir.

Kare arka plan: #1F5138 koyu yeşil, köşe yarıçapı kenarın %22'si kadar.
Sembol: #EDF1E8 açık yeşil (yani zeminin üstünde açık renkte).
Sembol karenin ortasında, kenarlarda %20 boşluk.

Gölge, gradyan, parlama YOK. Düz iki renk.

Çıktı: PNG, 512x512.
```

## 1d. iPhone ana ekran simgesi

**Kayıt yeri:** `src/app/apple-icon.png`
**Boyut:** 180 × 180 px

```
1c ile birebir aynı tasarım, 180x180 piksel.
Köşeleri yuvarlatma — iOS kendisi yuvarlıyor. Dolu kare olarak ver.
```

---

# 2. PAYLAŞIM GÖRSELİ (WhatsApp / Instagram / Facebook)

**Kayıt yeri:** `src/app/opengraph-image.png`
**Boyut:** 1200 × 630 px

> Site bağlantısı WhatsApp'ta paylaşıldığında görünen kart budur.
> Bu görsel olmadan çıplak bir bağlantı görünür.

```
1200x630 piksel yatay bir paylaşım kartı tasarla.

ARKA PLAN: #EDF1E8 açık yeşil düz zemin. Sağ alt köşede çok soluk
(opaklık %8) büyük bir yaprak silüeti, #1F5138 renginde.

SOL ÜST: "Organik Şifa" logosu (yaprak sembolü + yazı), #1F5138.

ORTA SOL: Büyük başlık, iki satır, serif yazı tipi, #17211B renginde:
"Doğanın kendi eczanesinden,
sofrana."

ALTINDA: Daha küçük, sade yazı, #5C665C renginde:
"Bitkisel yağlar, doğal takviyeler ve el yapımı cilt bakım ürünleri."

SOL ALT: Koyu yeşil (#1F5138) dolgulu, köşeleri hafif yuvarlak bir
etiket içinde beyaz yazı: "WhatsApp'tan sipariş"

Metinlerin hepsi kadrajın kenarlarından en az 70 piksel içeride olsun.
Türkçe karakterler doğru: ğ ı ş ç ö ü İ

STİL: Sakin, ferah, bol boşluklu. Kalabalık değil.
Fotoğraf, ürün görseli, insan KULLANMA — sadece tipografi ve renk.

Çıktı: PNG, 1200x630.
```

---

# 3. TEST ÜRÜNÜ

Sistemi denemek için uydurma bir ürün. Panelden sen yükleyeceksin.

## Ürün bilgileri (panele bunları gir)

| Alan | Değer |
|---|---|
| **Ürün adı** | Zeytin Yaprağı & Adaçayı Bitki Çayı |
| **Fiyat** | `240` |
| **Eski fiyat** | `290` |
| **Kategori** | Çay & Detoks |
| **Set içeriği** | *(boş bırak — tek ürün)* |

**Kısa açıklama:**
```
Ege'den toplanan zeytin yaprağı ve adaçayının süzen poşette buluştuğu
günlük bitki çayı. 20 poşet.
```

**Açıklama:**
```
İçindekiler: Zeytin yaprağı, adaçayı, ıhlamur, biberiye.

Ege bölgesinden toplanan bitkilerle hazırlanan, günlük tüketime uygun
bitki çayı. Süzen poşet formunda, 20 adet. Aroma, koruyucu ve renklendirici
içermez.

Hazırlanışı: Bir poşeti bir bardak kaynar suya koyun, 4-5 dakika demleyin.
Poşeti çıkarın. Günde 1-2 bardak tüketilebilir.

Net miktar: 40 g (20 × 2 g)
Saklama: Serin, kuru ve ışık almayan yerde, ağzı kapalı olarak saklayınız.

Takviye edici gıdadır. Normal beslenmenin yerine geçmez. Hamilelik ve
emzirme döneminde veya düzenli ilaç kullanıyorsanız hekiminize danışınız.
```

## 3a. Kapak görseli — kare

**Kayıt yeri:** `test-urun/01-kapak.png`
**Boyut:** 1500 × 1500 px

> Kapak, müşterinin katalogda gördüğü fotoğraftır. **Kare olması şart** —
> panelde ilk sıraya koyacağın görsel budur.

```
Ürün fotoğrafı, kare kadraj (1:1), 1500x1500 piksel.

ÜRÜN: Kraft kahverengi, silindir şeklinde bir çay kutusu. Üzerinde krem
renkli sade bir etiket var. Etikette şu yazılar okunaklı biçimde yer alıyor:
  Üst satır (büyük, serif): "ZEYTİN YAPRAĞI & ADAÇAYI"
  Altında (küçük): "Bitki Çayı"
  En altta (çok küçük): "20 süzen poşet · 40 g"
Etikette ayrıca ince çizgiyle çizilmiş küçük bir zeytin dalı motifi olsun.

SAHNE: Kutu dik duruyor, hafif açılı (3/4 görünüm). Zemin: düz, sıcak beyaz
(#FAFAF8). Arkada duvar da aynı renk — gölgesiz, temiz stüdyo.
Kutunun altında yumuşak, gerçekçi bir temas gölgesi.

YANINDA: Kutunun sağ önünde birkaç kuru zeytin yaprağı ve bir dal adaçayı,
dağınık değil, özenle yerleştirilmiş.

IŞIK: Yumuşak, sol üstten gelen doğal pencere ışığı. Sert gölge yok.

KADRAJ: Ürün kadrajın ortasında, üstte ve altta %12 boşluk.

Türkçe karakterler doğru yazılmalı: Ğ, Ş, İ, ç, ı

Çıktı: 1500x1500 PNG.
```

## 3b. Detay görseli — içerik

**Kayıt yeri:** `test-urun/02-icerik.png`
**Boyut:** 1200 × 1500 px (4:5 dikey)

```
Aynı ürünün içerik fotoğrafı, 4:5 dikey kadraj.

SAHNE: Açık kraft kutunun yanında, ahşap bir tabakta süzen poşetlerden
üç tanesi duruyor. Poşetlerin etiketinde küçük bir zeytin dalı motifi var.
Etrafta dağınık kuru zeytin yaprakları, adaçayı ve ıhlamur çiçekleri.

Zemin: açık renkli, hafif dokulu ahşap. Arka plan yumuşak odak dışı.
Işık: yumuşak doğal ışık, sol üstten.

Sıcak, sakin, el yapımı hissi. Aşırı stilize değil.

Çıktı: 1200x1500 PNG.
```

## 3c. Kullanım görseli

**Kayıt yeri:** `test-urun/03-kullanim.png`
**Boyut:** 1200 × 1500 px (4:5 dikey)

```
Aynı ürünün demlenmiş hâli, 4:5 dikey kadraj.

SAHNE: Şeffaf cam bardakta demlenmiş açık amber renkli çay. Bardağın
içinde süzen poşetin ipi görünüyor. Yanında kraft çay kutusu (3a'daki
ürünün aynısı, etiketi okunaklı), arkasında birkaç zeytin yaprağı.

Zemin: açık renkli ahşap masa. Arkada yumuşak odak dışı beyaz keten.
Işık: sabah ışığı, sol üstten, bardağın içinden geçip amber rengi
parlatıyor.

Çıktı: 1200x1500 PNG.
```

---

# 4. NEREYE KOYACAKSIN — özet

```
organiksifa/
├── src/app/
│   ├── icon.png                 ← 1c  (512x512, sekme simgesi)
│   ├── apple-icon.png           ← 1d  (180x180, iPhone simgesi)
│   └── opengraph-image.png      ← 2   (1200x630, WhatsApp paylaşım kartı)
│
├── public/marka/
│   ├── logo-yatay.png           ← 1a  (1200x300, şeffaf)
│   └── logo-sembol.png          ← 1b  (1024x1024, şeffaf)
│
└── test-urun/
    ├── 01-kapak.png             ← 3a  (1500x1500 KARE — kapak olacak)
    ├── 02-icerik.png            ← 3b  (1200x1500)
    └── 03-kullanim.png          ← 3c  (1200x1500)
```

**Önemli:** `src/app/` klasörüne `icon.png` ve `opengraph-image.png` koyduğun
anda, orada duran `icon.tsx` ve `opengraph-image.tsx` dosyalarını **silmem
gerekiyor** — ikisi birden olursa çakışır. Sen dosyaları koy, bana haber ver,
silmeyi ben yaparım.

`test-urun/` klasöründeki görselleri siteye **panelden sen yükleyeceksin**
(Panel → Ürünler → Yeni ürün). Yükleme sırası önemli: önce `01-kapak.png`,
sonra diğerleri. İlk yüklediğin kapak olur.

---

# 5. Üretim sonrası kontrol

Her görseli **tam boyutta açıp** şunlara bak:

- [ ] Türkçe karakterler doğru mu? (`Ğ Ş İ ç ı ö ü`)
- [ ] Etiket üzerindeki yazılar okunaklı ve anlamlı mı, uydurma harf var mı?
- [ ] Logo 32 piksele küçültülünce hâlâ tanınıyor mu?
- [ ] Şeffaf olması gerekenlerin arka planı gerçekten şeffaf mı?
- [ ] Paylaşım kartındaki metinler kenarlardan taşmış mı?

Bozuk çıkan olursa aynı prompt'u tekrar çalıştır — AI her seferinde farklı
üretir, 2-3 denemede istediğini alırsın.
