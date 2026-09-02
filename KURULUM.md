# Organik Şifa — Kurulum

Site kod tarafında hazır. Bu adımlar **senin yapman gerekenler**; hepsi
toplam 20-30 dakika sürer.

---

## 0. Supabase'siz denemek istersen: demo modu

Supabase kurmadan siteyi ve paneli **gerçek verilerle** görebilirsin.
Sahte veri katmanı değildir: PGlite (WASM'a derlenmiş gerçek PostgreSQL)
çalışır, aynı şema ve aynı sorgular kullanılır. Docker gerekmez.

Üç ayrı terminalde:

```bash
npm run demo:db       # 1. yerel PostgreSQL'i başlat (açık kalsın)
npm run demo:yukle    # 2. şemayı kur + 4 örnek ürün yükle
npm run demo          # 3. siteyi başlat (açık kalsın)
```

- Mağaza: http://localhost:3000
- Panel: http://localhost:3000/panel *(demo modunda şifre sorulmaz)*

Veriler `.pglite/` klasöründe kalıcıdır; sıfırlamak için klasörü sil.

> **Güvenlik:** Demo modu `DEMO_MODU=1` **ve** `NODE_ENV != production`
> koşullarının ikisini birden ister. Vercel'de üretim derlemesi yapıldığı
> için, biri yanlışlıkla `DEMO_MODU=1` eklese bile panel açılmaz.
> Ayrıntı: `src/lib/demo.ts`

---

## 1. Supabase projesi oluştur

1. https://supabase.com → **New project**
2. **Region: Frankfurt (eu-central-1)** seç — Türkiye'ye en yakın olan bu
3. Veritabanı şifresini bir yere kaydet (bir daha gösterilmez)

## 2. Bağlantı bilgilerini al

**Project Settings → Database → Connection string**

| Nerede | Ne alacaksın | Nereye yazacaksın |
|---|---|---|
| **Transaction pooler** (port **6543**) | Bağlantı adresi | `DATABASE_URL` |
| **Direct connection** (port **5432**) | Bağlantı adresi | `DIRECT_URL` |

> İkisi de gerekli. Uygulama pooler'ı kullanır (serverless için şart),
> migration'lar doğrudan bağlantıyı kullanır (pooler çok komutlu SQL çalıştıramaz).

**Project Settings → API**

| Alan | Nereye |
|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` `public` anahtarı | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` `secret` anahtarı | `SUPABASE_SERVICE_ROLE_KEY` |

> `service_role` anahtarı **asla** tarayıcıya gitmemeli. Sadece `.env.local`
> ve Vercel ortam değişkenlerinde durur.

## 3. `.env.local` dosyasını oluştur

```bash
cp .env.example .env.local
```

Sonra yukarıdaki 5 değeri doldur.

## 4. Veritabanını kur — tek dosya yapıştır

Supabase panelinde **SQL Editor** → **New query** → şu dosyanın **tamamını**
yapıştır ve çalıştır:

```
supabase/kurulum.sql
```

Bu tek dosya şunları yapar:

- 11 tabloyu, ilişkileri ve indeksleri oluşturur
- Sipariş numarası üretecini kurar (`ORD-000001`, `ORD-000002`, …)
- **RLS'i açar** — müşteri verisini dışarıya kapatır *(aşağıdaki uyarıya bak)*
- 6 kategori ve ayar satırını ekler

Tekrar çalıştırmak güvenlidir; veriyi bozmaz.

> **Neden RLS şart:** Supabase, `public` şemasındaki her tabloyu otomatik
> olarak REST API'den yayınlar ve `anon` anahtarı tarayıcıda açıktadır.
> RLS açılmazsa herkes `.../rest/v1/orders?select=*` adresinden tüm müşteri
> adlarını, telefonlarını ve adreslerini indirebilir. Dosya bunu kapatıyor.
> Site etkilenmez: uygulama `postgres` rolüyle bağlanır, o rol RLS'i baypas eder.

Kontrol için SQL Editor'da:

```sql
SELECT yeni_siparis_no();   -- ORD-000001 dönmeli
```

**Alternatif (terminal):** SQL yapıştırmak istemezsen aynı şeyi
`npm run db:migrate && npm run db:seed` ile de yapabilirsin — ama o yol
RLS'i **açmaz**, `supabase/kurulum.sql` içindeki güvenlik bölümünü ayrıca
çalıştırman gerekir.

## 5. SQL'i kendin doğrulamak istersen

```bash
npm run sql:dogrula
```

`supabase/kurulum.sql` dosyasını bellek içinde gerçek bir PostgreSQL'de
çalıştırır: tabloları, sipariş numarası üretecini, RLS'i ve başlangıç
verisini kontrol eder, sonra örnek bir sipariş yazıp okur.

## 6. Görsel deposunu (Storage) aç

Supabase → **Storage** → **New bucket**

- Ad: **`urunler`** (birebir böyle)
- **Public bucket: AÇIK** ✅

> Public olması şart: özel olsaydı her görsel isteği Supabase'e gider ve
> aylık 5 GB trafik kotası çok erken dolardı. Yükleme yine de imzalı
> URL ile korunuyor — sadece yönetici yükleyebilir.

## 7. Yönetici hesabı aç

Supabase → **Authentication** → **Users** → **Add user**

- E-posta ve şifre gir
- **Auto Confirm User** kutusunu işaretle ✅

Ablan için de aynı şekilde ikinci bir hesap açabilirsin.

## 8. Kurulumu doğrula

```bash
npm run dogrula
```

Bu komut **gerçekten dener**, tahmin etmez: veritabanına bağlanır, 11 tablonun
varlığını kontrol eder, sipariş numarası üretecini çalıştırır, Storage'a bir
dosya yükleyip siler, yönetici hesabı var mı bakar. Eksik olan her şey için
ne yapman gerektiğini yazar.

Hepsi yeşil olana kadar devam etme.

## 9. Çalıştır

```bash
npm run dev
```

- Mağaza: http://localhost:3000
- Panel: http://localhost:3000/panel

## 10. Ürün yükleme akışını canlı test et

`.env.local` dosyasına yönetici hesabını ekle:

```
PANEL_TEST_EPOSTA="yonetici@ornek.com"
PANEL_TEST_SIFRE="..."
```

Sonra:

```bash
npm run build
npm run test:panel
```

Bu test **gerçek veritabanına yazar** ve şunların hepsini uçtan uca doğrular:

1. Panele giriş yapılıyor
2. Gerçek bir PNG yükleniyor (siyah çerçeveli — kırpma mantığı sınanır)
3. Kırpma ekranı çalışıyor, fotoğraf Supabase Storage'a gidiyor
4. Ürün kaydediliyor, Türkçe fiyat biçimi (`1.250,00`) doğru okunuyor
5. Ürün kartının zemin rengi siyah çıkmıyor *(letterbox kırpma çalıştı mı)*
6. Ürün mağazada görünüyor, set içeriği listeleniyor
7. Sepete ekleniyor, tutar doğru
8. Sipariş oluşuyor, WhatsApp adımı ve "GÖNDER" uyarısı çıkıyor
9. Sipariş panelde görünüyor, durumu değiştirilebiliyor
10. Test ürünü sonunda yayından kaldırılıyor

Test veritabanına **gerçek kayıt yazar**. Bittiğinde temizle:

```bash
npm run temizle -- --kuru   # önce ne silineceğini gör
npm run temizle             # sonra sil
```

Yalnızca `Test Ürünü …` adlı ürünleri ve `Otomatik Test` adına verilmiş
siparişleri siler; gerçek ürünlerine ve siparişlerine dokunmaz.

## 11. Panelden ilk ayarları gir

**Panel → Ayarlar:**

- **WhatsApp numarası** — girdikten sonra mutlaka **"WhatsApp bağlantısını test et"**
  butonuna bas. Numara yanlışsa sitedeki tüm sipariş butonları sessizce çalışmaz.
- **Kargo ücreti ve bedava kargo limiti**
- **Duyuru şeridi** (istersen)

---

## Telegram bildirimi (isteğe bağlı, 5 dakika)

Sipariş geldiğinde telefonuna anında bildirim düşer.

1. Telegram'da **@BotFather**'a yaz → `/newbot` → bota bir isim ver
2. Sana verdiği token'ı `.env.local` içinde `TELEGRAM_BOT_TOKEN` yap
3. Telegram'da **@userinfobot**'a yaz → sana `Id` verir
4. Bunu `TELEGRAM_CHAT_ID` yap
5. Kendi botuna Telegram'dan bir kez `/start` yaz (bot sana yazabilsin diye)
6. Panel → Ayarlar → **"Test bildirimi gönder"**

---

## Vercel'e yayınla

```bash
npm i -g vercel
vercel login
vercel link
vercel --prod
```

Vercel panelinde **Settings → Environment Variables** bölümüne
`.env.local`'daki **tüm** değişkenleri ekle (Production + Preview).
`NEXT_PUBLIC_SITE_URL` değerini yayınlanan adresle güncelle.

---

## Komutlar

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Üretim derlemesi |
| `npm test` | Birim testleri (41 test) |
| `npm run test:e2e` | Uçtan uca testler (70 test) |
| `npm run db:studio` | Veritabanını tarayıcıda Excel gibi görüntüle |
| `npm run db:generate` | Şema değişikliğinden SQL üret |
| `npm run db:migrate` | SQL'i veritabanına uygula |

---

## Sorun giderme

| Belirti | Sebep | Çözüm |
|---|---|---|
| Panel açılmıyor, girişe atıyor | Supabase env değişkenleri eksik | `.env.local` kontrol et, sunucuyu yeniden başlat |
| `prepared statement already exists` | Pooler yerine direct bağlantı kullanılıyor | `DATABASE_URL` port **6543** olmalı |
| Migration çalışmıyor | Pooler kullanılıyor | `DIRECT_URL` port **5432** olmalı |
| Fotoğraf yüklenmiyor | Storage kovası yok | `urunler` adıyla public bucket aç |
| Sipariş oluşmuyor | Sequence kurulmamış | Adım 5'teki SQL'i çalıştır |
| iPhone fotoğrafı açılmıyor | HEIC biçimi | Telefonda Ayarlar → Kamera → Biçimler → "En Uyumlu" |
| Site 1 hafta sonra ölü | Supabase ücretsiz plan duraklatması | GitHub Actions cron'u kur (`.github/workflows`) |
