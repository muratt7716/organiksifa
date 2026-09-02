# Organik Şifa — Tasarım Dokümanı

**Tarih:** 2 Eylül 2026
**Durum:** Onay bekliyor
**Kapsam:** Organik gıda takviyesi ve doğal kozmetik satan e-ticaret sitesi — müşteri ön yüzü + yönetim paneli

---

## 1. Özet

Türkiye'de faaliyet gösteren küçük bir işletme için e-ticaret sitesi. Ödeme sitede
alınmaz; müşteri sepeti doldurur, iletişim formunu tamamlar, sipariş veritabanına
kaydedilir ve müşteri sipariş numarasıyla WhatsApp'a yönlendirilir. Ödeme ve kargo
WhatsApp üzerinden konuşulur.

**Kritik kısıt:** Panelin asıl kullanıcısı teknik olmayan bir kişidir (site sahibinin
ablası). Bu, sistemin her katmanında belirleyici olmuştur: bundle modeli, varyant
sistemi ve adet bazlı stok bu yüzden reddedilmiştir.

### Başarı ölçütü

Faz 1 sonunda ablanın **hiç yardım almadan** bir ürünü fotoğrafıyla birlikte
siteye ekleyebilmesi. Bu sağlanamazsa panel yeniden tasarlanır.

---

## 2. Alınan kararlar

| Konu | Karar | Gerekçe |
|---|---|---|
| Sipariş akışı | Sepet → Checkout → DB → WhatsApp | Sipariş kaydı, takip ve bildirim ancak böyle mümkün |
| Varyant | **Yok** | Katalogda gramaj varyantı yok; sigorta olarak `varyant_grup_id` alanı eklenir |
| Set/bundle | **Yok** — setler normal ürün | Panel sadeliği. `set_icerigi` metin listesiyle telafi edilir |
| Stok | **Var/Yok anahtarı** | Adet takibi tek kişilik operasyonda yük üretir, fayda üretmez |
| Marka | Opsiyonel alan | Bazı ürünler kendi markası, bazıları başka marka |
| Kategori | Panelden yönetilir, hazır liste ile gelir | Esneklik + sadelik |
| Kargo | Panelden ayarlanır: aç/kapa, limit, ücret + ürün bazlı istisna | Karar ablaya bırakıldı |
| Yorum | **Var**, moderasyonlu | SEO ve özgün metin kazancı; onaysız yayınlanmaz |
| Hosting | Vercel Hobby (geliştirme) → domain yayından önce | Ticari kullanım riski bilinerek kabul edildi |
| Veritabanı | Supabase Postgres | Ücretsiz, taşınabilir, Storage + Auth aynı yerde |
| Bildirim | Telegram (v1), e-posta kodda hazır | Resend domain ister, `*.vercel.app`'te çalışmaz |
| Yasal alanlar | Yapı kurulur, içerik sonra doldurulur | Şahıs şirketi var; yayın öncesi kontrol listesinden takip edilir |

### Bilinçli olarak yapılmayanlar

Kupon kodu tablosu · Müşteri hesabı/girişi · Ürün SSS tablosu · Stok hareket kaydı ·
Çoklu adres · Fiyat geçmişi tablosu · Ayrı `customers` tablosu · Ürün içi arama (30 üründe gereksiz)

---

## 3. Teknoloji yığını

| Katman | Seçim | Sürüm |
|---|---|---|
| Çatı | Next.js (App Router, Server Components + Server Actions) | 16.3.4 |
| Dil | TypeScript (strict) | 5.x |
| UI | React | 19.2.8 |
| Stil | Tailwind CSS | 4.3.3 |
| Bileşen | shadcn/ui (projeye kopyalanır, bağımlılık değil) | — |
| ORM | Drizzle | 0.45.2 |
| Veritabanı | Supabase Postgres | — |
| Depolama | Supabase Storage (public bucket) | — |
| Panel girişi | Supabase Auth (e-posta + şifre) | — |
| Doğrulama | Zod | 4.5.4 |
| Sepet | Zustand + localStorage | — |
| Görsel sıkıştırma | browser-image-compression (tarayıcıda) | 2.0.2 |
| İkon | lucide-react | — |
| Test | Vitest (birim) + Playwright (uçtan uca) | — |

