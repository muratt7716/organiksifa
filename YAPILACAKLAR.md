# Yapılacaklar

Bu dosya **depoda durur** — bu bilgisayara erişim kalmasa da yapılacaklar
kaybolmaz.

Yayın öncesi tik listesi ayrı dosyada:
[`YAYIN-ONCESI-KONTROL.md`](YAYIN-ONCESI-KONTROL.md). Burası **henüz
yapılmamış işler** içindir.

Son güncelleme: 4 Eylül 2026

---

## Şu anki durum

| | |
|---|---|
| Site | https://organiksifa.vercel.app |
| Panel | https://organiksifa.vercel.app/panel |
| Yayında ürün | **100** |
| Kategori | 10 |
| Görsel | 126 |
| Mükerrer / görselsiz / kategorisiz | 0 |

Katalog denetimi: `npm run denetle`
Görsel dışı alanlar eksiksiz mi: `npm run hazirlik`
Ürünleri yeniden yükle: `npm run urun:yukle`

---

## 1. Yayın için zorunlu — bunlar olmadan açılmaz

- [ ] **100 ürünün fiyatları uydurma.** Gerçek fiyat girilmeden site kimseye
      açılmamalı. Yanlış fiyatla sipariş gelirse o fiyat siparişin içine
      kaydediliyor ve sonradan düzeltmek o siparişi düzeltmiyor.
      Panel → Ürünler → ürüne tıkla → Fiyat.

- [ ] **Firma bilgileri boş.** Ticaret unvanı, adres, MERSİS, vergi
      dairesi/no, ETBİS. Türkiye'de e-ticaret için yasal zorunluluk; mesafeli
      satış sözleşmesi ve KVKK sayfaları şu an boşluklarla çıkıyor.
      Panel → Ayarlar → Firma bilgileri.

- [ ] **İletişim bilgileri boş.** Telefon, e-posta, Instagram — footer'da
      görünüyor.

- [ ] **WhatsApp numarası girildi ✓** — ama kendi telefonundan bir deneme
      siparişi verip mesajın geldiğini doğrula.

---

## 2. Eksik ürünler — 9 ürün siteye konmadı

Ayrıntı ve sebepleri: [`docs/EKSIK-URUNLER.md`](docs/EKSIK-URUNLER.md)

- [ ] **8 ürünün görseli bekliyor.** Ellerindeki tek görsel telefon ekran
      görüntüsü, emoji çıkartmalı ya da içinde WhatsApp sohbeti olan kareler.
      Promptları hazır: [`docs/ANTIGRAVITY-SON-18-GORSEL.md`](docs/ANTIGRAVITY-SON-18-GORSEL.md)
      B bölümü, `31`–`38`.
      Görseller gelince `beklet: true` satırını sil, `npm run urun:yukle`.

- [ ] **6 ürünün ambalajı düzeltilecek.** Sitedeler ama kapakları infografik;
      daha önce ürettiğim showroom görselleri yanlış ambalaj gösteriyordu.
      Promptları aynı dosyada A bölümü, `10`–`15`.

- [ ] **Sara-Epilepsi Seti listelenmedi.** Epilepside ilacın kesilmesi
      ölümcül olabiliyor. Ablanla konuşulmadan konmayacak.

---

## 3. Ablama sorulacak

- [ ] **Ayak Bakım Seti** (6 parça) ↔ **Ayak Bakım Seti — 8 Parça**
      Ayrı ürün mü, biri diğerinin yerini mi alıyor?
- [ ] **Bağırsak Temizlik Destek Seti** (parazit) ↔ **Bağırsak Temizleme
      Destek Seti** — içerikleri farklı ama adları çok yakın.
- [ ] **Ana sayfa vitrini.** Şu an 4 ürün "öne çıkan". Hangi ürünlerin
      vitrinde olacağına ablan karar vermeli. Panel → Ürünler → Öne çıkar.

---

## 4. Telegram bildirimi — PayTR ile birlikte

Şu an sipariş WhatsApp'tan geliyor; müşteri mesajı gönderince telefon zaten
çalıyor. **PayTR'de durum değişiyor:** ödeme sağlayıcıdan dönen siparişte
tetiklenen bir WhatsApp sohbeti olmayacak, bildirim kanalı asıl o zaman
zorunlu hâle geliyor.

Bugün de tek açık var: müşteri formu doldurup WhatsApp'ta GÖNDER'e basmazsa
sipariş veritabanına düşer ama kimse duymaz. Panel günlük açıldığı sürece
sorun değil.

