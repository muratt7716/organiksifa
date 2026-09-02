# Yayın Öncesi Kontrol Listesi

Site gerçek müşteriye açılmadan önce bu listenin tamamı tamamlanmalı.
Kutulara tik atarak ilerle.

---

## Altyapı

- [ ] Supabase projesi kuruldu (`KURULUM.md` adım 1-7)
- [ ] Sipariş numarası sequence'i çalıştırıldı (adım 5) — **atlanırsa sipariş oluşmaz**
- [ ] `urunler` Storage kovası **public** olarak açıldı
- [ ] Alan adı alındı ve Vercel'e bağlandı
- [ ] `NEXT_PUBLIC_SITE_URL` gerçek alan adıyla güncellendi
- [ ] Vercel ortam değişkenlerinin **tamamı** girildi (Production + Preview)
- [ ] Git deposu kuruldu ve `.env.local` **depoda değil**
- [ ] `db-yedek.yml` iş akışı elle bir kez çalıştırıldı ve yedek indirildi
- [ ] `db-uyanik-tut.yml` iş akışı elle bir kez çalıştırıldı, HTTP 200 döndü
- [ ] GitHub Secrets girildi: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `DIRECT_URL`

## Panel

- [ ] Kendi hesabınla giriş yapabiliyorsun
- [ ] Ablan için ikinci hesap açıldı ve giriş yapabiliyor
- [ ] **Ablan yardımsız bir ürün ekledi** ← asıl başarı ölçütü
- [ ] Ablan telefondan da ürün ekleyebildi
- [ ] WhatsApp numarası girildi ve **"WhatsApp bağlantısını test et"** butonuyla doğrulandı
- [ ] Kargo ücreti ve bedava kargo limiti girildi
- [ ] Telegram bildirimi kuruldu ve **"Test bildirimi gönder"** telefona düştü
- [ ] Ürünler listesinde stok/yayın anahtarları çalışıyor

## İçerik

- [ ] En az 10 ürün fotoğrafıyla girildi
- [ ] Her ürünün **açıklama** alanı dolu (görseldeki yazılar metne aktarıldı)
- [ ] Set olan ürünlerin **set içeriği** alanı dolduruldu
- [ ] Kategoriler düzenlendi, boş kategori gizlendi
- [ ] Ana sayfada gösterilecek ürünler **"Öne çıkar"** ile işaretlendi
- [ ] Duyuru şeridi metni yazıldı (veya kapatıldı)

## Yasal — *bunlar olmadan yayına çıkma*

- [ ] Panel → Ayarlar → **Firma bilgileri** dolduruldu (ticaret unvanı, adres, vergi no)
- [ ] MERSİS numarası girildi
- [ ] ETBİS kaydı yapıldı, doğrulama adresi panele girildi
- [ ] Mesafeli Satış Sözleşmesi metni okundu ve firmaya uygun mu kontrol edildi
- [ ] Ön Bilgilendirme Formu kontrol edildi
- [ ] İptal ve İade Koşulları — cayma hakkı istisnaları ürünlerine uygun mu
- [ ] Teslimat ve Kargo sayfasındaki süreler gerçek duruma uygun mu
- [ ] KVKK Aydınlatma Metni kontrol edildi
- [ ] Gizlilik ve Çerez Politikası kontrol edildi
- [ ] Footer'daki "takviye edici gıda" çekincesi görünüyor

## Gerçek cihaz testi

- [ ] Kendi telefonundan uçtan uca sipariş verildi
- [ ] WhatsApp butonu çalıştı, mesaj sipariş numarasıyla açıldı
- [ ] **Instagram uygulaması içinden** site açıldı ve WhatsApp butonu test edildi
      *(en sık kırılan nokta burasıdır)*
- [ ] Masaüstünden sipariş verildi, sipariş sayfası açıldı
- [ ] Sipariş sayfası linki F5 sonrası hâlâ çalışıyor
- [ ] Telegram bildirimi geldi
- [ ] Sipariş panelde göründü, durum ve ödeme değiştirilebildi
- [ ] Panelden "Müşteriye WhatsApp'tan yaz" butonu doğru numarayı açtı

## Teknik doğrulama

- [ ] `npm test` → 41 test geçiyor
- [ ] `npm run test:e2e` → 70 test geçiyor
- [ ] `npm run build` → hatasız
- [ ] Lighthouse mobil: Performans ≥ 90, Erişilebilirlik ≥ 95
- [ ] Google Search Console'a site eklendi
- [ ] `sitemap.xml` Search Console'a gönderildi
- [ ] Bir ürün sayfasının kaynak kodunda `application/ld+json` görünüyor

---

## Yayından sonra ilk hafta

- [ ] İlk gerçek siparişte tüm akış baştan sona izlendi
- [ ] Yedeklemenin gerçekten çalıştığı doğrulandı (artifact indirildi)
- [ ] Supabase kullanım sayfası kontrol edildi (trafik/depolama)