### Taşınabilirlik ilkesi

Vercel'e özgü API kullanılmaz. Migration'lar `git`'te SQL dosyası olarak durur.
Başka bir sunucuya taşınma senaryosunda yalnızca `DATABASE_URL` ve deploy hedefi
değişir. Bu, "Vercel Hobby ticari kullanıma kapalı" riskinin karşılığıdır.

### Veritabanı bağlantısı (kritik konfigürasyon)

```
DATABASE_URL  → Supavisor transaction pooler, port 6543, postgres-js { prepare: false }
DIRECT_URL    → doğrudan bağlantı, port 5432, sadece migration için
```

Transaction pooler prepared statement desteklemez; `prepare: false` verilmezse
üretimde teşhis edilmesi zor `prepared statement already exists` hataları çıkar.
Migration'lar pooler üzerinden çalışmaz, direct bağlantı gerekir.

---

## 4. Veri modeli

10 tablo. Tüm para alanları `numeric(10,2)`.

### 4.1 `settings` — tek satır (id = 1)

```
site_adi                text
whatsapp_numarasi       text        -- E.164, sadece rakam: 905321112233
whatsapp_sablon         text        -- mesaj şablonu
kargo_bedava_acik       boolean
kargo_bedava_limit      numeric(10,2)
kargo_ucreti            numeric(10,2)
duyuru_metni            text
duyuru_acik             boolean
instagram_url           text
iletisim_telefon        text
iletisim_email          text
-- Firma bilgileri (yayın öncesi doldurulur, yasal sayfalara otomatik işler)
ticaret_unvani          text
adres                   text
mersis_no               text
vergi_dairesi           text
vergi_no                text
etbis_dogrulama_url     text
bildirim_kanallari      jsonb       -- { telegram: true, email: false }
guncellendi_at          timestamptz
```

### 4.2 `categories`

```
id uuid pk · ad text · slug text unique · sira int · aktif boolean · created_at
```

Başlangıç verisi: Setler · Takviye Ürünler · Cilt Bakımı · Bitkisel Yağlar ·
Çay & Detoks · Sabun & Temizlik

### 4.3 `brands`

```
id uuid pk · ad text · slug text unique · aktif boolean
```

Ürüne bağlanması opsiyonel (`products.marka_id` nullable).

### 4.4 `products`

```
id uuid pk
baslik              text not null
slug                text unique      -- başlıktan otomatik, çakışmada -2
kisa_aciklama       text             -- kartta ve meta description'da
aciklama            text             -- ürün sayfasında, min 300 karakter önerilir
fiyat               numeric(10,2) not null
eski_fiyat          numeric(10,2)    -- nullable, üstü çizili gösterim
kdv_orani           numeric(4,2)     -- panelde gizli, settings varsayılanından gelir
kategori_id         uuid → categories (on delete set null)
marka_id            uuid → brands (nullable)
set_icerigi         text[]           -- "Uyuz kremi", "Katran sabunu", ...
varyant_grup_id     text             -- nullable, sigorta alanı
stokta              boolean default true
yayinda             boolean default true
one_cikan           boolean default false
kargo_bedava        boolean default false
ortalama_puan       numeric(2,1)     -- yorum onaylanınca güncellenir
yorum_sayisi        int default 0
sira                int default 0
seo_baslik          text             -- boşsa baslik kullanılır
seo_aciklama        text             -- boşsa kisa_aciklama kullanılır
created_at · updated_at
```

**Index:** `slug`, `kategori_id`, `(yayinda, sira)`

### 4.5 `product_images`

```
id uuid pk
urun_id      uuid → products (on delete cascade)
url          text
storage_path text          -- silme işlemi için
alt          text          -- panelde boş bırakılamaz
genislik     int
yukseklik    int
zemin_rengi  text          -- #RRGGBB, yükleme anında kenar renginden hesaplanır
tur          text          -- kapak | galeri | infografik
yayinda      boolean default true
sira         int
created_at
```

**`zemin_rengi` neden var:** Yüklenen görseller düzensiz orandadır (dikey
infografik, kare, ekran görüntüsü). Kart, görseli **kırpmadan** (`object-fit: contain`)
bu renkteki kare zeminin ortasına yerleştirir. Kırpma yapılmadığı için hiçbir
görselin ortasından şerit alınmaz; zemin görselin kendi rengi olduğu için
boşluk kasıtlı görünür.

