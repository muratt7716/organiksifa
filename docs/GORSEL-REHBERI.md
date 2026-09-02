# Görsel Rehberi — Organik Şifa

Bu dosya sana ve ablana. Site, **hangi görseli yüklersen yükle düzgün görünecek**
şekilde kuruldu — aşağıdakiler zorunluluk değil, sadece "daha iyi olsun" rehberi.

---

## 1. Sistem senin için ne yapıyor

Panelden bir görsel yüklediğinde site otomatik olarak:

- Görseli **WebP** formatına çevirip sıkıştırıyor (3 MB → ~180 KB)
- Görselin kenar rengini ölçüp kaydediyor
- Ürün kartında görseli **kırpmadan**, o renkteki kare zeminin ortasına yerleştiriyor
- Ürün sayfasında dikey görselleri tam boyunda gösteriyor

**Yani:** dikey infografik yükleyebilirsin, kare yükleyebilirsin, ekran görüntüsü
yükleyebilirsin. Hiçbiri bozulmaz.

---

## 2. Yine de en iyi sonuç için

| Öncelik | Ne | Neden |
|---|---|---|
| 1 | **İlk görsel kapak olur** — en net, ürünün tamamının göründüğü görseli başa koy | Kartlarda ve Google'da bu görünür |
| 2 | Kapak görseli **kare veya kareye yakın** olsun | Kartta en dolu görünür |
| 3 | Uzun infografikleri **2., 3. sıraya** koy | Ürün sayfasında tam boyunda gösterilir |
| 4 | Görselin üstünde telefon ekran görüntüsü (saat, pil, WhatsApp arayüzü) varsa kırp | Amatör görünüyor |

---

## 3. Telefonla ürün fotoğrafı çekmek (en iyi yol, 20 dakika)

1. Beyaz bir A4 kâğıdı düz bir masaya koy, arkaya da bir kâğıt dik
2. **Pencere kenarında**, ama doğrudan güneş almayan bir yerde çek
3. Flaş **kapalı**
4. Ürünü kadrajın ortasına al, dört kenarda boşluk bırak
5. Tepeden değil, **hafif yukarıdan açılı** çek
6. Her ürün için 2 kare: biri düz önden, biri hafif açılı

Bu 6 adım, ücretli stüdyo çekiminin %80'ini veriyor.

---

## 4. Yapay zekâ ile görsel üretmek

Elindeki gerçek fotoğrafı **referans** olarak yükleyip yeni sahne ürettirmek
2026'da standart bir yöntem. Kullanabileceğin araç: **Gemini (Nano Banana Pro)**.

> ChatGPT'de dolaşan `/showcase`, `/metaad`, `/product` gibi "komutlar" OpenAI'ın
> resmî özelliği değil — bağlamda düz talimat olarak okunan **kısaltmalar**.
> İşe yarıyorlar, ama "Create image /product ..." diye üretim emriyle başlamalısın,
> yoksa ChatGPT ne demek istediğini açıklamaya çalışır.

### Beyaz zeminli ürün fotoğrafı

```
Bu referans görseldeki ürünün profesyonel e-ticaret packshot'ını üret.

DEĞİŞMEYECEK: Ürünün şekli, oranları, rengi, kapak tipi ve etiket üzerindeki
TÜM YAZILAR birebir referanstaki gibi kalacak. Etiketi yeniden yorumlama,
Türkçe karakterleri (ğ ı ş ç ö ü İ) bozma.

DEĞİŞECEK:
- Arka plan: saf beyaz (#FFFFFF), tamamen temiz
- Işık: yumuşak stüdyo ışığı, sol üstten
- Kadraj: kare (1:1), ürün ortada, kenarlarda %12 boşluk
- Altında hafif, gerçekçi temas gölgesi
- Referanstaki yapraklar, meyveler, yazılar, ikonlar kaldırılacak

Çıktı: 2048x2048, keskin, gerçek ürün fotoğrafı kalitesinde.
```

### Şeffaf arka planlı PNG

```
Aynı ürünü şeffaf arka planlı PNG olarak ver. Arka plan tamamen saydam,
gölge yok. Kenarlar temiz kesilsin, etrafında beyaz hale kalmasın.
Etiket yazıları değişmesin.
```

### Yaşam tarzı sahnesi (sosyal medya ve ana sayfa için)

```
Aynı ürünü doğal bir sahneye yerleştir. Ürünün kendisi hiç değişmesin.
Sahne: açık ahşap yüzey, yanında taze adaçayı ve zeytin dalları, arkada
yumuşak odaklı beyaz keten. Sabah ışığı, sıcak ama sakin.
Renk paleti: beyaz, açık yeşil, amber cam. Kadraj 4:5 dikey.
```

### Tek kural

Ürettiğin görseli **yayınlamadan önce tam boyutta aç ve etikete yakınlaş.**
Yazılar bozulduysa kullanma — kargodan çıkan ürün sitedekiyle aynı görünmeli.

---

## 5. Arka plan silme (ürünü hiç değiştirmez, en güvenli yol)

- **remove.bg** veya **Photoroom** — tarayıcıdan, ücretsiz, saniyeler sürer
- Gemini'ye de yaptırabilirsin:

```
Bu görselden sadece ürünü ayıkla, arka planı tamamen şeffaf yap.
Ürünün üzerindeki etiketi, yazıları ve renkleri hiçbir şekilde değiştirme
veya yeniden çizme — orijinal pikselleri koru. Yalnızca arka planı kaldır.
Çıktı: şeffaf arka planlı PNG.
```

---

## 6. Kaynaklar

- [ChatGPT Slash Commands: The Complete 2026 Guide](https://www.artifilog.com/posts/chatgpt-slash-commands-complete-guide-2026)
- [Nano Banana Pro (Gemini 3 Pro Image): Developer Guide & API 2026](https://dev.to/akaranjkar08/nano-banana-pro-gemini-3-pro-image-developer-guide-api-2026-104c)
- [Nano Banana Prompts for Product Photography (E-commerce)](https://sureprompts.com/blog/nano-banana-product-photography-prompts)
- [Google Gemini for Product Photos vs Dedicated Tools](https://nightjar.so/blog/google-gemini-product-photos-vs-dedicated-ai-tools)