**Hazır olan:** `src/lib/notify/index.ts` — gönderme, mesaj biçimi, kanal
anahtarı, Ayarlar'daki "Test bildirimi gönder" düğmesi çalışıyor. Bildirim
çökse bile sipariş kaydı korunuyor.

**Eksik olan:** alıcı `TELEGRAM_CHAT_ID` ortam değişkeninden okunuyor;
panelden değiştirilemiyor.

**Karar verilmiş tasarım:** tek kişi (ablam) + panelde "Bağlan" düğmesi.
`settings` tablosuna `telegram_chat_id` ve `telegram_baglama_kodu` sütunları
eklenecek *(SQL değişikliği)*. Bot jetonu ortam değişkeninde kalır — sırdır,
panel formunda render edilirse HTML kaynağında görünür. Akış: panel bir kod
gösterir → ablam kodu bota yazar → "Bağlandı mı?" düğmesi `getUpdates` ile
kodu arar ve `chat_id`'yi kendi yakalar. Webhook gerekmez.

Bot henüz oluşturulmadı (`TELEGRAM_BOT_TOKEN` boş). `@BotFather` → `/newbot`.

---

## 5. Sipariş takibi — müşteri sayfaya nasıl dönecek

**Zaten çalışan kısım:** `src/app/(magaza)/siparis/[no]/page.tsx` müşteriye
sipariş durumunu, kargo firmasını ve takip numarasını gösteriyor. Adres
`?t=<uuid>` jetonuyla korunuyor. 3 Eylül'de uçtan uca doğrulandı.

**Eksik olan:** müşterinin sayfaya sonradan dönme yolu yok. Sayfa "bu sayfayı
kaydedebilirsin" diyor ama yer imine güveniyor; WhatsApp mesajında link yok.

- [ ] **Takip linkini WhatsApp mesajına ekle** — en ucuz çözüm. Müşteri o
      mesajı zaten gönderiyor, link sohbet geçmişinde kalıcı duruyor.
      `src/lib/whatsapp.ts` içindeki şablon. `YeniSiparisOlayi.siparisUrl`
      alanı zaten var.
- [ ] **"Siparişimi sorgula" sayfası** — sipariş no + telefon. İkisi birden
      doğru olmadan açılmamalı; sipariş numarası sırayla arttığı için.

---

## 6. PayTR sanal POS

Hazırlık notları: [`docs/PAYTR-ENTEGRASYON.md`](docs/PAYTR-ENTEGRASYON.md)

Önce WhatsApp'la gerçek sipariş alınsın, akış otursun. Firma bilgileri ve
ETBİS kaydı PayTR başvurusu için zaten gerekiyor.

---

## 7. Teknik — açık kalanlar

- [ ] **Panel sayfa render'ı ~1.7 sn.** Teşhis tamam, düzeltme yapılmadı.
      Kontrol deneyiyle ölçüldü:

      | ne | süre |
      |---|---|
      | `/api/saglik` — proxy yok, dinamik, sorgu var | 496 ms |
      | `/panel/tani` — proxy VAR, dinamik, sorgu var | **116 ms** |
      | `/panel/ayarlar` — proxy VAR, sayfa render | 1828 ms |

      **Proxy suçlu değil.** Ölçülen parçalar: proxy auth 58-90 ms, yerleşim
      veri çekme 100-167 ms, sayfa sorgusu ~94 ms. Geriye ~1.5 sn React
      sunucu render'ı kalıyor ve sayfa içeriğinden bağımsız olarak hep aynı —
      demek ki tek tek sayfalar değil, ortak `(korumali)` yerleşimi.

      Sıradaki adım: yerleşimi parçalara ayırıp hangi bileşenin pahalı
      olduğunu bulmak. Proxy'de `Server-Timing: proxyauth` kancası duruyor.

- [ ] **Betikle eklenen ürün mağazada geç görünüyor.** Ürün ve kategori
      sayfaları statik üretildiği için, panelden DEĞİL betikle eklenen ürün
      önbellek yenilenene kadar (1 saat) listede çıkmıyor. Panelden eklemede
      `revalidatePath` tetiklendiği için bu sorun yok. Push/deploy yeniden
      üretiyor.

- [ ] **Kategori sayfalarında çift sorgu** — `yayindakiUrunler()` hem
      `generateMetadata` hem sayfa gövdesinde çağrılıyordu; `cache()` ile
      çözüldü ama benzer desen başka yerde kalmış olabilir.