### 4.6 `orders`

```
id uuid pk
siparis_no              text unique      -- ORD-000483 (yılsız, sonsuza kadar tutarlı)
erisim_token            uuid             -- kalıcı sipariş sayfası linki
idempotency_key         uuid unique      -- F5 / çift submit koruması

musteri_adi             text
telefon                 text
telefon_e164            text             -- normalize, INDEX'li, panelde arama için
email                   text             -- nullable
il · ilce               text             -- açılır listeden, serbest metin değil
adres                   text
not                     text

ara_toplam              numeric(10,2)
indirim_tutari          numeric(10,2) default 0
indirim_aciklamasi      text             -- WhatsApp'ta yapılan pazarlık
kargo_ucreti            numeric(10,2)
kargo_kurali_snapshot   text             -- hangi kural neden uygulandı
toplam_kdv              numeric(10,2)
toplam                  numeric(10,2)

durum                   text             -- yeni | goruseldi | onaylandi | kargoda | teslim | iptal
iptal_nedeni            text
odeme_durumu            text             -- bekliyor | alindi | kismi | iade
odeme_yontemi           text             -- havale | kapida | diger
odenen_tutar            numeric(10,2)
odeme_at                timestamptz

kargo_firmasi           text
kargo_takip_no          text
kargoya_verildi_at      timestamptz

whatsapp_tiklama        int default 0
whatsapp_son_tiklama_at timestamptz

mesafeli_sozlesme_onay_at  timestamptz
kvkk_onay_at               timestamptz
ticari_ileti_izni          boolean default false
ip                         inet
user_agent                 text
admin_notu                 text
created_at · updated_at
```

**Sipariş numarası:** Postgres sequence. "Son siparişi bul, 1 ekle" mantığı iki
eşzamanlı siparişte aynı numarayı üretir.

**Ödeme durumu ayrı eksendir.** Sipariş durumuyla aynı enum'a karıştırılmaz —
sonradan ayırmak veri göçü gerektirir.

### 4.7 `order_items`

```
id uuid pk
siparis_id        uuid → orders (on delete cascade)
urun_id           uuid → products (on delete set null)
baslik_snapshot   text
slug_snapshot     text
gorsel_snapshot   text
birim_fiyat       numeric(10,2)
kdv_orani_snapshot numeric(4,2)
adet              int
satir_toplam      numeric(10,2)
```

**Snapshot kuralı:** Sipariş anındaki başlık, görsel ve fiyat satıra kopyalanır.
Ürün fiyatı sonradan değişse bile geçmiş siparişler değişmez.

### 4.8 `order_events`

```
id uuid pk · siparis_id uuid → orders · tip text
eski_deger text · yeni_deger text · aktor_id uuid · not text · created_at
```

Kim ne zaman hangi durumu değiştirdi. İki kullanıcı olduğu ve iade uyuşmazlığında
kanıt gerektiği için zorunlu. Sonradan eklemek geçmişi kurtarmaz.

### 4.9 `reviews`

```
id uuid pk
urun_id            uuid → products (on delete cascade)
ad                 text          -- "Ayşe K."
puan               int           -- 1-5
yorum              text
durum              text          -- bekliyor | onayli | reddedildi
siparis_id         uuid → orders (nullable)
dogrulanmis_alici  boolean default false
satici_yaniti      text
ip                 inet
created_at · onay_at
```

**Moderasyon zorunlu:** Yorum onaylanmadan sitede görünmez. Bu tek kural spam
sorununu ortadan kaldırır — bot 500 yorum atsa hiçbiri yayına çıkmaz.

**Doğrulanmış alıcı:** Sipariş `teslim` durumuna geçince ablan sipariş linkini
WhatsApp'tan gönderir; müşteri kendi sipariş sayfasından yorum yazarsa rozet alır
ve yorum siparişe bağlanır. Ürün sayfasından yazılan yorumlarda rozet olmaz.

Yorum onaylandığında `products.ortalama_puan` ve `yorum_sayisi` güncellenir
(katalog sayfasında 30 ürün için toplama sorgusu çalıştırmamak için).

