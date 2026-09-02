import type { Ayarlar } from "./settings";
import { fiyatBicimle, sayi } from "./price";

export type YasalBolum = { baslik: string; paragraflar: string[] };
export type YasalBelge = {
  slug: string;
  baslik: string;
  ozet: string;
  bolumler: YasalBolum[];
};

function firma(a: Ayarlar) {
  const satirlar: string[] = [];
  satirlar.push(`Ünvan: ${a.ticaretUnvani ?? "— (yayın öncesi doldurulacak)"}`);
  satirlar.push(`Adres: ${a.adres ?? "— (yayın öncesi doldurulacak)"}`);
  if (a.mersisNo) satirlar.push(`MERSİS No: ${a.mersisNo}`);
  if (a.vergiDairesi || a.vergiNo) {
    satirlar.push(
      `Vergi Dairesi / No: ${a.vergiDairesi ?? "—"} / ${a.vergiNo ?? "—"}`,
    );
  }
  if (a.iletisimTelefon) satirlar.push(`Telefon: ${a.iletisimTelefon}`);
  if (a.iletisimEmail) satirlar.push(`E-posta: ${a.iletisimEmail}`);
  return satirlar.join("\n");
}

function kargoCumlesi(a: Ayarlar) {
  const ucret = a.kargoUcreti ? sayi(a.kargoUcreti) : 0;
  const limit = a.kargoBedavaLimit ? sayi(a.kargoBedavaLimit) : null;
  if (ucret === 0) return "Kargo ücreti tüm siparişlerde ücretsizdir.";
  if (a.kargoBedavaAcik && limit) {
    return `Kargo ücreti ${fiyatBicimle(ucret)}'dir. ${fiyatBicimle(limit)} ve üzeri siparişlerde kargo ücretsizdir. Bazı ürünlerde tutara bakılmaksızın kargo ücretsiz olabilir; bu ürün sayfasında belirtilir.`;
  }
  return `Kargo ücreti ${fiyatBicimle(ucret)}'dir.`;
}

