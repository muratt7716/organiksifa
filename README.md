# Organik Şifa

Organik gıda takviyesi ve doğal kozmetik e-ticaret sitesi.
Müşteri ön yüzü + teknik olmayan kullanıcı için tasarlanmış yönetim paneli.

Ödeme sitede alınmaz: müşteri sepeti doldurur, formu tamamlar, sipariş
veritabanına kaydedilir ve WhatsApp'a yönlendirilir. *(Sanal POS geçişi için
`docs/PAYTR-ENTEGRASYON.md` — veritabanı şeması değişmeyecek.)*

---

## Hızlı başlangıç

```bash
npm install
```

**Supabase ile (gerçek kurulum):** `KURULUM.md`
**Supabase'siz denemek için (yerel demo):**

```bash
npm run demo:db      # 1. terminal — yerel PostgreSQL (PGlite)
npm run demo:yukle   # 2. terminal — şema + 4 örnek ürün
npm run demo         # 3. terminal — site
```

- Mağaza → http://localhost:3000
- Panel → http://localhost:3000/panel *(demo modunda şifre sorulmaz)*

---

## Belgeler

| Dosya | İçerik |
|---|---|
| `KURULUM.md` | Supabase + Vercel kurulumu, adım adım |
| `docs/ORTAM-DEGISKENLERI.md` | `.env.local` içeriği ve Vercel değişkenleri |
| `supabase/kurulum.sql` | **SQL Editor'a yapıştırılacak tek dosya** |
| `YAYIN-ONCESI-KONTROL.md` | Yayına çıkmadan önce tamamlanacaklar |
| `YAPILACAKLAR.md` | **Henüz yazılmamış işler** — sipariş takibi, Telegram, PayTR |
| `docs/GORSEL-REHBERI.md` | Ürün fotoğrafı hazırlama, AI ile görsel üretimi |
| `docs/PAYTR-ENTEGRASYON.md` | Sanal POS'a geçiş noktaları |
| `docs/superpowers/specs/` | Tasarım dokümanı (neden böyle yapıldı) |
| `docs/superpowers/plans/` | Uygulama planı |

---

## Komutlar

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Üretim derlemesi |
| `npm test` | Birim testleri (46 test) |
| `npm run test:e2e` | Mağaza uçtan uca testleri (70 test) |
| `npm run test:panel` | **Canlı panel testi** — gerçek ürün ekler, sipariş verir |
| `npm run temizle` | Canlı testin bıraktığı test ürünü ve siparişleri siler |
| `npm run temizle -- --kuru` | Ne silineceğini gösterir, silmez |
| `npm run dogrula` | Supabase kurulumunu gerçekten dener ve eksikleri yazar |
| `npm run sql:dogrula` | `supabase/kurulum.sql`'i gerçek PostgreSQL'de sınar |
| `npm run db:studio` | Veritabanını tarayıcıda tablo hâlinde görüntüle |
| `npm run lint` | ESLint |

---

## Teknoloji

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 ·
Drizzle ORM · Supabase (Postgres + Storage + Auth) · Zod · Zustand ·
Vitest · Playwright

---

## Mimari kararlar

Ayrıntı: `docs/superpowers/specs/2026-09-02-organik-sifa-design.md`

- **Veritabanına yalnızca sunucu erişir.** Tarayıcı Postgres'e hiç dokunmaz;
  yetki kontrolü Server Action katmanında tek yerde toplanır (fail-closed).
- **Fiyat istemciden alınmaz.** Sunucuya yalnızca `[{ürün_id, adet}]` gider;
  fiyat, kargo ve toplam veritabanından hesaplanır.
- **Sipariş satırları snapshot'lıdır.** Ürün fiyatı sonradan değişse bile
  geçmiş siparişler değişmez.
- **Görseller tarayıcıda sıkıştırılır** (WebP, ~180 KB) ve imzalı URL ile
  doğrudan Supabase Storage'a gider — sunucu fonksiyonundan geçmez.
- **`product_images.zemin_rengi`**: yükleme anında görselin kenarından
  ölçülen renk. Kart, görseli kırpmadan bu renkteki çerçeveye yerleştirir;
  böylece hangi oranda görsel yüklenirse yüklensin katalog bozulmaz.
- **Sinematik efektler saf CSS** (`animation-timeline`), animasyon
  kütüphanesi yok — mağaza rotalarında 0 KB ek JavaScript.
- **RLS zorunlu.** `supabase/kurulum.sql` tüm tablolarda RLS'i açar;
  aksi hâlde `anon` anahtarıyla müşteri verisi REST API'den okunabilir.

---

## Durum

| | |
|---|---|
| Tip kontrolü | ✅ `tsc --noEmit` temiz |
| Lint | ✅ temiz |
| Birim testleri | ✅ 46/46 |
| Uçtan uca testler | ✅ 70/70 (masaüstü + mobil, 6 ekran boyutu) |
| Üretim derlemesi | ✅ 24 rota |
| SEO (ürün sayfası) | ✅ 95/100 |
| Canlı panel testleri | ⏳ Supabase bağlanınca çalışır (`npm run test:panel`) |