### 4.10 `rate_limits`

```
anahtar text pk · sayac int · pencere_at timestamptz
```

IP + telefon başına 15 dakikada 3 sipariş. Ayrıca honeypot alanı.

### 4.11 `admin_profiles`

```
id uuid pk (= auth.users.id) · ad text · rol text (owner|staff) · created_at
```

---

## 5. Güvenlik

### 5.1 Fiyat manipülasyonu

Server Action'a **yalnızca `[{ urun_id, adet }]`** gönderilir. Başlık, fiyat,
kargo kuralı, KDV ve toplam sunucuda veritabanından okunarak hesaplanır.
`ara_toplam` ve `toplam` client'tan kabul edilmez.

Zod "sayı mı" der, "doğru fiyat mı" demez. Sepet localStorage'dadır ve
devtools'tan değiştirilebilir.

### 5.2 Veritabanı erişimi

Tarayıcı veritabanına hiç erişmez. RLS'e güvenilmez; yetki kontrolü Server
Action katmanında tek yerde yapılır (fail-closed). Service key yalnızca sunucuda.

### 5.3 Görsel yükleme

Sunucu imzalı yükleme URL'i üretir, tarayıcı doğrudan Supabase Storage'a yükler.
Dosya Vercel fonksiyonundan geçmez. Bucket **public**'tir — imzalı URL yalnızca
yükleme içindir; okuma imzalı olsaydı her URL benzersiz olur, CDN önbelleğe
alamaz ve Supabase'in 5 GB/ay trafik kotası çok erken dolardı.

### 5.4 Diğer

- `.env*` dosyaları `.gitignore`'da, ilk commit'ten önce
- Honeypot + rate limit + (opsiyonel) Cloudflare Turnstile
- Idempotency key ile çift sipariş koruması
- POST-redirect-GET

---

## 6. Görsel işleme akışı

```
Ablan telefondan/bilgisayardan görsel seçer
   ↓
TARAYICIDA: HEIC kontrolü → WebP'ye çevir + sıkıştır (~180 KB) → kenar rengini hesapla
   ↓
Önizleme gösterilir — ablan görmeden kaydedemez
   ↓
Sunucudan imzalı yükleme URL'i alınır
   ↓
Tarayıcı → Supabase Storage (doğrudan)
   ↓
product_images kaydı: url, boyut, zemin_rengi, tur, sira
```

**HEIC uyarısı:** iPhone "Yüksek Verimlilik" modundaysa HEIC üretir; tarayıcı
decode edemez ve sıkıştırma sessizce başarısız olur. Uzantı/MIME kontrolü yapılır,
HEIC ise açık uyarı gösterilir.

**Öksüz dosya temizliği:** Ürün silinince Storage dosyaları da silinir.
`urun_id IS NULL AND created_at < now() - interval '2 days'` kayıtları haftalık
cron ile temizlenir.

---

## 7. Sipariş akışı

```
Sepet (localStorage)
   ↓ sunucuya sadece [{urun_id, adet}]
Checkout formu (ad, telefon, il/ilçe açılır liste, adres, not,
                iki ayrı onay kutusu — hiçbiri önceden işaretli değil)
   ↓ Zod + sunucu tarafı hesaplama
orders + order_items (snapshot'lı, sequence'ten sipariş no)
   ↓
/siparis/{siparis_no}?t={token}   ← kalıcı, paylaşılabilir, F5 güvenli
   ↓
[ WhatsApp'tan Onayla ]
   ↓
Telegram bildirimi (after() ile yanıttan sonra, siparişi bloklamaz)
```

### WhatsApp entegrasyonunun 9 tuzağı ve karşılığı

