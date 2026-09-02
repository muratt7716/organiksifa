# Antigravity Brief — İnfografikten Showroom Ürün Fotoğrafı

**Amaç:** Elimizdeki 5 pazarlama infografiğinden, her ürün için **en az 3**
temiz showroom fotoğrafı üretmek.

**Referans görseller:** `docs/ornek-gorseller/` klasöründe.

---

## 0. DEĞİŞMEZ KURALLAR — her görselde geçerli

### Ürün sadakati
Ürünün **şekli, oranları, rengi, kapak tipi, malzemesi ve etiket üzerindeki
tüm yazılar** referanstaki gibi kalmalı. Etiketi yeniden yorumlama, yeni yazı
uydurma, Türkçe karakterleri (ğ ı ş ç ö ü İ) bozma.

> Neden: kargodan çıkan ürün sitedeki fotoğrafla aynı görünmek zorunda.
> Uydurma etiket yanıltıcı reklamdır ve iade sebebidir.

### Infografikten arındır
Referans görsellerde **kaldırılacaklar**: başlıklar, madde işaretli faydalar
listesi, ikon kutuları, rozetler ("100% ORGANIC", "DOĞAL İÇERİK"), oklar,
adım numaraları, WhatsApp arayüzü, telefon durum çubuğu, filigran.
**Sadece ürünün kendisi kalacak.**

### Kadraj ve boyut

| Sıra | Ad | Oran | Boyut | Amaç |
|---|---|---|---|---|
| 1 | `01-kapak.png` | **1:1 KARE** | 1500×1500 | Katalog kartı **ve ana sayfa vitrini** |
| 2 | `02-detay.png` | 4:5 dikey | 1200×1500 | Ürün sayfası galerisi |
| 3 | `03-sahne.png` | 4:5 dikey | 1200×1500 | Ürün sayfası galerisi |

> **Kapak kare olmak zorunda.** Site, kapağı kare olmayan ürünü ana sayfa
> vitrinine almıyor — dikey görseller orada afiş gibi duruyor.

### Kapak görselinin zemini
Saf beyaz `#FFFFFF` veya çok açık sıcak gri `#FAFAF8`. Düz, dokusuz, gölgesiz
duvar. Ürünün altında yalnızca yumuşak, gerçekçi bir **temas gölgesi**.
Ürün kadrajın ortasında, dört kenarda yaklaşık **%12 boşluk**.

### Işık
Yumuşak, sol üstten gelen doğal pencere ışığı. Sert gölge, parlama, lens
efekti, vinyet yok.

### Yasak
İnsan, el, model, yazı katmanı, logo, rozet, çerçeve, kolaj, "önce/sonra",
gradyan arka plan, stok fotoğraf hissi.

---

## 1. D Vitamini Altın Yağ Karışımı

**Referans:** `docs/ornek-gorseller/WhatsApp Image 2026-09-02 at 16.32.31 (1).jpeg`
**Çıktı klasörü:** `urun-d-vitamini/`

**Üründeki gerçek ayrıntılar:**
- Amber (koyu bal rengi) cam şişe, damlalıklı siyah vidalı kapak
- Etiket: eskitilmiş parşömen/krem renkli, ince altın çerçeveli
- Etiket yazıları (BİREBİR korunacak):
  - Büyük serif: `ALTIN YAĞ KARIŞIMI`
  - Altında küçük: `Bitkisel Yağ Karışımı`
  - `İçindekiler:` başlığı ve madde listesi:
    `İnci Çekirdeği Yağı`, `Çörekotu Yağı`, `Avokado Yağı`,
    `Susam Yağı`, `Üzüm Çekirdeği Yağı`, `Uçkindi Yağı`

### 01-kapak.png (1500×1500, kare)
```
Referans görseldeki amber cam damlalıklı şişenin profesyonel e-ticaret
packshot'ı. Kare kadraj 1:1, 1500x1500.

DEĞİŞMEYECEK: Şişenin amber cam rengi, siyah damlalıklı vidalı kapak,
parşömen renkli etiket ve etiket üzerindeki TÜM yazılar birebir aynı
kalacak — "ALTIN YAĞ KARIŞIMI", "Bitkisel Yağ Karışımı", "İçindekiler"
listesi. Türkçe karakterler bozulmayacak.

DEĞİŞECEK: Arka plandaki krem zemin, ikon kutuları, "OMEGA 3-6-9",
"MAGNEZYUM", "TEK ŞİŞE - TAM DESTEK" gibi tüm yazılar, portakal dilimi,
sarı kapsüller ve yapraklar TAMAMEN kaldırılacak.

SAHNE: Şişe dik duruyor, hafif 3/4 açılı. Zemin ve arka duvar saf beyaz
(#FFFFFF), düz ve dokusuz. Şişenin altında yumuşak gerçekçi temas gölgesi.
Işık sol üstten yumuşak pencere ışığı.

KADRAJ: Şişe ortada, dört kenarda %12 boşluk. Etiket tamamen okunaklı.

Çıktı: 1500x1500 PNG.
```

