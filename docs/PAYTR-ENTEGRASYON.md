# PayTR / Sanal POS Entegrasyonu — Hazırlık Notları

Şu an ödeme WhatsApp üzerinden alınıyor. Sanal POS'a geçilirken **veritabanı
şeması değişmeyecek** — gerekli alanlar ilk günden eklendi.

## Hazır olan alanlar (`orders` tablosu)

| Alan | Şu anki kullanım | PayTR'de kullanım |
|---|---|---|
| `odeme_durumu` | Panelden elle: `bekliyor` / `alindi` / `kismi` / `iade` | PayTR callback'i ile otomatik |
| `odeme_yontemi` | `havale` / `kapida` / `diger` | `kredi_karti` / `paytr` eklenir |
| `odenen_tutar` | Panelden elle girilir | Callback'ten gelir |
| `odeme_at` | Panelden elle | Callback zaman damgası |
| `idempotency_key` | Çift sipariş koruması | Callback tekrarı koruması olarak da kullanılır |
| `erisim_token` | Sipariş sayfası linki | PayTR dönüş sayfası doğrulaması |

**Eklenmesi gerekecek tek alan:** `orders.paytr_merchant_oid` (text, unique).

## Değişecek dosyalar

### 1. `src/actions/orders.ts` → `siparisOlustur`

Şu an sipariş kaydedildikten sonra doğrudan sipariş sayfasına dönüyor.
PayTR'de burada bir dallanma olacak:

```
sipariş kaydedildi
   ├── ödeme yöntemi = whatsapp  → /siparis/{no}?t={token}   (mevcut akış)
   └── ödeme yöntemi = kart      → PayTR token al → iframe/redirect
```

Sipariş oluşturma mantığının geri kalanı (fiyat doğrulama, kargo hesabı,
snapshot, rate limit) **aynen kalır** — zaten sunucu tarafında.

### 2. Yeni: `src/app/api/paytr/callback/route.ts`

PayTR ödeme sonucunu sunucuya POST eder. Bu uç:

- `hash` doğrulaması yapar (PayTR merchant key + salt ile)
- `merchant_oid` ile siparişi bulur
- `odeme_durumu`, `odenen_tutar`, `odeme_at` alanlarını günceller
- `order_events` tablosuna kayıt düşer
- Gövdesinde **sadece `OK`** döner (PayTR bunu bekler)

> Bu uç `middleware.ts` matcher'ının dışında (`/panel/:path*`), yani
> ek yapılandırma gerekmez.

### 3. Yeni: `src/app/(magaza)/odeme/sonuc/page.tsx`

PayTR'nin kullanıcıyı geri gönderdiği sayfa. Ödeme durumunu veritabanından
okur (callback'e güvenilir, istemciden gelen parametreye değil).

### 4. `src/components/magaza/OdemeFormu.tsx`

Ödeme yöntemi seçimi eklenir: **Kartla öde** / **WhatsApp'tan öde**.
İkisi de kalır — WhatsApp seçeneği kaldırılmamalı, müşterilerin bir kısmı
onu tercih ediyor.

## Ortam değişkenleri

```
PAYTR_MERCHANT_ID=""
PAYTR_MERCHANT_KEY=""
PAYTR_MERCHANT_SALT=""
PAYTR_TEST_MODU="1"
```

## Ön koşullar (kod dışı)

1. Şahıs şirketi / vergi levhası
2. PayTR başvurusu ve onayı
3. **Alan adı** — PayTR `*.vercel.app` kabul etmez
4. Sitede zorunlu yasal sayfalar (zaten hazır, içerikleri doldurulmalı)
5. ETBİS kaydı

## Dikkat edilecekler

- **Tutar yine sunucuda hesaplanır.** PayTR'ye gönderilen tutar, istemciden
  gelen değil, `siparisOlustur` içinde veritabanından hesaplanan tutar olmalı.
- **Callback tekrar gelebilir.** PayTR başarısız yanıt alırsa aynı bildirimi
  tekrar gönderir; `merchant_oid` üzerinde benzersiz kontrol şart.
- **Callback'i asla `revalidatePath` ile yavaşlatma.** Önce `OK` dön, sonra
  `after()` ile diğer işleri yap.
- KDV alanları (`products.kdv_orani`, `order_items.kdv_orani_snapshot`) şemada
  hazır ama panelde gizli. Fatura kesilmeye başlanınca panelde açılmalı.
