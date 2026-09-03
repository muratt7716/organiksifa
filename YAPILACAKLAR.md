# Yapılacaklar

Bu dosya **depoda durur** — bu bilgisayara erişim kalmasa da yapılacaklar kaybolmaz.

Yayın öncesi tek tek işaretlenecek kontrol listesi ayrı dosyada:
[`YAYIN-ONCESI-KONTROL.md`](YAYIN-ONCESI-KONTROL.md). Burası ise **henüz
yazılmamış işler** içindir.

Son güncelleme: 3 Eylül 2026

---

## 1. Sipariş takibi — müşteri sayfaya nasıl geri dönecek

**Öncelik: yüksek** · Tahmini iş: küçük

### Zaten çalışan kısım

Müşteri sipariş sayfası hazır ve test edildi:
`src/app/(magaza)/siparis/[no]/page.tsx`

Müşteriye gösterdikleri:

- Sipariş numarası ve tarihi
- **Sipariş durumu** (Yeni · Görüşüldü · Onaylandı · Kargoda · Teslim edildi · İptal)
- **Kargo firması ve takip numarası** — panele girildiği anda burada görünür
- Ürünler, ara toplam, kargo, toplam
- Teslimat bilgileri

Adres `?t=<uuid>` jetonuyla korunur (`orders.erisim_token`). Sipariş numarasını
tahmin eden biri başkasının siparişini açamaz.

*3 Eylül 2026'da uçtan uca doğrulandı: panele `Yurtiçi / TEST1234567890`
girildi, müşteri sayfasında anında göründü.*

### Eksik olan

Müşterinin bu sayfaya **sonradan dönmesinin bir yolu yok.** Sayfa "bu sayfayı
kaydedebilirsin" diyor ama bu yer imine güveniyor — sekmeyi kapatan bir daha
bulamıyor. WhatsApp mesajında da link yok.

### Yapılacak

1. **Takip linkini WhatsApp mesajına ekle** *(en ucuz ve en doğru çözüm)*

   Müşteri zaten o mesajı gönderiyor; link sohbet geçmişinde kalıcı olarak
   duruyor ve arayacağı ilk yer orası. Değiştirilecek yer: sipariş sonrası
   WhatsApp metnini üreten fonksiyon (`src/lib/whatsapp.ts` içindeki şablon).
   `YeniSiparisOlayi.siparisUrl` alanı zaten var, aynı adres kullanılabilir.

2. **"Siparişimi sorgula" sayfası** *(linki tamamen kaybedenler için)*

   Sipariş no + telefon → siparişi gösterir. İkisi birden doğru olmadan
   açılmamalı; yoksa sipariş numarası sırayla artan bir sayı olduğu için
   herkes herkesin siparişini görür.

3. **Durum değişince müşteriye haber** *(isteğe bağlı)*

   Panelden "Kargoya verildi" işaretlenince müşteriye WhatsApp mesajı taslağı
   açan bir düğme. Panelde zaten "Müşteriye WhatsApp'tan yaz" düğmesi var;
   duruma göre hazır metin üretmesi yeterli.

---

## 2. Telegram bildirimi — alıcıyı panelden değiştirme

**Öncelik: PayTR ile birlikte** · Tahmini iş: orta

### Neden şimdi değil

Şu an sipariş WhatsApp'tan geliyor; müşteri mesajı gönderince telefon zaten
çalıyor. Telegram bunun üstüne ikinci bildirim ekliyor.

**PayTR'de durum değişiyor:** ödeme sağlayıcıdan dönen siparişte tetiklenen bir
WhatsApp sohbeti olmayacak. Bildirim kanalı asıl o zaman zorunlu hâle geliyor.

Ayrıca bugün de tek bir açık var: müşteri formu doldurup WhatsApp'ta GÖNDER'e
basmazsa sipariş veritabanına düşer ama kimse duymaz. Panel günlük açıldığı
sürece sorun değil.

### Zaten çalışan kısım

`src/lib/notify/index.ts` — gönderme, mesaj biçimi, kanal açma/kapama anahtarı
ve Ayarlar'daki "Test bildirimi gönder" düğmesi hazır. Bildirim çökse bile
sipariş kaydı korunuyor (`Promise.allSettled`, asla fırlatmaz).

### Eksik olan

Alıcı `TELEGRAM_CHAT_ID` **ortam değişkeninden** okunuyor
([`notify/index.ts`](src/lib/notify/index.ts) `TelegramKanali.aktifMi`).
Alıcıyı değiştirmek için Vercel'e girip değişkeni düzenleyip yeniden deploy
almak gerekiyor — panelden tek işlemle değiştirilemiyor.

### Yapılacak — karar verilmiş tasarım

Alıcı: **tek kişi (ablam)**. Bağlama yöntemi: **panelde "Bağlan" düğmesi.**