| Tuzak | Karşılık |
|---|---|
| Ablan numarayı "0532 111 22 33" yazarsa tüm linkler sessizce ölür | Panelde otomatik E.164 normalize + canlı önizleme + **"Test Et" butonu** |
| `encodeURI` `&` karakterini kaçırmaz, mesaj kesilir | `encodeURIComponent`, satır sonu `%0A` |
| ~1000 karakter üstü mesaj kırpılır | **Sipariş numarası mesajın en başına** |
| Instagram içi tarayıcı wa.me'yi uygulamaya taşımaz | Numara düz metin + **"Numarayı Kopyala"** butonu |
| iOS Safari `window.open`'ı bloklar | Düz `<a href target="_blank" rel="noopener">` |
| Masaüstünde WhatsApp Web + QR duvarı | Sipariş özeti ekranda kalır, numara görünür |
| wa.me mesajı **otomatik göndermez** | Ekranda büyük harfle: "Açılan sohbette mesajı GÖNDER'e basın" |
| Teşekkür sayfası tek kullanımlık | `?t=token` ile kalıcı link + panelde "WhatsApp açılmamış" filtresi |
| Boolean tıklama bilgisi ölçüm vermez | `whatsapp_tiklama` sayacı + zaman damgası |

---

## 8. Bildirim mimarisi

```ts
interface NotificationChannel {
  ad: string
  aktifMi(): boolean
  gonder(olay: YeniSiparis): Promise<void>
}
```

| Kanal | Durum |
|---|---|
| `TelegramChannel` | v1 — çalışır, ücretsiz, limitsiz |
| `EmailChannel` (Resend) | Kodda hazır, **domain gelene kadar kapalı** |
| `ConsoleChannel` | Geliştirme |
| `EvolutionWhatsAppChannel` | İleride, tek dosya |

Kanallar `settings.bildirim_kanallari` ile panelden açılır/kapanır.
Bildirim **hiçbir zaman siparişi bloklamaz**; hata loglanır, sipariş kaydedilir.

> **Uyarı:** Evolution API resmî olmayan bir WhatsApp entegrasyonudur ve numara
> banlanabilir. İş numarasında değil, ayrı bir bildirim numarasında kullanılmalı.

---

## 9. Panel — 8 ekran

| Ekran | İçerik |
|---|---|
| Giriş | E-posta + şifre |
| Ana sayfa | Bugünkü sipariş + ciro, bekleyen siparişler, ödemesi bekleyenler |
| Siparişler | Liste + arama (sipariş no / telefon / ad) + detay + durum + ödeme + kargo takip + "Müşteriye WhatsApp yaz" |
| Ürünler | Liste; satır içi **"stokta" ve "yayında"** anahtarları |
| Ürün ekle/düzenle | Tek sayfa, 3 grup form |
| Kategoriler | Ekle / düzenle / sırala / gizle |
| Yorumlar | Bekleyen sayısı rozetli · Onayla / Reddet / Satıcı yanıtı |
| Ayarlar | Site, WhatsApp, kargo, duyuru, sosyal medya, firma bilgileri |

### Ürün formu

```
FOTOĞRAFLAR    [ + Fotoğraf ekle ]   sürükleyerek sırala, ilki kapak
ÜRÜN BİLGİSİ   Ürün adı · Fiyat · Eski fiyat · Kategori · Marka
               Set içeriği (her satır bir bileşen)
               Kısa açıklama · Açıklama
GÖRÜNÜRLÜK     ☑ Yayında  ☑ Stokta var  ☐ Öne çıkar  ☐ Kargo bedava
```

### Teknik olmayan kullanıcı için kurallar

- İngilizce terim yok ("SKU" değil "Ürün Kodu")
- `slug` başlıktan otomatik türetilir, formda görünmez
- `seo_baslik` / `seo_aciklama` boşsa otomatik doldurulur
- `sira` yerine sürükle-bırak
- Fiyat alanı Türkçe ondalık ayracını kabul eder (`1.250,00` ve `1250.50`)
- Silme = arşive taşır, geri alınabilir
- Kaydedilmeden çıkışta uyarı
- Her ekranda **tek** belirgin ana buton
- Hata mesajları çözüm önerili: "Fiyat girmen gerekiyor — örnek: 450"
- Her tıklanabilir alan ≥ 44×44 px
- Tam responsive: telefon, tablet, laptop, masaüstü

---

## 10. Ön yüz

### Sayfalar

Ana sayfa · Tüm ürünler · Kategori · Ürün detay · Sepet · Ödeme ·
Sipariş sonucu (`/siparis/{no}?t=`) · Hakkımızda · İletişim · 6 yasal sayfa

### Tasarım yönü: "Aktar Rafı"