### 02-detay.png (1200×1500)
```
Aynı şişenin etiket detayı. 4:5 dikey kadraj.

Kamera etikete daha yakın; etiket üzerindeki "İçindekiler" listesi net
okunuyor. Şişe hafif açılı, damlalık kapağı görünür durumda.

Zemin: açık sıcak gri (#FAFAF8) düz duvar. Yumuşak gölge.
Yazılar birebir korunacak.

Çıktı: 1200x1500 PNG.
```

### 03-sahne.png (1200×1500)
```
Aynı şişe doğal bir sahnede. 4:5 dikey kadraj.

SAHNE: Açık renkli ahşap yüzey. Şişenin yanında birkaç çörekotu tanesi,
bir dal biberiye ve yarım kesilmiş bir üzüm salkımı — dağınık değil,
özenle yerleştirilmiş. Arka planda yumuşak odak dışı beyaz keten.
Sabah ışığı sol üstten, amber camın içinden geçiyor.

Ürün ve etiket birebir korunacak. Yazı katmanı, rozet YOK.

Çıktı: 1200x1500 PNG.
```

---

## 2. Hücre Yenileyici Merhem

**Referans:** `docs/ornek-gorseller/WhatsApp Image 2026-09-02 at 16.32.32.jpeg`
**Çıktı klasörü:** `urun-merhem/`

**Üründeki gerçek ayrıntılar:**
- Koyu amber/kahve cam kavanoz, geniş ağızlı, **parlak siyah vidalı kapak**
- Etiketsiz veya çok sade (referansta etiket görünmüyor)
- Referansta bir ahşap kütük dilimi üzerinde, yanında beyaz papatya ve
  biberiye dalı

### 01-kapak.png (1500×1500, kare)
```
Referans görseldeki koyu amber cam kavanozun e-ticaret packshot'ı.
Kare kadraj 1:1, 1500x1500.

DEĞİŞMEYECEK: Kavanozun koyu amber/kahve cam rengi, geniş ağzı, parlak
siyah vidalı kapak, oranları.

DEĞİŞECEK: "HÜCRE YENİLEYİCİ MERHEM" başlığı, "FAYDALARI" listesi, ikonlar,
"DOĞAL İÇERİK" rozeti, alttaki içerik şeridi, telefon ekran görüntüsü
çerçevesi ve durum çubuğu TAMAMEN kaldırılacak. Ahşap kütük, papatya ve
yapraklar da kaldırılacak.

SAHNE: Kavanoz dik, hafif yukarıdan 3/4 açılı — kapağın üstü hafif görünüyor.
Zemin ve arka duvar saf beyaz (#FFFFFF). Altında yumuşak temas gölgesi.

KADRAJ: Kavanoz ortada, kenarlarda %12 boşluk.

Çıktı: 1500x1500 PNG.
```

### 02-detay.png (1200×1500)
```
Aynı kavanoz, kapağı yanına açılmış şekilde. 4:5 dikey.

Kavanozun içindeki krem dokusu hafifçe görünüyor (açık bej, pürüzsüz).
Kapak kavanozun sağ önünde düz duruyor.

Zemin: açık sıcak gri (#FAFAF8) düz duvar. Yumuşak gölge.

Çıktı: 1200x1500 PNG.
```

### 03-sahne.png (1200×1500)
```
Aynı kavanoz doğal sahnede. 4:5 dikey.

SAHNE: Ahşap kütük dilimi üzerinde kavanoz. Yanında bir beyaz papatya ve
bir dal biberiye. Arka planda yumuşak odak dışı açık keten kumaş.
Sabah ışığı sol üstten.

Ürün birebir korunacak. Yazı, rozet, ikon YOK.

Çıktı: 1200x1500 PNG.
```

---

## 3. Doğal Bakım Seti (4 ürün)

**Referans:** `docs/ornek-gorseller/WhatsApp Image 2026-09-02 at 16.32.32 (1).jpeg`
**Çıktı klasörü:** `urun-bakim-seti/`

