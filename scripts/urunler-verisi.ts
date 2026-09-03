/**
 * Katalogdaki tüm ürünlerin tanımı — `scripts/urun-yukle-toplu.ts` bunu okur.
 *
 * KAYNAK: `urunler-ham/` içindeki 63 infografik tek tek incelenerek çıkarıldı.
 *
 * ADLANDIRMA İLKESİ
 * Ablamın gönderdiği infografiklerin bir kısmı ürünü doğrudan bir hastalıkla
 * adlandırıyordu (kanser, şeker, hemoroid, vitiligo, varis, boy uzatma, bebek
 * takviyesi). Takviye edici gıdada hastalık tedavi/önleme beyanı Sağlık Beyanı
 * Yönetmeliği kapsamında yasak; yaptırımı sitenin kapatılması ve idari para
 * cezası. Bu yüzden:
 *
 *   - ad ve açıklamalarda hastalık adı ve tedavi iddiası GEÇMEZ
 *   - açıklama "içinde ne var, nasıl kullanılır" anlatır
 *   - orijinal infografik ikinci görsel olarak durmaya devam eder
 *
 * `orijinalAd` alanı, ablamın verdiği adı kayıt için tutar — panelde ürünü
 * bulmak gerektiğinde işe yarar.
 *
 * FİYATLAR GEÇİCİDİR. Panelden düzeltilecek.
 */

export type UrunTanimi = {
  slug: string;
  baslik: string;
  /** Ablamın infografikteki adı — yalnızca kayıt için. */
  orijinalAd?: string;
  kategoriSlug: string;
  fiyat: string;
  kisa: string;
  aciklama: string;
  setIcerigi?: string[];
  /** urunler-ham/ içindeki dosya (ikinci görsel). */
  infografik: string;
  /** urun-gorselleri/ içindeki showroom görseli (kapak). Yoksa infografik kapak olur. */
  showroom?: string;
  /**
   * Görseli sunuma hazır değil — siteye ŞİMDİLİK konmaz.
   *
   * Bu ürünlerin elimizdeki tek görseli telefon ekran görüntüsü, emoji
   * çıkartmalı ya da içinde sohbet ekranı olan bir kare. Showroom görseli
   * üretilince bayrak kaldırılıp yüklenecek.
   *
   * Yükleme betiği bunları atlar ve canlıda varsa siler.
   */
  beklet?: boolean;
};

const H = "WhatsApp Image 2026-09-03 at";

/** Setlerin ortak dip notu — hepsinde tekrar yazmamak için. */
const SET_NOT =
  "\n\nTakviye edici gıdalar normal beslenmenin yerine geçmez. Hamilelik ve " +
  "emzirme döneminde, kronik rahatsızlığı olanlarda ve düzenli ilaç " +
  "kullananlarda, kullanmadan önce doktora danışılmalıdır. Çocukların " +
  "ulaşamayacağı yerde saklayın.";

/** Harici kullanım ürünlerinin ortak dip notu. */
const HARICI_NOT =
  "\n\nYalnızca harici kullanım içindir. İlk kullanımdan önce küçük bir alanda " +
  "deneyin. Gözle temasından kaçının.";