export function yasalBelge(slug: string, a: Ayarlar): YasalBelge | null {
  const ad = a.siteAdi;
  const unvan = a.ticaretUnvani ?? a.siteAdi;

  const belgeler: Record<string, YasalBelge> = {
    "mesafeli-satis-sozlesmesi": {
      slug,
      baslik: "Mesafeli Satış Sözleşmesi",
      ozet:
        "Bu sözleşme, site üzerinden verilen siparişlerde satıcı ile alıcı arasındaki hak ve yükümlülükleri düzenler.",
      bolumler: [
        {
          baslik: "1. Taraflar",
          paragraflar: [
            "SATICI:",
            firma(a),
            "ALICI: Sipariş formunda bilgilerini beyan eden kişi.",
          ],
        },
        {
          baslik: "2. Sözleşmenin Konusu",
          paragraflar: [
            `Bu sözleşmenin konusu, ALICI'nın ${ad} internet sitesi üzerinden elektronik ortamda siparişini verdiği, aşağıda nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin belirlenmesidir.`,
          ],
        },
        {
          baslik: "3. Sipariş ve Ödeme",
          paragraflar: [
            "Sipariş, site üzerinden oluşturulur ve ALICI'ya bir sipariş numarası verilir.",
            "Ödeme sitede alınmaz. Sipariş oluşturulduktan sonra ALICI, WhatsApp üzerinden SATICI ile iletişime geçer; ödeme yöntemi, tutarı ve teslimat detayları bu görüşmede kesinleşir.",
            "Ürün bedeli tahsil edilmeden sipariş kesinleşmiş sayılmaz.",
          ],
        },
        {
          baslik: "4. Teslimat",
          paragraflar: [
            kargoCumlesi(a),
            "Ürünler, ödeme onayının ardından en geç 30 gün içinde ALICI'nın bildirdiği adrese kargo ile teslim edilir.",
            "Teslimat adresinin hatalı bildirilmesinden doğan gecikme ve masraflardan ALICI sorumludur.",
          ],
        },
        {
          baslik: "5. Cayma Hakkı",
          paragraflar: [
            "ALICI, ürünü teslim aldığı tarihten itibaren 14 (on dört) gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.",
            "Cayma bildirimi, sitede yer alan iletişim kanallarından yapılabilir.",
            "Cayma hakkının istisnaları için 'İptal ve İade Koşulları' sayfasına bakınız.",
          ],
        },
        {
          baslik: "6. Uyuşmazlık",
          paragraflar: [
            "İşbu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığı'nca ilan edilen parasal sınırlar dâhilinde ALICI'nın yerleşim yerindeki Tüketici Hakem Heyetleri ile Tüketici Mahkemeleri yetkilidir.",
          ],
        },
      ],
    },

    "on-bilgilendirme": {
      slug,
      baslik: "Ön Bilgilendirme Formu",
      ozet:
        "Sipariş vermeden önce bilmeniz gereken bilgiler. Sipariş onayı ile bu formu okuduğunuzu kabul etmiş olursunuz.",
      bolumler: [
        {
          baslik: "1. Satıcı Bilgileri",
          paragraflar: [firma(a)],
        },
        {
          baslik: "2. Ürün ve Fiyat",
          paragraflar: [
            "Sipariş edilen ürünlerin temel nitelikleri, adedi ve satış fiyatı sipariş özetinde ve sipariş sayfanızda yer alır.",
            "Tüm fiyatlar Türk Lirası cinsinden ve vergiler dâhil olarak gösterilir.",
            kargoCumlesi(a),
          ],
        },
        {
          baslik: "3. Ödeme Şekli",
          paragraflar: [
            "Ödeme sitede alınmamaktadır. Sipariş oluşturulduktan sonra WhatsApp üzerinden iletişime geçilerek ödeme yöntemi belirlenir.",
          ],
        },
        {
          baslik: "4. Teslimat",
          paragraflar: [
            "Ürünler, ödeme onayından sonra en geç 30 gün içinde kargo ile teslim edilir.",
            "Kargo firması siparişe göre değişebilir; takip numarası sipariş sayfanızda paylaşılır.",
          ],
        },
        {
          baslik: "5. Cayma Hakkı",
          paragraflar: [
            "Ürünü teslim aldığınız tarihten itibaren 14 gün içinde cayma hakkınızı kullanabilirsiniz.",
            "Cayma hakkını kullanmak için sitede yer alan telefon, e-posta veya WhatsApp kanallarından bize bildirim yapmanız yeterlidir.",
            "İade gönderimi, anlaşmalı kargo firması ile yapılır; iade kargo bedeli ve usulüne ilişkin bilgi cayma bildiriminizin ardından size iletilir.",
            "ÖNEMLİ: Ambalajı açılmış hijyen ürünleri, kozmetik ürünler ve çabuk bozulabilen gıda ürünleri cayma hakkı istisnası kapsamındadır. Bu ürünlerde ambalaj açılmışsa iade kabul edilemez.",
          ],
        },
        {
          baslik: "6. Şikâyet ve İtiraz",
          paragraflar: [
            "Uyuşmazlık durumunda yerleşim yerinizdeki Tüketici Hakem Heyeti veya Tüketici Mahkemesi'ne başvurabilirsiniz.",
          ],
        },
      ],
    },

    "iptal-iade": {
      slug,
      baslik: "İptal ve İade Koşulları",
      ozet: "Siparişinizi nasıl iptal edebilir, ürünü nasıl iade edebilirsiniz.",
      bolumler: [
        {
          baslik: "Sipariş İptali",
          paragraflar: [
            "Ürün kargoya verilmeden önce siparişinizi WhatsApp veya telefon üzerinden ücretsiz olarak iptal edebilirsiniz.",
            "Ödeme yapılmışsa, iptal talebiniz sonrası bedel iadesi en geç 14 gün içinde yapılır.",
          ],
        },
        {
          baslik: "Cayma Hakkı (14 Gün)",
          paragraflar: [
            "Ürünü teslim aldığınız tarihten itibaren 14 gün içinde gerekçe göstermeksizin cayma hakkınızı kullanabilirsiniz.",
            "Ürünün kutusu, ambalajı ve varsa standart aksesuarları eksiksiz ve hasarsız olmalıdır.",
          ],
        },
        {
          baslik: "Cayma Hakkının İstisnaları",
          paragraflar: [
            "Aşağıdaki ürünlerde, ambalajı açıldıktan sonra cayma hakkı kullanılamaz:",
            "• Tesliminden sonra ambalajı açılmış olan hijyen ve sağlık ürünleri (krem, merhem, solüsyon, sabun vb.)",
            "• Ambalajı açılmış kozmetik ürünler",
            "• Çabuk bozulabilen veya son kullanma tarihi geçebilecek gıda ürünleri",
            "Bu istisna, 6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği'nden kaynaklanmaktadır.",
          ],
        },
        {
          baslik: "Ayıplı veya Hatalı Ürün",
          paragraflar: [
            "Ürün hatalı, eksik veya hasarlı ulaştıysa teslim aldığınız gün bize bildirin. Bu durumda kargo bedeli tarafımıza aittir ve ürün ücretsiz değiştirilir veya bedeli iade edilir.",
          ],
        },
        {
          baslik: "İade Süreci",
          paragraflar: [
            "1. WhatsApp veya telefondan iade talebinizi ve sipariş numaranızı iletin.",
            "2. Size iade adresi ve kargo bilgisi verilir.",
            "3. Ürün tarafımıza ulaştıktan sonra kontrol edilir.",
            "4. Uygun bulunan iadelerde bedel, en geç 14 gün içinde ödeme yaptığınız yöntemle iade edilir.",
          ],
        },
      ],
    },

    "teslimat-kargo": {
      slug,
      baslik: "Teslimat ve Kargo",
      ozet: "Siparişiniz ne zaman ve nasıl elinize ulaşır.",
      bolumler: [
        {
          baslik: "Kargo Ücreti",
          paragraflar: [kargoCumlesi(a)],
        },
        {
          baslik: "Hazırlık Süresi",
          paragraflar: [
            "Ürünlerimiz küçük partiler hâlinde hazırlandığı için siparişler genellikle 1-2 iş günü içinde kargoya verilir.",
            "Yoğun dönemlerde bu süre uzayabilir; bu durumda WhatsApp üzerinden bilgilendirilirsiniz.",
          ],
        },
        {
          baslik: "Teslim Süresi",
          paragraflar: [
            "Kargoya verildikten sonra teslimat, bulunduğunuz bölgeye göre genellikle 1-3 iş günü sürer.",
            "Yasal azami teslim süresi 30 gündür.",
          ],
        },
        {
          baslik: "Kargo Takibi",
          paragraflar: [
            "Siparişiniz kargoya verildiğinde takip numarası sipariş sayfanıza işlenir ve WhatsApp'tan paylaşılır.",
          ],
        },
        {
          baslik: "Teslim Alırken",
          paragraflar: [
            "Paketi kargo görevlisinin yanında kontrol edin. Hasar varsa tutanak tutturun ve teslim almayın; bize hemen bildirin.",
          ],
        },
      ],
    },

    kvkk: {
      slug,
      baslik: "KVKK Aydınlatma Metni",
      ozet:
        "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verilerinizin nasıl işlendiğine dair bilgilendirme.",
      bolumler: [
        {
          baslik: "1. Veri Sorumlusu",
          paragraflar: [
            `Kişisel verileriniz, veri sorumlusu sıfatıyla ${unvan} tarafından aşağıda açıklanan kapsamda işlenmektedir.`,
            firma(a),
          ],
        },
        {
          baslik: "2. İşlenen Kişisel Veriler",
          paragraflar: [
            "• Kimlik bilgisi: ad, soyad",
            "• İletişim bilgisi: telefon numarası, e-posta adresi, teslimat adresi",
            "• İşlem bilgisi: sipariş içeriği, sipariş tarihi, tutar",
            "• İşlem güvenliği bilgisi: IP adresi, tarayıcı bilgisi",
          ],
        },
        {
          baslik: "3. İşleme Amaçları",
          paragraflar: [
            "• Siparişin oluşturulması, hazırlanması ve teslim edilmesi",
            "• Sipariş ve teslimat süreci hakkında sizinle iletişime geçilmesi",
            "• Yasal yükümlülüklerin yerine getirilmesi (fatura, muhasebe, saklama)",
            "• Talebiniz hâlinde kampanya ve duyuruların iletilmesi",
          ],
        },
        {
          baslik: "4. Aktarım",
          paragraflar: [
            "Kişisel verileriniz; teslimatın gerçekleştirilmesi amacıyla kargo firmalarına, yasal yükümlülükler kapsamında yetkili kamu kurumlarına ve hizmet aldığımız altyapı sağlayıcılarına aktarılabilir.",
            "Verileriniz pazarlama amacıyla üçüncü taraflara satılmaz.",
          ],
        },
        {
          baslik: "5. Toplama Yöntemi ve Hukuki Sebep",
          paragraflar: [
            "Kişisel verileriniz, site üzerindeki sipariş formu ve WhatsApp iletişimi aracılığıyla elektronik ortamda toplanır.",
            "Hukuki sebep: sözleşmenin kurulması ve ifası, hukuki yükümlülüğün yerine getirilmesi ve açık rızanız.",
          ],
        },
        {
          baslik: "6. Haklarınız",
          paragraflar: [
            "KVKK'nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, düzeltilmesini veya silinmesini isteme ve işlemenin sonuçlarına itiraz etme haklarına sahipsiniz.",
            "Taleplerinizi sitede yer alan iletişim kanallarından bize iletebilirsiniz.",
          ],
        },
      ],
    },

    "gizlilik-cerez": {
      slug,
      baslik: "Gizlilik ve Çerez Politikası",
      ozet: "Sitede hangi bilgileri sakladığımız ve neden.",
      bolumler: [
        {
          baslik: "Gizlilik",
          paragraflar: [
            `${ad}, ziyaretçilerinin gizliliğine önem verir. Sitede kredi kartı veya banka kartı bilgisi talep edilmez ve saklanmaz.`,
            "Sipariş sırasında verdiğiniz bilgiler yalnızca siparişinizin hazırlanması ve teslim edilmesi amacıyla kullanılır.",
          ],
        },
        {
          baslik: "Çerezler",
          paragraflar: [
            "Sitemiz, çalışması için gerekli olan teknik çerezleri kullanır. Bunlar arasında sepetinizin tarayıcınızda saklanmasını sağlayan yerel depolama da yer alır.",
            "Sepet bilgisi yalnızca sizin cihazınızda tutulur; siparişi tamamlamadığınız sürece tarafımıza iletilmez.",
            "Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz; bu durumda sepet özelliği çalışmayabilir.",
          ],
        },
        {
          baslik: "Güvenlik",
          paragraflar: [
            "Site HTTPS protokolü ile şifrelenmiş bağlantı üzerinden sunulur.",
            "Sipariş verileriniz erişimi sınırlı bir veritabanında saklanır.",
          ],
        },
      ],
    },
  };

  return belgeler[slug] ?? null;
}

export const YASAL_SLUGLAR = [
  "mesafeli-satis-sozlesmesi",
  "on-bilgilendirme",
  "iptal-iade",
  "teslimat-kargo",
  "kvkk",
  "gizlilik-cerez",
] as const;