1. `settings` tablosuna `telegram_chat_id` ve `telegram_baglama_kodu` sütunları
   *(SQL değişikliği gerekir — Supabase'de elle çalıştırılacak)*
2. Bot jetonu **ortam değişkeninde kalır** — sırdır, panel formunda
   render edilirse HTML kaynağında görünür. Bot bir kez kurulur, değişmez.
3. Panelde akış: "Bağlan" → ekranda kod çıkar (örn. `BAGLA-4821`) → ablam o kodu
   bota yazar → "Bağlandı mı?" düğmesi Telegram `getUpdates` ile o kodu arar,
   bulunca `chat_id`'yi kendi yakalar ve kaydeder. Kimse numara/ID aramaz.
4. Webhook gerekmez — `getUpdates` düğmeye basınca çağrılır.

Bot henüz oluşturulmadı (`.env.local` içinde `TELEGRAM_BOT_TOKEN` boş).
Telegram'da `@BotFather` → `/newbot` ile oluşturulup jeton alınacak.

---

## 3. PayTR sanal POS

**Öncelik: WhatsApp akışı oturduktan sonra** · Tahmini iş: büyük

Hazırlık notları: [`docs/PAYTR-ENTEGRASYON.md`](docs/PAYTR-ENTEGRASYON.md)

Sıra: önce WhatsApp'la gerçek sipariş alınsın, akış otursun; sonra ödeme
sitede toplansın. Firma bilgileri ve ETBİS kaydı PayTR başvurusu için zaten
gerekiyor — o yüzden yasal alanların doldurulması bunun ön koşulu.

---

## 4. Küçük işler

- [ ] **Kategori sayfalarında çift sorgu.** `yayindakiUrunler()` hem
      `generateMetadata` hem sayfa gövdesinde çağrılıyor; aynı veri iki kez
      çekiliyor (~1.3 sn fazladan). React `cache()` ile sarmalamak yeterli.
- [ ] **5. ürün: Kan Yapıcı Set.** Görseller üretilmedi (Antigravity kotaya
      takıldı). Görseller gelince:
      `python scripts/urun-gorsel-hazirla.py urun-kan-yapici-set` ardından
      `npm run urun:yukle urun-kan-yapici-set`
- [ ] **İkinci "Altın Yağ" ne olacak?** Üründe iki kayıt var: 1.250 ₺ (yayında)
      ve 450 ₺ (yayında değil, stokta yok). İkincisi gerçek ürün mü, silinecek
      mi belli değil.
- [ ] **Panel sayfa render'ı ~1.7 sn — teşhis tamam, düzeltme yapılmadı.**

      Kontrol deneyiyle ölçüldü (canlı, oturum açık):

      | ne | süre |
      |---|---|
      | `/api/saglik` — proxy yok, dinamik, sorgu var | 496 ms |
      | `/panel/tani` — proxy VAR, dinamik, sorgu var | **116 ms** |
      | `/panel/ayarlar` — proxy VAR, dinamik, sayfa render | 1828 ms |

      Yani **proxy suçlu değil** (proxy'den geçen uç nokta 116 ms). Ölçülen
      parçalar: proxy auth 58-90 ms, yerleşim veri çekme 100-167 ms, sayfa
      sorgusu ~94 ms. Geriye ~1.5 sn **React sunucu render'ı** kalıyor ve
      sayfa içeriğinden bağımsız olarak hep aynı — demek ki tek tek sayfalar
      değil, ortak `(korumali)` yerleşimi.

      Sıradaki adım: yerleşimi parçalara ayırıp hangi bileşenin pahalı
      olduğunu bulmak (PanelNav, header, ya da `force-dynamic` ile
      streaming'in kapalı olması). Ölçüm kancaları yerinde:
      proxy `Server-Timing: proxyauth`, yerleşim `data-os-olcum`.

- [ ] **Betikle eklenen ürün mağazada geç görünüyor.** Ürün ve kategori
      sayfaları statik üretildiği için, panelden DEĞİL betikle eklenen ürün
      önbellek yenilenene kadar (1 saat) listede çıkmıyor. Panelden eklemede
      `revalidatePath` tetiklendiği için bu sorun yok. Betiğe on-demand
      revalidation çağrısı eklenebilir; şimdilik push/deploy yeniden üretiyor.

---

## Engelli — bunlar çözülmeden ilerlenmiyor

- [ ] **Vercel dağıtımı düşük.** `organiksatis.vercel.app` hiçbir dağıtıma bağlı
      değil (`X-Vercel-Error: DEPLOYMENT_NOT_FOUND`). Proje silinmiş, adı
      değişmiş veya Hobby kısıtına takılmış olabilir. Vercel panosundan
      bakılacak. Depoda `.vercel/` klasörü veya `vercel.json` yok — proje
      panodan GitHub'a bağlanmış.
- [ ] **WhatsApp sipariş numarası boş.** Bu alan boşken sitedeki **tüm sipariş
      düğmeleri sessizce ölü** — müşteri hata bile görmez. Panel → Ayarlar →
      WhatsApp.
- [ ] **Firma bilgileri boş.** Ticaret unvanı, adres, MERSİS, vergi dairesi/no,
      ETBİS. Yasal zorunluluk; mesafeli satış sözleşmesi ve KVKK sayfaları şu an
      boşluklarla çıkıyor.
- [ ] **İletişim bilgileri boş.** Telefon, e-posta, Instagram — footer'da görünür.