Tasarım, ürünlerin gerçek dünyasından türetilmiştir: amber cam damlalık şişeleri,
koyu kahve merhem kavanozu, elle kesilmiş katran sabunu, ham kabak lifi. Ortak
payda, her üründeki **yoğun bilgi etiketidir** — müşteri "içinde ne var, nasıl
kullanılır" diye alır.

Bu yüzden sitenin organizasyon fikri **etiket**tir: ürün sayfasındaki sağ panel
gerçek bir ürün etiketi gibi okunur; katalogdaki kartlar kutu değil, **raf**
üzerinde durur.

Bu yön, elde profesyonel ürün fotoğrafı olmamasını bir dezavantaj olmaktan
çıkarıp tasarımın omurgası hâline getirir.

### Renk

| Ad | Kod | Kullanım | Kontrast |
|---|---|---|---|
| Kâğıt | `#FFFFFF` | Ana zemin | — |
| Yaprak tozu | `#EDF1E8` | Bölüm zemini, kart | — |
| Şifa yeşili | `#1F5138` | Buton, link, başlık | beyazda 9.1:1 |
| Amber cam | `#A8681C` | Fiyat, indirim rozeti | beyazda 4.6:1 |
| Mürekkep | `#17211B` | Gövde metni | 15.8:1 |
| Kabuk | `#D8D2C4` | Raf çizgisi, ayraç | — |

```
yesil:  50 #F2F7F3 · 100 #E1EDE5 · 200 #C2DACB · 300 #94BFA6 · 400 #5E9C7B
        500 #367A57 · 600 #2A6446 · 700 #1F5138 · 800 #17402C · 900 #102D1F
amber:  100 #F5E7CE · 300 #E0B878 · 500 #C2842A · 600 #A8681C · 700 #8A5316
notr:   0 #FFFFFF · 100 #EDF1E8 · 200 #D8D2C4 · 400 #9AA096 · 600 #5C665C · 900 #17211B
```

**Açık yeşil buton rengi olamaz** — `#EDF1E8` üstüne beyaz yazı ~1.2:1 kontrast
verir, WCAG AA 4.5:1 ister. Açık yeşil zemin, koyu yeşil mürekkeptir.

### Tipografi

- **Başlık / ürün adı:** Newsreader (serif)
- **Arayüz / gövde / fiyat:** Inter (tabular rakamlar)

Serif seçimi ürünlerin kendi etiketlerinden gelir ("ALTIN YAĞ KARIŞIMI",
"HÜCRE YENİLEYİCİ MERHEM" serif dizilmiştir). Newsreader seçildi çünkü moda
serif'lerin aksine az kullanılıyor, ekran okuması için tasarlandı ve Türkçe
karakterleri tam destekliyor. Kurulumda `İ ı ğ ş ç ö ü` doğrulanacak; sorun
çıkarsa Literata'ya düşülecek.

### Ölçek ve ritim

```
Tip:     12 · 14 · 16 · 20 · 25 · 31 · 39 · 49
Başlık:  clamp(2rem, 1rem + 3.2vw, 3.5rem)
Boşluk:  4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96   (4pt ızgara)
Köşe:    buton 6px · görsel 2px · panel 12px · raf çizgisi 0
Gölge:   sadece 2 — yapışkan çubuk, açılır katman. Dekoratif gölge yok.
Hareket: mikro 160ms · durum 240ms · giriş 420ms · çıkış girişin %65'i
Kırılım: 375 · 640 · 768 · 1024 · 1280 · 1536
```

### Ürün kartı — düzensiz görsel toleransı

```
┌──────────────┐   1:1 kare çerçeve
│              │   zemin = product_images.zemin_rengi
│   görsel     │   object-fit: contain (KIRPMA YOK)
│              │
├──────────────┤   ← raf çizgisi (#D8D2C4), gölge yok
 Ürün adı
 890 ₺   ⭐4,8 (7)
 Sipariş üzerine hazırlanır
```

### Hareket ve sinematik katman

Motor **saf CSS** (`animation-timeline: scroll()` / `view()`), GSAP değil:

| | GSAP + ScrollTrigger | CSS `animation-timeline` |
|---|---|---|
| Boyut | ~35 KB gzip | **0 KB** |
| Çalıştığı yer | Ana iş parçacığı, her kaydırma karesi | Compositor — takılma imkânsız |
| `prefers-reduced-motion` | Elle | Yerleşik |
| Desteklenmeyen tarayıcı | Efekt yok, JS yine iner | Efekt yok, maliyet de yok |

`animation-timeline` desteği kurulumda doğrulanacak; olmayan tarayıcıda site
**statik ama kusursuz** hâle düşer.

**Nerede sinematik, nerede hız:**

```
Ana sayfa        → katmanlı giriş, kelime kelime aydınlanan metin, perde geçişi
Marka hikâyesi   → yapışkan sahne + scrub
Kategori girişi  → clip-path açılış (hafif)
──────────────────────────────────────────────
Katalog          → animasyon yok
Ürün detay       → tek mikro-etkileşim (sepete ekleme akışı)
Sepet / Ödeme    → sıfır süs
Panel            → sıfır süs
```

Hero, süzülen ürün PNG'sine **bağımlı değildir** — tipografi, renk alanları ve
inline SVG botanik çizgiler üzerine kurulur (dış görsel gerektirmez, ~0 KB).
İleride şeffaf PNG gelirse hero'ya eklenir.

---

## 11. Performans bütçeleri ve SLO

### Ön yüz

| Ölçüt | Hedef |
|---|---|
| Birincil cihaz | Mobil / 4G (trafik Instagram'dan) |
| LCP | ≤ 2.0 sn (mobil p75) |
| INP | ≤ 200 ms |
| CLS | ≤ 0.05 |
| JS (gzip) | Ana sayfa ≤ 90 KB · Katalog ≤ 70 KB · Ürün ≤ 80 KB · Ödeme ≤ 90 KB · Panel ≤ 180 KB |
| Lighthouse | Performans ≥ 90 · Erişilebilirlik ≥ 95 |
| WCAG | 2.2 AA |

### Arka uç

| Ölçüt | Değer |
|---|---|
| Okuma/yazma | ~200:1 |
| Zirve yük | < 5 istek/sn |
| Veri hassasiyeti | PII (ad, telefon, adres). Ödeme ve sağlık verisi saklanmaz |
| Server Action | p95 < 400 ms · p99 < 800 ms |
| SLO | %99 aylık |
| RPO | 24 saat |
| RTO | 1 saat |

### Önbellek stratejisi

Next.js 16'da `cacheComponents` **açılmayacak** (v1'de). Bunun yerine ürün ve
kategori sayfalarında `'use cache'` + `cacheTag('products')`; panelden ürün
kaydedilince Server Action içinde `revalidateTag('products')`. Panel sayfalarında
önbellek yok.

`cacheComponents: true` açıkken `dynamic`, `revalidate`, `fetchCache` segment
export'ları build'i başarısız eder ve OOM raporları vardır.

### Ücretsiz altyapının bilinen duvarları

| Kaynak | Limit | Tahmini eşik |
|---|---|---|
| Supabase DB | 500 MB | 30 ürün + 10.000 sipariş ≈ 25 MB — sorun yok |
| Supabase Storage | 1 GB | 30 ürün × 6 görsel × 400 KB ≈ 72 MB |
| **Supabase trafik** | **5 GB/ay** | **~2.500 ziyaretçi/ay** ← asıl duvar |
| Supabase duraklatma | 7 gün inaktivite | Cron ping ile engellenir |
| Resend | Doğrulanmış domain şart | `*.vercel.app`'te çalışmaz |

Trafik duvarı, public bucket + `next/image` CDN önbelleği ile ~10 katına çıkar.

---

## 12. Dayanıklılık

| Önlem | Nasıl |
|---|---|
| **Yedekleme** | GitHub Actions cron, günlük `pg_dump` → artifact + Storage. Supabase ücretsiz planda backup yok. |
| **Uyanık tutma** | GitHub Actions cron, 3 günde bir `select 1`. 7 gün inaktivitede proje duraklar ve panel de erişilemez olur. |
| **Öksüz görsel** | Haftalık temizlik cron'u |
| **DB erişilemezse** | Telegram'a uyarı |

---

## 13. SEO ve yasal