**Üründeki gerçek ayrıntılar (4 parça):**
1. **Sprey şişe** — açık gri/beyaz mat plastik, beyaz püskürtme başlıklı
2. **Krem kavanozu** — koyu amber cam, parlak siyah vidalı kapak
3. **Katran sabunu** — tan/kahverengi, elle kesilmiş dikdörtgen kalıp,
   üzerinde kabartma harflerle `KATRAN SABUNU` yazıyor
4. **Kabak lifi** — doğal bej renkli, yuvarlak, lifli doku

> Referanstaki `Uyuz solüsyonu`, `Uyuz kremi`, `Kabak lifi` etiket yazıları
> görsele sonradan eklenmiş — bunları **kaldır**, ürünlerin üzerinde
> yazı olmayacak. Yalnızca sabunun üzerindeki **kabartma** `KATRAN SABUNU`
> korunacak, çünkü o sabunun kendisinde var.

### 01-kapak.png (1500×1500, kare)
```
Referanstaki dört ürünün birlikte e-ticaret packshot'ı. Kare 1:1, 1500x1500.

ÜRÜNLER (birebir korunacak):
1. Açık gri mat plastik sprey şişe, beyaz püskürtme başlıklı
2. Koyu amber cam kavanoz, parlak siyah vidalı kapak
3. Tan/kahve renkli, elle kesilmiş katran sabunu kalıbı — üzerindeki
   KABARTMA "KATRAN SABUNU" yazısı korunacak
4. Doğal bej, yuvarlak, lifli kabak lifi

DEĞİŞECEK: "UYUZ SETİ" başlığı, "SET İÇERİĞİ" kutusu, "FAYDALARI" listesi,
"KAŞINTIYA SON!" rozeti, "KULLANIM ŞEKLİ" adımları, ürünlerin üzerine
eklenmiş etiket yazıları, yapraklar, havlu ve ahşap masa TAMAMEN kaldırılacak.

DÜZEN: Dördü yan yana bir sırada, ortada gruplanmış. Yükseklik sırası:
sprey şişe en uzun (arkada solda), kavanoz önde solda, sabun ortada,
kabak lifi sağda. Aralarında rahat boşluk, birbirine değmiyorlar.

SAHNE: Zemin ve arka duvar saf beyaz (#FFFFFF). Her ürünün altında
yumuşak temas gölgesi. Işık sol üstten.

KADRAJ: Grup ortada, kenarlarda %12 boşluk.

Çıktı: 1500x1500 PNG.
```

### 02-detay.png (1200×1500)
```
Aynı setten katran sabunu ve kabak lifi yakın çekim. 4:5 dikey.

Sabunun kabartma "KATRAN SABUNU" yazısı ve yüzey dokusu net görünüyor.
Kabak lifinin lifli dokusu yanında.

Zemin: açık sıcak gri (#FAFAF8). Yumuşak gölge.

Çıktı: 1200x1500 PNG.
```

### 03-sahne.png (1200×1500)
```
Dört ürün banyo rafı sahnesinde. 4:5 dikey.

SAHNE: Açık renkli ahşap yüzey üzerinde dördü. Yanlarında katlanmış
beyaz bir havlu ve bir dal okaliptüs. Arkada yumuşak odak dışı açık
renkli duvar.

Ürünler birebir korunacak. Yazı katmanı, rozet YOK.

Çıktı: 1200x1500 PNG.
```

---

## 4. Zayıflama ve Detoks Seti (2 ürün)

**Referans:** `docs/ornek-gorseller/WhatsApp Image 2026-09-02 at 16.32.32 (2).jpeg`
**Çıktı klasörü:** `urun-detoks-seti/`

**Üründeki gerçek ayrıntılar:**

1. **Sundetox Zayıflama Çayı** — silindir teneke kutu, gövdesi beyaz,
   üstü ve altı siyah şeritli. Etikette:
   - Sarı daire içinde yeşil yaprak + dairesel ok logosu
   - `SUNDETOX` (SUN sarı/turuncu, DETOX koyu gri)
   - `Zayıflama Çayı`
   - Küçük yazı: `Cascara Sagrada, Yeşil Çay, Oolong, Zencefil & daha fazlası.`
   - `100 g (50 * 2 g)`

2. **Sandetox Konsantre İçecek** — şeffaf plastik şişe, **sarı vidalı kapak**,
   içinde koyu bordo/siyah sıvı. Etikette:
   - Turuncu daire içinde yeşil yaprak + dairesel ok logosu
   - `SANDETOX` (SAN turuncu, DETOX koyu gri)
   - `Yaban mersinli Ananas sirkeli konsantre içecek`
   - `330 ML`