export const URUNLER: UrunTanimi[] = [
  /* ==================== GIDA & TAKVİYE ==================== */
  {
    slug: "ayvalik-zeytinyagi-soguk-sikim-5l",
    baslik: "Ayvalık Zeytinyağı — Soğuk Sıkım 5 L",
    kategoriSlug: "bitkisel-yaglar",
    fiyat: "2450.00",
    kisa: "Balıkesir Ayvalık, erken hasat, soğuk sıkım. Asit oranı %0,3.",
    aciklama: `Balıkesir Ayvalık bölgesinden erken hasat zeytinlerin soğuk sıkım yöntemiyle elde edildiği sızma zeytinyağı. Asit oranı %0,3.

Soğuk sıkımda zeytin ısıya maruz kalmadığı için doğal aroması ve polifenol içeriği korunur.

Kullanım: Salata, kahvaltı, zeytinyağlı yemekler, makarna ve soslar, sebze ve fırın yemekleri, et-tavuk-balık marinasyonu.

Kışın doğal olarak yoğunlaşıp bulanıklaşabilir veya donabilir. Bu saflığın göstergesidir; oda sıcaklığında kısa sürede eski hâline döner.

Hacim: 5 litre. Serin ve ışık almayan yerde saklayın.`,
    infografik: `${H} 02.05.25 (1).jpeg`,
    showroom: "01-zeytinyagi.jpg",
  },
  {
    slug: "uzum-pekmezi",
    baslik: "Üzüm Pekmezi",
    kategoriSlug: "takviye-urunler",
    fiyat: "320.00",
    kisa: "Geleneksel yöntemle kaynatılmış, katkısız üzüm pekmezi.",
    aciklama: `Siyah üzümün geleneksel yöntemle kaynatılarak koyulaştırılmasıyla elde edilir. Şeker, koruyucu veya katkı maddesi içermez.

Doğal karbonhidrat ve mineral kaynağıdır.

Kullanım: Kahvaltıda tahin ile karıştırarak, sütle, veya tatlılarda kullanılabilir.

Cam kavanoz. Serin ve kuru yerde saklayın, açtıktan sonra buzdolabında tutun.`,
    infografik: `${H} 02.05.27.jpeg`,
    showroom: "02-uzum-pekmezi.jpg",
  },
  {
    slug: "propolis-damla-50ml",
    baslik: "Propolis Damla 50 ml — Alkolsüz",
    kategoriSlug: "takviye-urunler",
    fiyat: "480.00",
    kisa: "Alkol içermeyen propolis özütü, damlalıklı amber şişe.",
    aciklama: `Arıların kovan girişini korumak için ürettiği reçinemsi maddeden elde edilen özüt. Alkol içermeyen formülü sayesinde her gün kullanıma uygundur.

Damlalıklı 50 ml amber cam şişe. Amber cam içeriği ışıktan korur.

Serin ve ışık almayan yerde saklayın.${SET_NOT}`,
    infografik: `${H} 02.05.27 (1).jpeg`,
    showroom: "03-propolis.jpg",
  },
  {
    slug: "kombu-cayi-kombucha-500ml",
    baslik: "Kombu Çayı (Kombucha) 500 ml",
    kategoriSlug: "cay-detoks",
    fiyat: "180.00",
    kisa: "Doğal fermente çay. Rafine şeker ve koruyucu içermez.",
    aciklama: `Özenle fermente edilen kombu çayı; doğal probiyotikler, enzimler ve organik asitler içerir. Rafine şeker, koruyucu ve katkı maddesi içermez. Vegan.

Kullanım: Günde 1 şişe, soğuk olarak tüketilmesi önerilir.

Hacim: 500 ml. Açıldıktan sonra buzdolabında saklayın.`,
    infografik: `${H} 02.08.46.jpeg`,
    showroom: "04-kombu-cayi.jpg",
  },
  {
    slug: "probiyotik-konsantre-icecek-500ml",
    baslik: "Probiyotik Konsantre İçecek 500 ml",
    kategoriSlug: "cay-detoks",
    fiyat: "640.00",
    kisa: "Canlı kültür içeren konsantre içecek.",
    aciklama: `Canlı kültür içeren konsantre içecek. Günlük beslenmesine probiyotik desteği eklemek isteyenler için.

Hacim: 500 ml.

Kullanım: Kullanmadan önce çalkalayın. Açıldıktan sonra buzdolabında saklayın.${SET_NOT}`,
    infografik: `${H} 02.08.47 (4).jpeg`,
  },
  {
    slug: "kirmizi-pancar-tozu",
    baslik: "Kırmızı Pancar Tozu",
    kategoriSlug: "takviye-urunler",
    fiyat: "290.00",
    kisa: "Kurutulup öğütülmüş kırmızı pancar. Demir ve folat kaynağı.",
    aciklama: `Kırmızı pancarın kurutulup öğütülmesiyle elde edilen toz. Doğal demir ve folat kaynağıdır.

Kullanım: Günde 1 tatlı kaşığı su, ayran veya yoğurda karıştırılarak tüketilebilir. Kan macunu ile birlikte kullanılabilir.

Serin ve kuru yerde, ağzı kapalı saklayın.${SET_NOT}`,
    infografik: `${H} 02.08.51 (5).jpeg`,
  },

  /* ==================== CİLT BAKIMI — TEKİL ==================== */
  {
    slug: "guzellik-kremi",
    baslik: "Güzellik Kremi",
    kategoriSlug: "cilt-bakimi",
    fiyat: "590.00",
    kisa: "Argan, aloe vera ve E vitamini içeren günlük yüz kremi.",
    aciklama: `İçindekiler: Argan yağı, aloe vera, hindistan cevizi yağı, kuşburnu yağı, papatya özü, E vitamini.

Kullanım alanları: Yüz, boyun ve dekolte, eller, vücut.

Kullanım: Temiz cilde sabah ve akşam nazikçe masaj yaparak uygulayın.

Paraben, sülfat ve alkol içermez. Tüm cilt tipleri için uygundur. Dermatolojik olarak test edilmiştir.${HARICI_NOT}`,
    infografik: `${H} 02.08.49 (1).jpeg`,
    showroom: "06-guzellik-kremi.jpg",
  },
  {
    slug: "yogun-nemlendirici-el-yuz-kremi",
    baslik: "Yoğun Nemlendirici El & Yüz Kremi",
    kategoriSlug: "cilt-bakimi",
    fiyat: "420.00",
    kisa: "Aloe vera ve shea yağı ile yoğun nem, yağlı his bırakmaz.",
    aciklama: `İçindekiler: Aloe vera, shea yağı, jojoba yağı, E vitamini, papatya özü, hindistan cevizi yağı.

Kullanım alanları: Yüz, eller, dirsek, diz ve boyun gibi kuru bölgeler.

Kullanım: Temiz cilde yeterli miktarda alıp nazikçe masaj yaparak uygulayın. Gün içinde ihtiyaç duydukça tekrarlayın.

Hafif dokusu sayesinde hızla emilir, yağlı his bırakmaz. Paraben, sülfat ve renklendirici içermez.${HARICI_NOT}`,
    infografik: `${H} 02.08.49 (4).jpeg`,
    showroom: "07-yogun-nemlendirici-krem.jpg",
  },
  {
    slug: "hindistan-cevizi-yagli-krem",
    baslik: "Hindistan Cevizi Yağlı Krem",
    kategoriSlug: "cilt-bakimi",
    fiyat: "380.00",
    kisa: "Hindistan cevizi yağı ile yoğun nem ve bakım.",
    aciklama: `Hindistan cevizi yağı ile hazırlanmış nemlendirici krem.

Kullanım alanları: Yüz, eller, vücut, bacaklar, ayaklar.

Kullanım: Temiz cilde nazikçe masaj yaparak uygulayın. Günlük kullanıma uygundur.

Paraben, silikon, renklendirici ve hayvansal içerik içermez. Tüm cilt tipleri için uygundur.${HARICI_NOT}`,
    infografik: `${H} 02.08.49 (9).jpeg`,
    showroom: "08-hindistan-cevizi-krem.jpg",
  },
  {
    slug: "kuyruk-yagli-cilt-kremi",
    baslik: "Kuyruk Yağlı Cilt Kremi",
    kategoriSlug: "cilt-bakimi",
    fiyat: "450.00",
    kisa: "Kuyruk yağı ile zenginleştirilmiş, kuru ciltler için.",
    aciklama: `Kuyruk yağı ile zenginleştirilmiş bakım kremi. Kuru ve pullanan cilt bölgelerinde, yüz ve vücutta kullanılır. Yoğun nem sağlar, cilt bariyerini destekler.

Kullanım: Temiz cilde ince bir tabaka hâlinde, nazikçe masaj yaparak uygulayın.

Dermatolojik olarak test edilmiştir. Paraben, sülfat ve renklendirici içermez.${HARICI_NOT}`,
    infografik: `${H} 02.08.48 (6).jpeg`,
    showroom: "09-kuyruk-yagli-krem.jpg",
  },
  {
    slug: "aynisefa-ozlu-kremsi-macun",
    baslik: "Aynısefa Özlü Kremsi Macun 110 ml",
    kategoriSlug: "cilt-bakimi",
    fiyat: "520.00",
    kisa: "Aynısefa (calendula) özlü, el yapımı kremsi macun. 110 ml.",
    aciklama: `Aynısefa (calendula) özü ile hazırlanmış el yapımı kremsi macun. Kuruyan ve yıpranan ciltte kullanılır; yumuşatır ve yoğun nem verir.

Kullanım: İhtiyaç duyulan bölgeye ince bir tabaka hâlinde uygulayın.

Hacim: 110 ml.${HARICI_NOT}`,
    infografik: `${H} 02.08.47 (3).jpeg`,
  },
  {
    slug: "sivilce-kremi",
    baslik: "Sivilce Kremi",
    kategoriSlug: "cilt-bakimi",
    fiyat: "390.00",
    kisa: "Çay ağacı yağı, kil ve çinko oksit içeren bakım kremi.",
    aciklama: `İçindekiler: Çay ağacı yağı, aloe vera, kil, papatya özü, shea yağı, çinko oksit.

Kullanım alanları: Yüz, alın, çene, sırt ve göğüs bölgesi.

Kullanım: Temiz cilde günde 1-2 kez ince bir tabaka hâlinde uygulayın. Cildin yağ dengesini korumaya yardımcı olur.

Paraben, sülfat ve renklendirici içermez. Tüm cilt tiplerine uygundur.${HARICI_NOT}`,
    infografik: `${H} 02.08.49.jpeg`,
  },
  {
    slug: "goz-alti-bakim-kremi",
    baslik: "Göz Altı Bakım Kremi",
    orijinalAd: "Göz Altı Morluk Kremi",
    kategoriSlug: "cilt-bakimi",
    fiyat: "460.00",
    kisa: "Kafein, C vitamini ve hyaluronik asit içeren göz çevresi kremi.",
    aciklama: `İçindekiler: Kafein, aloe vera, C vitamini, hyaluronik asit, yeşil çay özü.

Göz çevresindeki hassas cilt için formüle edilmiştir.

Kullanım: Temiz cilde parmak uçlarıyla hafifçe vurarak uygulayın; sabah ve akşam kullanılabilir.

Paraben, sülfat ve renklendirici içermez.${HARICI_NOT}`,
    infografik: `${H} 02.08.49 (10).jpeg`,
  },
  {
    slug: "dogal-gunes-kremi",
    baslik: "Doğal Güneş Kremi",
    kategoriSlug: "cilt-bakimi",
    fiyat: "540.00",
    kisa: "Dört mevsim kullanıma uygun doğal içerikli bakım kremi.",
    aciklama: `Doğal içerikli koruyucu ve bakım kremi. Yazın güneşin etkilerine, kışın kuruluk ve çatlak oluşumuna karşı bakım sağlar.

Kullanım: Güneşe çıkmadan yaklaşık 30 dakika önce uygulayın, gün içinde yenileyin. Yetişkin ve çocuklarda, hassas ciltlerde kullanılabilir.

Paraben ve kimyasal katkı içermez.${HARICI_NOT}`,
    infografik: `${H} 02.08.48 (2).jpeg`,
  },
  {
    slug: "tras-sonrasi-bakim-kremi",
    baslik: "Traş Sonrası Bakım Kremi",
    kategoriSlug: "cilt-bakimi",
    fiyat: "350.00",
    kisa: "Traş sonrası cildi yatıştıran, hızlı emilen bakım kremi.",
    aciklama: `İçindekiler: Aloe vera, papatya özü, jojoba yağı, E vitamini, çay ağacı yağı.

Kullanım: Yüzü ılık su ile yıkayıp kuruladıktan sonra nazikçe uygulayın. Hızlı emilir, yağlı his bırakmaz.

Paraben ve alkol içermez. Tüm cilt tiplerine uygundur.${HARICI_NOT}`,
    infografik: `${H} 02.08.49 (3).jpeg`,
  },
  {
    slug: "pisik-kremi",
    baslik: "Pişik Kremi",
    kategoriSlug: "anne-bebek",
    fiyat: "280.00",
    kisa: "Bebeklerin hassas cildi için zeytinyağı ve çinko oksit içeren krem.",
    aciklama: `İçindekiler: Zeytinyağı, papatya özü, aloe vera, çinko oksit, shea yağı.

Bebeklerin hassas cildi için formüle edilmiştir. Bez bölgesinde ve tahrişe eğilimli ciltte kullanılır.

Kullanım: Temiz ve kuru cilde her bez değişiminde ince bir tabaka hâlinde uygulanabilir.

Paraben, sülfat ve renklendirici içermez. Dermatolojik olarak test edilmiştir.${HARICI_NOT}`,
    infografik: `${H} 02.08.48 (5).jpeg`,
  },
  {
    slug: "ton-esitleyici-krem",
    baslik: "Ton Eşitleyici Krem",
    orijinalAd: "Beyazlatıcı Krem",
    kategoriSlug: "cilt-bakimi",
    fiyat: "520.00",
    kisa: "Cilt tonunu eşitlemeye yardımcı günlük bakım kremi.",
    aciklama: `Cilt tonunun daha eşit ve aydınlık görünmesine yardımcı olan bakım kremi. Tüm vücutta kullanıma uygundur.

Kullanım: Temiz cilde günlük bakım rutininde uygulayın. Düzenli kullanım önerilir.

Tüm cilt tiplerine uygundur, nemlendirir ve besler.${HARICI_NOT}`,
    infografik: `${H} 02.05.26.jpeg`,
  },
  {
    slug: "anti-aging-serum",
    beklet: true,
    baslik: "Anti-Aging Bakım Serumu",
    orijinalAd: "Anti Aging Kırışıklık & Leke Giderici Serum",
    kategoriSlug: "cilt-bakimi",
    fiyat: "680.00",
    kisa: "İnce çizgi ve ton eşitsizliği görünümü için bakım serumu.",
    aciklama: `Cildin nem dengesini korumaya ve daha canlı, aydınlık görünmesine yardımcı bakım serumu. İnce çizgi ve kırışıklık görünümünü azaltmaya destek olur.

Kullanım: Temizlenmiş cilde birkaç damla uygulayıp nazikçe yedirin. Ardından nemlendirici kullanılabilir.

Damlalıklı şişe.${HARICI_NOT}`,
    // 3 Eylül partisinde daha temiz, tek ürünlü versiyonu geldi.
    infografik: `${H} 16.47.05 (4).jpeg`,
  },
  {
    slug: "rusur-tasi-kremi",
    baslik: "Ruşur Taşı Kremi",
    kategoriSlug: "cilt-bakimi",
    fiyat: "440.00",
    kisa: "Gözenek ve ton görünümü için ruşur taşı özlü krem.",
    aciklama: `Ruşur taşı özü ile hazırlanmış bakım kremi. Gözeneklerin daha temiz görünmesine ve cilt tonunun eşitlenmesine yardımcı olur.

Kullanım alanları: Yüz, koltuk altı, diz ve dirsek gibi ton farkı olan bölgeler.

Kullanım: Uygulanacak bölgeyi temizleyip kuruladıktan sonra nazikçe masaj yaparak sürün.

Paraben, sülfat ve alkol içermez.${HARICI_NOT}`,
    infografik: `${H} 02.08.48 (1).jpeg`,
  },
  {
    slug: "mumiyo-bakim-kremi",
    baslik: "Mumiyo Bakım Kremi",
    orijinalAd: "Mumiyo Botox Kremi",
    kategoriSlug: "cilt-bakimi",
    fiyat: "720.00",
    kisa: "Mumiyo (shilajit) özlü, yoğun bakım kremi.",
    aciklama: `Doğal mumiyo (shilajit) özleri ile zenginleştirilmiş yoğun bakım kremi. Cildin daha sıkı, pürüzsüz ve canlı görünmesine yardımcı olur.

Kullanım: Temiz cilde sabah ve akşam nazikçe masaj yaparak uygulayın.

Tüm cilt tipleri için uygundur.${HARICI_NOT}`,
    infografik: `${H} 02.08.48 (3).jpeg`,
  },
  {
    slug: "hamilelik-catlak-selulit-kremi",
    baslik: "Çatlak & Selülit Bakım Kremi",
    orijinalAd: "Hamilelik Öncesi & Sonrası Çatlak & Selülit Kremi",
    kategoriSlug: "cilt-bakimi",
    fiyat: "620.00",
    kisa: "Shea, badem ve kakao yağı içeren, cilde esneklik veren krem.",
    aciklama: `İçindekiler: Shea yağı, badem yağı, centella asiatica, E vitamini, kakao yağı, jojoba yağı.

Kullanım alanları: Karın, basen, göğüs, kalça ve bacak bölgeleri.

Kullanım: Temiz cilde dairesel hareketlerle masaj yaparak uygulayın. Cildi derinlemesine nemlendirir ve esneklik kazandırır.

Paraben, sülfat ve renklendirici içermez. Dermatolojik olarak test edilmiştir. Hamilelik döneminde kullanmadan önce doktorunuza danışın.${HARICI_NOT}`,
    infografik: `${H} 02.08.48 (4).jpeg`,
  },
  {
    slug: "iyotlu-krem",
    baslik: "İyotlu Krem",
    kategoriSlug: "cilt-bakimi",
    fiyat: "410.00",
    kisa: "İyot içeren, yağlı ve akneye meyilli ciltler için bakım kremi.",
    aciklama: `İyot içeren bakım kremi. Cildin yağ dengesini korumaya ve gözeneklerin daha temiz görünmesine yardımcı olur.

Kullanım alanları: Yağlı ve akneye meyilli ciltler, geniş gözenek görülen bölgeler, kuruluk ve kaşıntı olan bölgeler.

Kullanım: Temiz cilde ince bir tabaka hâlinde uygulayın.

Paraben, sülfat ve renklendirici içermez. Dermatolojik olarak test edilmiştir.${HARICI_NOT}`,
    infografik: `${H} 02.08.49 (2).jpeg`,
  },
  {
    slug: "udihindi-kremi",
    baslik: "Udihindi Kremi",
    kategoriSlug: "cilt-bakimi",
    fiyat: "430.00",
    kisa: "Udihindi özü ile hassas bölgeler için rahatlatıcı krem.",
    aciklama: `İçindekiler: Udihindi özü, papatya özü, aloe vera, hindistan cevizi yağı, çay ağacı yağı, E vitamini.

Kullanım alanları: İç uyluk, kasık, koltuk altı gibi tahrişe yatkın bölgeler; günlük bakım.

Kullanım: Bölgeyi temizleyip kuruladıktan sonra ince bir tabaka hâlinde uygulayın. Sabah ve akşam kullanıma uygundur.

Paraben, sülfat ve alkol içermez. Hassas ciltler için geliştirilmiştir.${HARICI_NOT}`,
    infografik: `${H} 02.08.49 (5).jpeg`,
  },
  {
    slug: "kararan-bolge-kremi",
    baslik: "Kararan Bölge Bakım Kremi",
    kategoriSlug: "cilt-bakimi",
    fiyat: "470.00",
    kisa: "Meyan kökü ve ebegümeci özlü, ton eşitleyici bakım kremi.",
    aciklama: `İçindekiler: Meyan kökü özü, ebegümeci özü, tatlı badem yağı, papatya özü, E vitamini.

Kullanım alanları: Koltuk altı, kasık bölgesi, dirsek, diz ve boyun.

Kullanım: Uygulanacak bölgeyi temizleyip kuruladıktan sonra nazikçe masaj yaparak sürün. Gün içinde düzenli kullanım önerilir.

Paraben, sülfat ve alkol içermez. Hassas ciltler için özel olarak geliştirilmiştir.${HARICI_NOT}`,
    infografik: `${H} 02.08.49 (6).jpeg`,
  },
  {
    slug: "leke-bakim-yuz-kremi",
    baslik: "Leke Bakım Yüz Kremi",
    orijinalAd: "Leke Giderici Cilt Açıcı Yüz Kremi",
    kategoriSlug: "cilt-bakimi",
    fiyat: "560.00",
    kisa: "Niasinamid ve C vitamini içeren, ton eşitleyici yüz kremi.",
    aciklama: `İçindekiler: Niasinamid, C vitamini, meyan kökü özü, papatya özü, aloe vera, E vitamini.

Kullanım alanları: Yüz, alın ve yanak, çene çevresi, boyun.

Kullanım: Temiz ve kuru cilde nazikçe uygulayın, dairesel hareketlerle yedirin. Sabah ve akşam düzenli kullanım önerilir.

Paraben, sülfat ve alkol içermez.${HARICI_NOT}`,
    infografik: `${H} 02.08.49 (7).jpeg`,
  },
  {
    slug: "sidir-kremi",
    baslik: "Sıdır Kremi 50 ml",
    kategoriSlug: "cilt-bakimi",
    fiyat: "480.00",
    kisa: "Sıdır (sidr) özlü, el yapımı bakım kremi. Tüm cilt tipleri için.",
    aciklama: `Sıdır (sidr) yaprağı özü ile hazırlanan el yapımı bakım kremi. Cildi nemlendirir, kuruluğu önler ve tahriş olmuş cildi yatıştırır.

Kullanım: Temiz cilde ince bir tabaka hâlinde uygulayın.

Hacim: 50 ml. Kimyasal içermez, hayvanlar üzerinde test edilmemiştir.${HARICI_NOT}`,
    infografik: `${H} 02.08.51 (2).jpeg`,
  },
  {
    slug: "erkek-ozel-bakim-kremi",
    baslik: "Erkeklere Özel Bakım Kremi",
    orijinalAd: "Erkek Özel Krem",
    kategoriSlug: "cilt-bakimi",
    fiyat: "590.00",
    kisa: "Ginseng, çörek otu ve maca kökü içeren harici bakım kremi.",
    aciklama: `İçindekiler: Ginseng, çörek otu, zencefil, maca kökü, çinko, tribulus, E vitamini.

Kullanım: Temiz ve kuru cilde masaj yaparak günde 1-2 kez uygulayın. Düzenli kullanım önerilir.

Paraben, koruyucu ve boya içermez. Hayvanlar üzerinde test edilmemiştir.${HARICI_NOT} Gözle temas ettirmeyin, çocukların ulaşamayacağı yerde saklayın.`,
    infografik: `${H} 02.08.49 (8).jpeg`,
  },
  {
    slug: "dogal-tirnak-bakim-yagi",
    baslik: "Doğal Tırnak Bakım Yağı",
    kategoriSlug: "bitkisel-yaglar",
    fiyat: "240.00",
    kisa: "Fırça uçlu tırnak ve tırnak eti bakım yağı. Vegan.",
    aciklama: `Tırnak ve tırnak çevresindeki cildin bakımı için hazırlanmış bitkisel yağ karışımı. Tırnak etini nemlendirir ve yumuşatır.

Kullanım: Fırça uçlu uygulayıcı ile doğrudan tırnak yüzeyine ve tırnak etine sürün. Düzenli kullanım önerilir.

Vegan.${HARICI_NOT}`,
    infografik: `${H} 02.05.27 (4).jpeg`,
  },

  /* ==================== SAÇ BAKIMI ==================== */
  {
    slug: "sac-kremi",
    baslik: "Saç Kremi",
    kategoriSlug: "sac-bakimi",
    fiyat: "340.00",
    kisa: "Argan, zeytinyağı ve buğday proteini içeren saç kremi.",
    aciklama: `İçindekiler: Argan yağı, zeytinyağı, aloe vera, hindistan cevizi yağı, papatya özü, buğday proteini.

Kullanım: Şampuan sonrası nemli saça uygulayın, 2-3 dakika bekletip iyice durulayın.

Tüm saç tipleri için uygundur. Paraben, sülfat ve renklendirici içermez. Dermatolojik olarak test edilmiştir.${HARICI_NOT}`,
    infografik: `${H} 02.08.48 (7).jpeg`,
  },

  /* ==================== SABUN & TEMİZLİK ==================== */
  {
    slug: "sarimsak-ozlu-sabun",
    baslik: "Sarımsak Özlü Sabun",
    kategoriSlug: "sabun-temizlik",
    fiyat: "160.00",
    kisa: "Sarımsak özü ile hazırlanmış doğal katı sabun.",
    aciklama: `Sarımsak özü ile zenginleştirilmiş doğal sabun. Günlük yüz ve vücut kullanımına uygundur; yağlı ve akneye meyilli ciltlerde tercih edilir.

Kullanım: Islak cilde nazikçe masaj yaparak uygulayın, birkaç dakika bekledikten sonra bol su ile durulayın.

Kimyasal içermez, hayvanlar üzerinde test edilmemiştir.${HARICI_NOT}`,
    infografik: `${H} 02.05.28.jpeg`,
  },

  /* ==================== SETLER ==================== */
  {
    slug: "sac-bakim-seti-katranli",
    baslik: "Katranlı Saç Bakım Seti",
    orijinalAd: "Saç Kıran Seti",
    kategoriSlug: "setler",
    fiyat: "1180.00",
    setIcerigi: ["Katranlı özel şampuan", "Saç bakım serumu", "Katranlı sabun", "Kemik tarak"],
    kisa: "Katranlı şampuan, bakım serumu, katranlı sabun ve kemik tarak.",
    aciklama: `Dört parçalık saç bakım seti. Katranlı şampuan ve sabun saç derisini temizler; bakım serumu saç köklerini besler; kemik tarak saç derisine nazik davranır.

Kullanım: Şampuanı ıslak saça masaj yaparak uygulayın, 2-3 dakika bekletip durulayın. Serumu temiz saç derisine sürün. Katranlı sabunu haftada 2-3 kez kullanın.${HARICI_NOT}`,
    infografik: `${H} 02.05.25.jpeg`,
  },
  {
    slug: "sac-guclendirme-destek-seti",
    baslik: "Saç Güçlendirme Destek Seti",
    orijinalAd: "Saç Çıkarıcı Destek Set",
    kategoriSlug: "setler",
    fiyat: "1340.00",
    setIcerigi: ["Katranlı özel şampuan", "Katran sabun", "Saç bakım serumu", "Lugol iyot", "Kemik tarak"],
    kisa: "Katranlı şampuan ve sabun, bakım serumu, lugol iyot ve kemik tarak.",
    aciklama: `Beş parçalık saç bakım seti. Saç derisini temizlemeye, saçı beslemeye ve nemlendirmeye yönelik ürünlerden oluşur.

Kullanım: Şampuanı saç derisine masaj yaparak uygulayın, 2-3 dakika bekletip durulayın; haftada 2-3 kez. Serumu temiz saç derisine püskürtün, masaj yapın, durulamayın. Kemik tarakla nazikçe tarayın.${HARICI_NOT}`,
    infografik: `${H} 02.08.50 (5).jpeg`,
  },
  {
    slug: "istah-ve-kilo-destek-seti",
    beklet: true,
    baslik: "İştah ve Kilo Destek Seti",
    orijinalAd: "Kilo Aldırıcı Set",
    kategoriSlug: "setler",
    fiyat: "1420.00",
    setIcerigi: ["İştah açıcı macun", "Karadut özü", "İğde çekirdeği tozu", "D vitamini"],
    kisa: "İştah açıcı macun, karadut özü, iğde çekirdeği tozu ve D vitamini.",
    aciklama: `Dört parçalık takviye seti. Günlük beslenmeyi desteklemek isteyenler için hazırlanmıştır.

Kullanım: Macunu sabah ve akşam aç karnına 1 tatlı kaşığı; karadut özünü günde 1 tatlı kaşığı; iğde çekirdeği tozunu su veya yoğurda karıştırarak; D vitaminini damlalıkla önerilen miktarda tüketin.${SET_NOT}`,
    infografik: `${H} 02.05.26 (1).jpeg`,
  },
  {
    slug: "selulit-catlak-bakim-seti",
    beklet: true,
    baslik: "Selülit & Çatlak Bakım Seti",
    kategoriSlug: "setler",
    fiyat: "980.00",
    setIcerigi: ["Mentollü masaj serumu", "Çatlak kremi", "Vücut fırçası"],
    kisa: "Mentollü masaj serumu, çatlak kremi ve vücut fırçası.",
    aciklama: `Üç parçalık vücut bakım seti. Mentollü serum ciltte serinlik hissi verir; çatlak kremi cildi nemlendirir ve esneklik kazandırır; vücut fırçası ölü deriden arındırır.

Kullanım: Kuru cilde fırça ile dairesel hareketlerle 5-10 dakika masaj yapın. Ardından serum ve kremi uygulayın.${HARICI_NOT}`,
    infografik: `${H} 02.05.26 (2).jpeg`,
  },
  {
    slug: "ferahlatici-destek-seti",
    baslik: "Ferahlatıcı Destek Seti",
    orijinalAd: "Sinüzit / Migren Seti",
    kategoriSlug: "setler",
    fiyat: "1290.00",
    setIcerigi: ["Masaj taşı", "Ferahlatıcı serum", "Bitkisel karışım", "Lugol iyot", "Mumiyo tablet"],
    kisa: "Masaj taşı, ferahlatıcı serum, bitkisel karışım, lugol iyot ve mumiyo tablet.",
    aciklama: `Beş parçalık set. Günlük rahatlama rutini için hazırlanmıştır.

Kullanım: Masaj taşını şakak ve ense bölgesinde nazikçe gezdirin. Serumu harici olarak uygulayın. Lugol iyot ve mumiyo tableti etiketindeki öneriye göre tüketin.${SET_NOT}`,
    infografik: `${H} 02.05.26 (3).jpeg`,
  },
  {
    slug: "kadin-bakim-destek-seti",
    baslik: "Kadın Bakım Destek Seti",
    orijinalAd: "Gebelik ve Kadınsal Problemler İçin Set",
    kategoriSlug: "setler",
    fiyat: "1680.00",
    setIcerigi: ["Kadın bakım serumu", "Bitki çayı", "Hayıt macunu", "Hayıt tentürü", "Nioli yağı", "Lugol iyot"],
    kisa: "Bakım serumu, bitki çayı, hayıt macunu ve tentürü, nioli yağı, lugol iyot.",
    aciklama: `Altı parçalık set. Kadınların günlük bakım ve beslenme rutinini desteklemek için hazırlanmıştır.

Kullanım: Bakım serumu harici kullanım içindir. Bitki çayını günde 1 fincan demleyerek; hayıt macununu günde 1 tatlı kaşığı tüketin. Nioli yağı aromaterapi veya taşıyıcı yağla kullanılır.${SET_NOT}`,
    infografik: `${H} 02.08.46 (3).jpeg`,
  },
  {
    slug: "kadin-bakim-serumu",
    baslik: "Kadın Bakım Serumu",
    orijinalAd: "Rahim Temizleme ve Güçlendirici Serum",
    kategoriSlug: "cilt-bakimi",
    fiyat: "520.00",
    kisa: "Genital bölge dış temizliği için %100 doğal içerikli sprey.",
    aciklama: `Genital bölgenin dıştan günlük temizliği için hazırlanmış doğal içerikli bakım spreyi.

Kullanım: Temiz cilde günde 1-2 kez dıştan uygulanır. Kullanmadan önce çalkalayın.

Sentetik katkı, paraben, alkol ve kimyasal madde içermez. Hayvanlar üzerinde test edilmemiştir.${HARICI_NOT} Vajina içine uygulanmaz.`,
    infografik: `${H} 02.08.47 (2).jpeg`,
  },
  {
    slug: "tuy-bakim-seti",
    beklet: true,
    baslik: "Tüy Bakım Seti",
    orijinalAd: "Tüy Dökücü ve Bitirici Set",
    kategoriSlug: "setler",
    fiyat: "880.00",
    setIcerigi: ["Tüy bakım losyonu", "Tüy sonrası bakım losyonu", "Kabak lifi"],
    kisa: "İki bakım losyonu ve kabak lifinden oluşan vücut bakım seti.",
    aciklama: `Üç parçalık vücut bakım seti. Tüy alma sonrası cildin bakımı için hazırlanmıştır.

Kullanım: Kabak lifi ile bölgeyi nazikçe ovun, durulayın. Losyonları temiz ve kuru cilde uygulayın.${HARICI_NOT}`,
    infografik: `${H} 02.05.27 (5).jpeg`,
  },
  {
    slug: "ayak-bakim-seti",
    baslik: "Ayak Bakım Seti",
    orijinalAd: "Nasır Destek Seti",
    kategoriSlug: "setler",
    fiyat: "1150.00",
    setIcerigi: ["Kabak lifi", "Ayak bakım serumu", "Lugol iyot", "Bakım kremi", "Aynısefa kremi", "Katran sabun"],
    kisa: "Kabak lifi, bakım serumu, lugol iyot, iki bakım kremi ve katran sabun.",
    aciklama: `Altı parçalık ayak bakım seti. Ayakların günlük bakımı için hazırlanmıştır.

Kullanım: Ayakları ılık suda yumuşattıktan sonra kabak lifi ile nazikçe ovun. Serumu bölgeye masaj yaparak günde 2 kez uygulayın. Kremleri ince tabaka hâlinde sürün. Katran sabunla günde 1 kez yıkayın.${HARICI_NOT}`,
    infografik: `${H} 02.08.46 (1).jpeg`,
  },
  {
    slug: "topuk-ve-ayak-konfor-seti",
    baslik: "Topuk ve Ayak Konfor Seti",
    orijinalAd: "Topuk Dikeni Destek Seti",
    kategoriSlug: "setler",
    fiyat: "1220.00",
    setIcerigi: ["Topuk bakım kremi", "Katran sabun", "Magnezyum sülfat (İngiliz tuzu)", "Lugol iyot", "Hint yağı"],
    kisa: "Topuk bakım kremi, katran sabun, İngiliz tuzu, lugol iyot ve hint yağı.",
    aciklama: `Beş parçalık ayak bakım seti. Ayakların günlük konforu için hazırlanmıştır.

Kullanım: Magnezyum sülfatı ılık suya ekleyip ayak banyosu yapın. Kremi sabah ve akşam temiz cilde masaj yaparak uygulayın. Hint yağını yatmadan önce masaj yaparak sürün.${HARICI_NOT}`,
    infografik: `${H} 02.08.47.jpeg`,
  },
  {
    slug: "bacak-konfor-destek-seti",
    baslik: "Bacak Konfor Destek Seti",
    orijinalAd: "Varis Giderici Destek Seti",
    kategoriSlug: "setler",
    fiyat: "1560.00",
    setIcerigi: ["Bitkisel ekstrakt", "Bacak bakım serumu", "Bacak bakım kremi", "At kılı fırça"],
    kisa: "Bitkisel ekstrakt, bakım serumu ve kremi, at kılı vücut fırçası.",
    aciklama: `Dört parçalık bacak bakım seti. At kestanesi, gotu kola ve hesperidin içeren bitkisel ekstrakt ile birlikte harici bakım ürünlerinden oluşur.

Kullanım: Kuru fırçalamayı dairesel hareketlerle 5-10 dakika yapın. Serumu sabah ve akşam masaj yaparak uygulayın. Kremi günde 2-3 kez bölgeye sürün. Ekstraktı etiketindeki öneriye göre tüketin.${SET_NOT}`,
    infografik: `${H} 02.08.46 (5).jpeg`,
  },
  {
    slug: "vucut-sikilastirma-bakim-seti",
    baslik: "Vücut Sıkılaştırma Bakım Seti",
    orijinalAd: "Göğüs Büyütücü Toparlayıcı Destek Seti",
    kategoriSlug: "setler",
    fiyat: "940.00",
    setIcerigi: ["Vücut fırçası", "Bölgesel bakım serumu"],
    kisa: "Vücut fırçası ve bölgesel bakım serumu.",
    aciklama: `İki parçalık vücut bakım seti. Cildin daha sıkı ve pürüzsüz görünmesine yönelik bakım için hazırlanmıştır.

Kullanım: Kuru cilde fırça ile dairesel hareketlerle 5-10 dakika masaj yapın; kan dolaşımını hareketlendirir ve ölü deriden arındırır. Serumu temiz cilde sabah ve akşam dairesel hareketlerle uygulayın, emilene kadar bekleyin.

En iyi sonuç için sağlıklı beslenme, bol su tüketimi ve düzenli egzersizle destekleyin.${HARICI_NOT}`,
    infografik: `${H} 02.08.46 (4).jpeg`,
  },
  {
    slug: "bagisiklik-destek-seti",
    baslik: "Bağışıklık Destek Seti",
    orijinalAd: "Kanser ve Kemoterapi Sürecinde Destek Seti",
    kategoriSlug: "setler",
    fiyat: "1740.00",
    setIcerigi: ["Ökse otu", "Zerdeçal ekstraktı", "Lugol iyot", "Mumiyo tablet"],
    kisa: "Ökse otu, zerdeçal ekstraktı, lugol iyot ve mumiyo tablet.",
    aciklama: `Dört parçalık takviye seti. Zerdeçal (curcumin) ekstraktı, ökse otu, lugol iyot ve mumiyo tabletten oluşur.

Kullanım: Her ürünü kendi etiketindeki öneriye göre tüketin.${SET_NOT} Tedavi görmekte olan kişilerin kullanmadan önce mutlaka hekimine danışması gerekir.`,
    infografik: `${H} 02.08.46 (6).jpeg`,
  },
  {
    slug: "bebek-ve-cocuk-bakim-seti",
    baslik: "Bebek ve Çocuk Bakım Seti",
    kategoriSlug: "anne-bebek",
    fiyat: "1480.00",
    setIcerigi: ["Bebek şampuanı", "Bebek vücut yağı", "Pişik kremi", "Gaz giderici krem", "Diş masaj yağı"],
    kisa: "Bebek ve çocukların hassas cildi için beş parçalık bakım seti.",
    aciklama: `Beş parçalık harici bakım seti. Bebek şampuanı saçı nazikçe temizler; vücut yağı cildi nemlendirir ve masaj için kullanılır; pişik kremi bez bölgesinde uygulanır; gaz giderici krem karın bölgesine masajla sürülür; diş masaj yağı diş çıkarma döneminde diş etlerine uygulanır.

Hepsi yalnızca harici kullanım içindir. Paraben içermez.

Kullanmadan önce çocuk doktorunuza danışmanız önerilir.`,
    infografik: `${H} 02.08.46 (7).jpeg`,
  },
  {
    slug: "cocuk-gelisim-destek-seti",
    baslik: "Çocuk Gelişim Destek Seti",
    orijinalAd: "Erkek Bebek Destek Seti",
    kategoriSlug: "anne-bebek",
    fiyat: "1890.00",
    setIcerigi: ["Ginsengli macun", "Bitkisel ekstrakt", "Bakım serumu", "Bitkisel kür", "Bakım kremi", "Mumiyo tablet", "Lugol iyot"],
    kisa: "Macun, bitkisel ekstrakt, bakım ürünleri ve mumiyo tabletten oluşan set.",
    aciklama: `Yedi parçalık set. Bitkisel özler ve doğal bileşenlerle hazırlanmıştır.

Kullanım: Her ürünü kendi etiketindeki öneriye göre kullanın. Bakım serumu ve kremi harici kullanım içindir.

ÖNEMLİ: Bu set bebek ve küçük çocuklara yönelik bileşenler içerir. Kullanmadan önce mutlaka çocuk doktorunuza danışın. Takviye edici gıdalar normal beslenmenin yerine geçmez.`,
    infografik: `${H} 02.08.46 (2).jpeg`,
  },
  {
    slug: "anne-adayi-destek-seti",
    baslik: "Anne Adayı Destek Seti",
    orijinalAd: "Hamile Annelere Vitamin Seti",
    kategoriSlug: "anne-bebek",
    fiyat: "1960.00",
    setIcerigi: ["Çelik demir suyu", "Keten tohumu yağı", "İğde çekirdeği tozu", "Kan macunu", "Karadut özü", "Mumiyo tablet", "D vitamini", "Lugol iyot"],
    kisa: "Demir suyu, keten tohumu yağı, macunlar, D vitamini ve mumiyo tablet.",
    aciklama: `Sekiz parçalık takviye seti. Günlük beslenmeyi desteklemek için hazırlanmıştır.

Kullanım: Her ürünü kendi etiketindeki öneriye göre tüketin.

ÖNEMLİ: Hamilelik ve emzirme döneminde takviye kullanımı mutlaka hekim kontrolünde olmalıdır. Kullanmadan önce doktorunuza danışın. Takviye edici gıdalar normal beslenmenin yerine geçmez.`,
    infografik: `${H} 02.08.51.jpeg`,
  },
  {
    slug: "solunum-destek-seti",
    baslik: "Solunum Destek Seti",
    orijinalAd: "Akciğer Temizleme Destek Seti",
    kategoriSlug: "setler",
    fiyat: "1620.00",
    setIcerigi: ["Kombu detoks çay", "Kozalak şurubu", "Bitkisel macun", "Akgünlük sakızı", "Mumiyo tablet", "Lugol iyot", "Deva karışım"],
    kisa: "Detoks çay, kozalak şurubu, macun, akgünlük sakızı ve tabletler.",
    aciklama: `Yedi parçalık takviye seti. Bitkisel özlerle hazırlanmıştır.

Kullanım: Kombu detoks çayı sabah aç karnına 1 bardak; kozalak şurubunu günde 2 tatlı kaşığı; macunu sabah ve akşam 1 tatlı kaşığı; akgünlük sakızını sabah ve akşam 1 adet çiğneyerek tüketin.${SET_NOT}`,
    infografik: `${H} 02.08.47 (1).jpeg`,
  },
  {
    slug: "sindirim-destek-seti",
    baslik: "Sindirim Destek Seti",
    orijinalAd: "Mide Destek Seti",
    kategoriSlug: "setler",
    fiyat: "1480.00",
    setIcerigi: ["Kombu detoks çay", "Bitkisel macun", "Kudret narı ekstraktı", "Mumiyo tablet", "Gaz giderici krem", "Lugol iyot"],
    kisa: "Detoks çay, macun, kudret narı ekstraktı, tablet ve harici krem.",
    aciklama: `Altı parçalık set. Sindirim sisteminin düzenli çalışmasını desteklemeye yönelik bitkisel içeriklerden oluşur.

Kullanım: Kombu detoks çayı günde 1-2 fincan yemeklerden sonra; macunu sabah ve akşam yatmadan önce 1 tatlı kaşığı; kudret narı ekstraktını günde 1 tatlı kaşığı tüketin. Gaz giderici kremi karın bölgesine dairesel hareketlerle masaj yaparak uygulayın.${SET_NOT}`,
    infografik: `${H} 02.08.50.jpeg`,
  },
  {
    slug: "sindirim-konfor-destek-seti",
    baslik: "Sindirim Konfor Destek Seti",
    orijinalAd: "Hemoroid - Basur Destek Seti",
    kategoriSlug: "setler",
    fiyat: "1690.00",
    setIcerigi: ["Çelik demir suyu", "Bağırsak macunu", "Bağırsak çalıştırıcı çay", "Mumiyo tablet", "Lugol iyot", "Bakım kremi", "Bitkisel macun", "Bitkisel ekstrakt"],
    kisa: "Demir suyu, macunlar, bitki çayı, tablet ve harici bakım kremi.",
    aciklama: `Sekiz parçalık set. Bağırsakların düzenli çalışmasını desteklemeye yönelik bitkisel içerikler ve harici bakım ürünlerinden oluşur.

Kullanım: Çelik demir suyunu günde 1 yemek kaşığı; bağırsak macununu sabah ve akşam aç karnına 1 tatlı kaşığı; bağırsak çayını günde 1-2 fincan tüketin. Bakım kremini temiz bölgeye günde 2 kez dıştan uygulayın.

Düzenli kullanımla birlikte bol su tüketimi ve dengeli beslenme önerilir.${SET_NOT}`,
    infografik: `${H} 02.08.50 (1).jpeg`,
  },
  {
    slug: "bagirsak-temizlik-destek-seti",
    baslik: "Bağırsak Temizlik Destek Seti",
    orijinalAd: "Parazit Kovucu Destek Seti",
    kategoriSlug: "setler",
    fiyat: "1520.00",
    setIcerigi: ["Kombu detoks çay", "Bağırsak çalıştırıcı çay", "Bitkisel kür", "Lugol iyot", "Kabak çekirdeği yağı", "Magnezyum sülfat"],
    kisa: "İki bitki çayı, bitkisel kür, kabak çekirdeği yağı ve İngiliz tuzu.",
    aciklama: `Altı parçalık set. Sindirim sistemini desteklemeye yönelik bitkisel içeriklerden oluşur.

Kullanım: Kombu detoks çayı sabah aç karnına 1 su bardağı; bağırsak çalıştırıcı çayı akşam yatmadan önce 1 su bardağı; bitkisel kürü günde 1 tatlı kaşığı; kabak çekirdeği yağını günde 1 tatlı kaşığı aç karnına tüketin.

21 gün kullanım – 7 gün ara – 3 döngü olarak uygulanması önerilir. Bol su tüketin.${SET_NOT}`,
    infografik: `${H} 02.08.50 (6).jpeg`,
  },
  {
    slug: "eklem-ve-hareket-destek-seti",
    baslik: "Eklem ve Hareket Destek Seti",
    orijinalAd: "Eklem Destek Seti",
    kategoriSlug: "setler",
    fiyat: "1980.00",
    setIcerigi: ["Vegan glukozamin tablet", "Magnezyum kompleks", "Eklem macunu", "Atom macunu", "Kombu detoks çay", "İğde çekirdeği tozu", "Çelik suyu", "Mumiyo tablet", "Kuyruk yağlı krem", "Lugol iyot"],
    kisa: "Glukozamin ve magnezyum tabletleri, macunlar, çaylar ve harici krem.",
    aciklama: `On parçalık set. Eklem ve kas sağlığını desteklemeye yönelik vitamin, mineral ve bitkisel içeriklerden oluşur.

Kullanım: Eklem ve atom macununu sabah ve akşam aç karnına 1 tatlı kaşığı; glukozamin tabletini günde 2, magnezyum kompleksi günde 1 tablet; kombu detoks çayı günde 1 bardak aç karnına tüketin. Kuyruk yağlı kremi ağrılı bölgeye günde 2 kez uygulayın.${SET_NOT}`,
    infografik: `${H} 02.08.50 (2).jpeg`,
  },
  {
    slug: "kemik-ve-eklem-destek-seti",
    baslik: "Kemik ve Eklem Destek Seti",
    orijinalAd: "Kemik Erimesi Destek Seti",
    kategoriSlug: "setler",
    fiyat: "1760.00",
    setIcerigi: ["Keten tohumu yağı", "İğde çekirdeği tozu", "Kalsiyum magnezyum tablet", "Eklem macunu", "Lugol iyot", "Mumiyo tablet"],
    kisa: "Keten tohumu yağı, iğde tozu, kalsiyum magnezyum ve macun.",
    aciklama: `Altı parçalık takviye seti. Kalsiyum, magnezyum, çinko ve D vitamini içeren tablet ile bitkisel içeriklerden oluşur.

Kullanım: Eklem macununu sabah ve akşam aç karnına 1 tatlı kaşığı; kalsiyum magnezyum tabletini günde 1 tablet yemeklerden sonra; keten tohumu yağını günde 1 tatlı kaşığı; iğde çekirdeği tozunu günde 1 tatlı kaşığı su veya yoğurda ekleyerek tüketin.

En az 2-3 ay düzenli kullanım önerilir.${SET_NOT}`,
    infografik: `${H} 02.08.50 (4).jpeg`,
  },
  {
    slug: "kolajen-destek-seti",
    baslik: "Kolajen Destek Seti",
    orijinalAd: "Kolojen Destek Seti",
    kategoriSlug: "setler",
    fiyat: "1840.00",
    setIcerigi: ["Keten tohumu yağı", "İğde çekirdeği tozu", "Kolajen macunu", "Balık kolajeni", "Mumiyo tablet"],
    kisa: "Kolajen macunu, balık kolajeni, keten tohumu yağı ve iğde tozu.",
    aciklama: `Beş parçalık takviye seti. Cilt, saç, tırnak ve eklem sağlığını desteklemeye yönelik içeriklerden oluşur.

Kullanım: Kolajen macununu sabah aç karnına ve akşam yatmadan önce 1 tatlı kaşığı; balık kolajenini günde 1 ölçek (10 ml) tercihen aç karnına; keten tohumu yağını günde 1 tatlı kaşığı; iğde çekirdeği tozunu su veya içecekle tüketin.

En az 2-3 ay düzenli kullanım önerilir. Katkısız, GDO ve gluten içermez.${SET_NOT}`,
    infografik: `${H} 02.08.50 (3).jpeg`,
  },
  {
    slug: "denge-destek-seti",
    baslik: "Denge Destek Seti",
    orijinalAd: "Şeker Destek Seti",
    kategoriSlug: "setler",
    fiyat: "1650.00",
    setIcerigi: ["Zeytin yaprağı ekstraktı", "Kedi otlu stres çayı", "Detoks çay (sirke)", "Lugol iyot", "Mumiyo tablet"],
    kisa: "Zeytin yaprağı ekstraktı, bitki çayları, lugol iyot ve mumiyo tablet.",
    aciklama: `Beş parçalık takviye seti. Zeytin yaprağı (oleuropein) ekstraktı ve bitki çaylarından oluşur.

Kullanım: Zeytin yaprağı ekstraktını günde 1 ölçek (10 ml) suya karıştırarak; kedi otlu çayı akşam yatmadan önce 1 fincan; detoks çayı günde 1 tatlı kaşığı suya karıştırarak tüketin.

En az 2-3 ay düzenli kullanım önerilir. Dengeli beslenme ve düzenli yaşamla destekleyin.${SET_NOT} Kan şekeri ilacı kullananların mutlaka hekimine danışması gerekir.`,
    infografik: `${H} 02.08.50 (9).jpeg`,
  },
  {
    slug: "nefes-ve-arinma-destek-seti",
    baslik: "Nefes ve Arınma Destek Seti",
    orijinalAd: "Sigara Bırakma Destek Seti",
    kategoriSlug: "setler",
    fiyat: "1580.00",
    setIcerigi: ["Stres çayı", "Bitkisel serum", "Algı açıcı yağ", "Karabaş otu", "Lugol iyot", "Mumiyo tablet"],
    kisa: "Stres çayı, bitkisel serum, karabaş otu ve tabletler.",
    aciklama: `Altı parçalık set. Bitkisel içeriklerle hazırlanmıştır.

Kullanım: Stres çayını günde 1-2 fincan yemeklerden sonra; karabaş otunu günde 1 tatlı kaşığı (250 ml su ile) demleyerek tüketin. Algı açıcı yağı şakak ve ense bölgesine masaj yaparak harici uygulayın.

En az 4-6 hafta düzenli kullanım önerilir.${SET_NOT}`,
    infografik: `${H} 02.08.50 (8).jpeg`,
  },
  {
    slug: "hassas-cilt-bakim-seti",
    baslik: "Hassas Cilt Bakım Seti",
    orijinalAd: "Egzama Mantar Sedef Seti",
    kategoriSlug: "setler",
    fiyat: "1440.00",
    setIcerigi: ["Kombu detoks çay", "Bitkisel macun", "Bakım serumu", "Bakım kremi", "Katran sabunu", "Mumiyo tablet", "Lugol iyot"],
    kisa: "Detoks çay, macun, bakım serumu ve kremi, katran sabunu.",
    aciklama: `Yedi parçalık set. Hassas ciltlerin günlük bakımı için harici ürünler ile bitkisel takviyelerden oluşur.

Kullanım: Bakım serumunu ve kremini temiz cilde ince tabaka hâlinde uygulayın. Katran sabunuyla bölgeyi nazikçe yıkayın. Kombu detoks çayı ve macunu etiketindeki öneriye göre tüketin.${HARICI_NOT}${SET_NOT}`,
    // DÜZELTME: 16.47.01 (2) sanıldığı gibi Egzama seti değil, EKLEM SETİ.
    // Tek tek doğrulanınca yakalandı; kendi görseline geri alındı.
    infografik: `${H} 02.08.50 (10).jpeg`,
  },
  {
    slug: "cilt-renk-dengesi-destek-seti",
    baslik: "Cilt Renk Dengesi Destek Seti",
    orijinalAd: "Vitiligo Destek Seti",
    kategoriSlug: "setler",
    fiyat: "1720.00",
    setIcerigi: ["Bitkisel macun", "Ginkgo biloba ekstraktı", "Çelik demir suyu", "Bakım merhemi", "Güneş kremi", "Mumiyo tablet", "Karma sabun", "Lugol iyot"],
    kisa: "Bitkisel macun, ginkgo biloba, bakım merhemi, güneş kremi ve sabun.",
    aciklama: `Sekiz parçalık set. Harici bakım ürünleri ile bitkisel takviyelerden oluşur.

Kullanım: Bakım merhemini temiz ve kuru cilde sabah ve akşam ince tabaka hâlinde sürün. Güneş kremini güneşe çıkmadan 30 dakika önce uygulayın, gün içinde yenileyin. Macunu ve ginkgo biloba ekstraktını etiketindeki öneriye göre tüketin.

En az 3 ay düzenli kullanım önerilir.${SET_NOT}`,
    infografik: `${H} 02.08.49 (11).jpeg`,
  },
  {
    slug: "agiz-ve-dis-bakim-seti",
    baslik: "Ağız ve Diş Bakım Seti",
    kategoriSlug: "agiz-dis",
    fiyat: "1180.00",
    setIcerigi: ["Ağız gargarası", "Diş masaj yağı", "Sidr içerikli diş macunu", "Bambu diş fırçası", "Kalsiyum magnezyum tablet"],
    kisa: "Gargara, diş masaj yağı, diş macunu, bambu fırça ve tablet.",
    aciklama: `Beş parçalık ağız bakım seti. Doğal içerikli gargara, propolisli ve sidr içerikli diş macunu, diş eti masaj yağı, bambu diş fırçası ve kalsiyum magnezyum tabletten oluşur.

Kullanım: Günde 2 kez dişlerinizi fırçalayın, gargarayı kullanın, diş etlerinize masaj yağı uygulayın ve tabletinizi tüketmeyi ihmal etmeyin.

Kimyasal içermez. Vegan. Çevre dostu.`,
    infografik: `${H} 02.08.50 (7).jpeg`,
  },
  {
    slug: "cocuk-ve-genc-gelisim-destek-seti",
    beklet: true,
    baslik: "Çocuk ve Genç Gelişim Destek Seti",
    orijinalAd: "Boy Uzatıcı Set",
    kategoriSlug: "setler",
    fiyat: "1380.00",
    setIcerigi: ["Bitkisel macun", "13 vitamin karışımı (D vitamini)", "İğde çekirdeği tozu (yarım kg)"],
    kisa: "Bitkisel macun, 13 vitamin karışımı ve iğde çekirdeği tozu.",
    aciklama: `Üç parçalık takviye seti. Bitkisel macun, D vitamini içeren 13 vitamin karışımı ve yarım kilogram iğde çekirdeği tozundan oluşur.

Kullanım: Macunu ve vitamin karışımını etiketindeki öneriye göre tüketin. İğde çekirdeği tozunu süt, su veya yoğurda karıştırarak kullanabilirsiniz.

ÇOCUKLARDA KULLANIM: Çocuk ve gençlerde takviye kullanımı hekim kontrolünde olmalıdır. Kullanmadan önce doktorunuza danışın.${SET_NOT}`,
    infografik: `${H} 02.08.51 (1).jpeg`,
  },
  {
    slug: "gul-roza-bakim-seti",
    baslik: "Gül Roza Bakım Seti",
    kategoriSlug: "setler",
    fiyat: "1620.00",
    setIcerigi: ["Gül roza kremi", "Güneş kremi", "Gül suyu", "Kuyruk yağlı cilt kremi", "Yüz temizleme toniği", "Kuyruk yağlı cilt sabunu"],
    kisa: "Gül özlü altı parçalık yüz ve vücut bakım seti.",
    aciklama: `Altı parçalık cilt bakım seti. Gül yağı, gül suyu ve doğal bitki özleriyle hazırlanmıştır.

Kullanım: Yüz temizleme toniğini sabah ve akşam pamuk yardımıyla uygulayın. Gül suyunu gün içinde yüzünüze sıkabilirsiniz. Gül roza kremini temiz cilde sabah ve akşam nazikçe sürün. Güneş kremini güneşe çıkmadan önce uygulayın. Kuyruk yağlı kremi ihtiyaç duyulan bölgelere masaj yaparak sürün. Sabunu günlük temizlikte kullanın.${HARICI_NOT}`,
    infografik: `${H} 02.08.51 (3).jpeg`,
  },
  {
    slug: "sidr-icerikli-bakim-seti",
    baslik: "Sidr İçerikli Bakım Seti",
    kategoriSlug: "setler",
    fiyat: "1890.00",
    setIcerigi: ["Sidr içerikli diş macunu", "Sidr kremi", "Sidrli şampuan", "Sidr sabunu", "Sidr yağı", "Sidr yaprağı", "Sidr oda kokusu", "Sidr içerikli roll-on"],
    kisa: "Sidr yaprağı özlü sekiz parçalık bakım seti.",
    aciklama: `Sekiz parçalık bakım seti. Sidr (Arabistan hünnabı) yaprağı özü ile hazırlanan diş macunu, krem, şampuan, sabun, yağ, kurutulmuş yaprak, oda kokusu ve roll-on deodorantından oluşur.

Kullanım: Her ürün kendi kullanım alanına göre uygulanır. Sidr yaprağı demlenerek veya saç/vücut bakımında kullanılabilir.${HARICI_NOT}`,
    infografik: `${H} 02.08.51 (4).jpeg`,
  },
];