### Otomatik (ablan hiçbir şey yapmaz)

`sitemap.xml` · `robots.txt` · ürün sayfalarına JSON-LD (`Product`, `Offer`,
`AggregateRating`, `OfferShippingDetails`, `MerchantReturnPolicy`) · ana sayfaya
`Organization` · OG görselleri · başlık ve açıklamalar üründen türetilir

**Not:** Ürün metinlerinin çoğu şu an görsellerin içindedir; Google, AI asistanları
ve ekran okuyucular bunu göremez. `aciklama` alanı bu yüzden önemlidir ve
`product_images.alt` panelde boş bırakılamaz. Yorumlar da her ürüne özgün,
müşteri dilinde metin ekler.

### Yasal sayfalar

İçerik `settings > Firma Bilgileri`'nden beslenir, şimdilik boş kalabilir:

Mesafeli Satış Sözleşmesi · Ön Bilgilendirme Formu · KVKK Aydınlatma Metni ·
Gizlilik & Çerez Politikası · İptal ve İade Koşulları (cayma hakkı 14 gün +
hijyen/gıda istisnası) · Teslimat ve Kargo

Sipariş sitede oluştuğu için mesafeli sözleşme sitede kurulur; ödemenin WhatsApp'ta
alınması bu yükümlülüğü kaldırmaz. Onaylar zaman damgası, IP ve metin versiyonuyla
`orders` tablosuna kaydedilir.

**Yayın öncesi:** ETBİS kaydı alan adı sahipliği gerektirir ve doğrulama bandı
sitede gösterilmelidir. `YAYIN-ONCESI-KONTROL.md` dosyasından takip edilir.

---

## 14. Fazlar

| Faz | İçerik | Çıktı |
|---|---|---|
| 0 | Proje kurulumu, Supabase, şema, migration, deploy hattı | Boş site canlıda |
| 1 | Panel: giriş, ürün ekle/düzenle, görsel yükleme, kategoriler | **Ablan ürün girebilir** |
| 2 | Ön yüz: ana sayfa, katalog, ürün detay | Site görülebilir |
| 3 | Sepet → checkout → sipariş → WhatsApp | **Sipariş alınabilir** |
| 4 | Panel: siparişler, durum, ödeme takibi + Telegram bildirimi | **Operasyon tamam** |
| 5 | Yorumlar (form + moderasyon + yıldız) + SEO + yasal sayfalar | Bulunabilir |
| 6 | Yedekleme, ping, testler, a11y denetimi, yayın öncesi kontrol listesi | Yayına hazır |
| 7 | İlk ürünlerin girilmesi | Teslim |

**Faz 1 sonunda ablaya gösterilir.** "Kullanabiliyor musun?" testi en erken orada
yapılabilir ve panelin kalbi ürün girişidir.

---

## 15. Açık maddeler

| Konu | Durum |
|---|---|
| WhatsApp sipariş numarası | Kullanıcı verecek |
| Alan adı | Yayından hemen önce alınacak |
| Firma bilgileri (unvan, MERSİS, vergi) | Yayın öncesi doldurulacak |
| Ürün görselleri | Kullanıcı hazırlayacak — `docs/GORSEL-REHBERI.md` |
| Kargo limiti ve ücreti | Ablan karar verecek, panelden girilecek |
| KDV oranları | Yayın öncesi netleşecek, alan hazır |
| Git deposu | Ablanın hesabı açılınca `git init` + push |

---

## 16. Kabul edilen riskler

1. **Vercel Hobby ticari kullanıma kapalıdır.** Kullanıcı riski bilerek kabul
   etti. Karşılığı: kod %100 taşınabilir yazılır, migration'lar git'te durur.
2. **Ücretsiz altyapı SLA vermez.** %99 aylık hedef bir taahhüt değil, tahmindir.
3. **Sağlık beyanı içeriği kullanıcının kararıdır.** Sistem uyarı üretmez;
   yalnızca zorunlu yasal sayfaların yapısı kurulur.
4. **Boolean stok aşırı satışa açıktır.** Sipariş WhatsApp'ta onaylandığı için
   para riski yoktur; `iptal_nedeni` ile ölçülür, 3 ayda 10'u geçerse adet bazlı
   stoka geçilir.