### 01-kapak.png (1500×1500, kare)
```
Referanstaki iki ürünün birlikte e-ticaret packshot'ı. Kare 1:1, 1500x1500.

ÜRÜNLER (etiketler BİREBİR korunacak):
1. Silindir teneke kutu: beyaz gövde, siyah üst ve alt şerit. Etikette
   sarı daire içinde yeşil yaprak logosu, "SUNDETOX" yazısı (SUN sarı,
   DETOX koyu gri), altında "Zayıflama Çayı", küçük içindekiler satırı
   ve "100 g (50 * 2 g)".
2. Şeffaf plastik şişe, SARI vidalı kapak, içinde koyu bordo sıvı.
   Etikette turuncu daire içinde yeşil yaprak logosu, "SANDETOX" yazısı
   (SAN turuncu, DETOX koyu gri), "Yaban mersinli Ananas sirkeli konsantre
   içecek", "330 ML".

DEĞİŞECEK: "Zayıflama ve Detox SETİ" başlığı, "+" işareti, "DOĞAL
İÇERİKLERLE GÜNLÜK DESTEK" rozeti, "Kullanım Şekli" ve "Birlikte
Kullanıldığında" kutuları, alttaki slogan şeridi, ananas, yaban mersini,
pancar, zencefil, çay bardağı ve tüm yapraklar TAMAMEN kaldırılacak.

DÜZEN: Teneke kutu solda, şişe sağda, yan yana, hafif 3/4 açılı.
Etiketleri kameraya dönük ve okunaklı.

SAHNE: Zemin ve arka duvar saf beyaz (#FFFFFF). Yumuşak temas gölgeleri.
Işık sol üstten.

KADRAJ: İkisi ortada, kenarlarda %12 boşluk.

Çıktı: 1500x1500 PNG.
```

### 02-detay.png (1200×1500)
```
Sundetox teneke kutunun tek başına yakın çekimi. 4:5 dikey.

Kutu hafif açılı, etiket tamamen okunaklı: logo, "SUNDETOX",
"Zayıflama Çayı", içindekiler satırı ve "100 g (50 * 2 g)".
Yanında iki adet süzen poşet duruyor.

Zemin: açık sıcak gri (#FAFAF8). Yumuşak gölge.

Çıktı: 1200x1500 PNG.
```

### 03-sahne.png (1200×1500)
```
İki ürün mutfak sahnesinde. 4:5 dikey.

SAHNE: Açık renkli ahşap tezgâh. Teneke kutu ve şişe yan yana, önlerinde
demlenmiş açık amber renkli bir bardak bitki çayı. Arkada yumuşak odak
dışı beyaz keten.

Sabah ışığı sol üstten. Ürünler ve etiketler birebir korunacak.
Yazı katmanı, rozet YOK.

Çıktı: 1200x1500 PNG.
```

---

## 5. Kan Yapıcı Set (4 parça)

**Referans:** `docs/ornek-gorseller/WhatsApp Image 2026-09-02 at 16.32.31.jpeg`
(sol üstteki panelin sağ alt köşesindeki ürün fotoğrafı)
**Çıktı klasörü:** `urun-kan-yapici-set/`

**Üründeki gerçek ayrıntılar (4 parça, ahşap tepsi üzerinde):**
1. **Çelik suyu** — şeffaf/beyaz plastik şişe, beyaz kapak, açık bej sıvı,
   üzerinde küçük beyaz etiket: `ÇELİK SUYU`
2. **Kan yapıcı macun** — koyu kahve/siyah cam kavanoz, siyah vidalı kapak
3. **D vitamini** — küçük amber cam damlalıklı şişe
4. **Mumio** — küçük koyu renkli şişe veya blister tablet paketi (gümüş)

> Referans küçük ve düşük çözünürlüklü. Ayrıntıdan emin olamadığın yerde
> **sade tut**: etiket uydurma, yalnızca "ÇELİK SUYU" yazısını koru.

### 01-kapak.png (1500×1500, kare)
```
Referanstaki dört parçalık setin e-ticaret packshot'ı. Kare 1:1, 1500x1500.

ÜRÜNLER:
1. Şeffaf/beyaz plastik şişe, beyaz kapak, içinde açık bej sıvı,
   üzerinde küçük beyaz etikette "ÇELİK SUYU" yazıyor
2. Koyu kahve/siyah cam kavanoz, siyah vidalı kapak (macun için)
3. Küçük amber cam damlalıklı şişe
4. Gümüş blister tablet paketi

DEĞİŞECEK: "Kan Yapıcı Set" başlığı, açıklama metni, "Kullanımı" listesi,
"100% ORGANIC" rozeti, filigran, ahşap tepsi ve tüm arka plan TAMAMEN
kaldırılacak. Ekran görüntüsü çerçevesi ve WhatsApp yazışmaları da
kaldırılacak.

DÜZEN: Dördü ortada gruplanmış. Plastik şişe en uzun (arkada solda),
kavanoz önde ortada, damlalıklı şişe sağda, blister paket önde solda
düz duruyor.

SAHNE: Zemin ve arka duvar saf beyaz (#FFFFFF). Yumuşak temas gölgeleri.
Işık sol üstten.

ÖNEMLİ: "ÇELİK SUYU" dışında hiçbir ürüne yazı ekleme. Etiket uydurma.

KADRAJ: Grup ortada, kenarlarda %12 boşluk.

Çıktı: 1500x1500 PNG.
```

### 02-detay.png (1200×1500)
```
Setten kavanoz ve damlalıklı şişenin yakın çekimi. 4:5 dikey.

Koyu cam kavanoz önde, amber damlalıklı şişe arkasında hafif solda.
Malzeme dokuları (cam parlaklığı) net.

Zemin: açık sıcak gri (#FAFAF8). Yumuşak gölge.
Yazı ekleme.

Çıktı: 1200x1500 PNG.
```

### 03-sahne.png (1200×1500)
```
Dört parça doğal sahnede. 4:5 dikey.

SAHNE: Açık renkli ahşap tepsi üzerinde dördü. Yanında bir dal kuru
kekik. Arkada yumuşak odak dışı açık keten.
Sabah ışığı sol üstten.

Ürünler birebir korunacak. Yazı katmanı, rozet YOK.

Çıktı: 1200x1500 PNG.
```

---

## 6. ÇIKTI YAPISI

Proje kökünde şu klasörleri oluştur ve dosyaları **tam bu isimlerle** koy:

```
organiksifa/
├── urun-d-vitamini/
│   ├── 01-kapak.png      1500x1500  KARE
│   ├── 02-detay.png      1200x1500
│   └── 03-sahne.png      1200x1500
├── urun-merhem/
│   ├── 01-kapak.png
│   ├── 02-detay.png
│   └── 03-sahne.png
├── urun-bakim-seti/
│   ├── 01-kapak.png
│   ├── 02-detay.png
│   └── 03-sahne.png
├── urun-detoks-seti/
│   ├── 01-kapak.png
│   ├── 02-detay.png
│   └── 03-sahne.png
└── urun-kan-yapici-set/
    ├── 01-kapak.png
    ├── 02-detay.png
    └── 03-sahne.png
```

Dosya adlarındaki `01-`, `02-`, `03-` ön ekleri **sırayı belirliyor**;
`01` her zaman kapak olur. Değiştirme.

---

## 7. TESLİM SONRASI KONTROL

Her görseli tam boyutta aç ve şunlara bak:

- [ ] `01-kapak.png` gerçekten **kare** mi? (1500×1500)
- [ ] Kapağın arka planı **düz beyaz** mı, doku/gradyan var mı?
- [ ] Etiket yazıları referanstakiyle **birebir** mi? Uydurma harf var mı?
- [ ] Türkçe karakterler doğru mu? (`ğ ı ş ç ö ü İ`)
- [ ] İnfografikten kalan yazı, ikon, rozet, ok var mı?
- [ ] Ürünün rengi ve kapak tipi referanstakiyle aynı mı?
- [ ] İnsan eli, model, stok fotoğraf hissi var mı?

Bozuk çıkanı aynı prompt'la tekrar üret — AI her seferinde farklı sonuç
verir, 2-3 denemede istediğin çıkar.

---

## 8. HAZIR OLUNCA

Görselleri klasörlere koyduktan sonra haber ver. Yükleme şu iki komutla
yapılıyor (ben çalıştıracağım):

```bash
python scripts/urun-gorsel-hazirla.py urun-d-vitamini
npm run urun:yukle urun-d-vitamini
```

Betik görselleri WebP'ye çevirip Supabase Storage'a yüklüyor, ürünü
veritabanına ekliyor ve kapağın kare olup olmadığını kontrol edip
"hero'da gösterilir" ya da "hero'ya uygun değil" diye bildiriyor.
