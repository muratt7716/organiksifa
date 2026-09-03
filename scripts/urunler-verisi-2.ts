/**
 * İkinci parti ürünler — `urunler-ham/` klasörüne 3 Eylül'de eklenen
 * 75 görselden çıkarıldı.
 *
 * Adlandırma ilkesi ve dip notlar için bkz. urunler-verisi.ts.
 *
 * LİSTELENMEYEN: "Sara-Epilepsi Seti" (16.47.05 (8)/(9)). Epilepsi, ilacın
 * kesilmesi hâlinde ölümle sonuçlanabilen bir hastalık; bitkisel bir setin
 * epilepsi için satıldığını gören biri tedavisini aksatabilir. Ablamla
 * konuşulmadan siteye konmayacak.
 */
import type { UrunTanimi } from "./urunler-verisi";

const H = "WhatsApp Image 2026-09-03 at";

const SET_NOT =
  "\n\nTakviye edici gıdalar normal beslenmenin yerine geçmez. Hamilelik ve " +
  "emzirme döneminde, kronik rahatsızlığı olanlarda ve düzenli ilaç " +
  "kullananlarda, kullanmadan önce doktora danışılmalıdır. Çocukların " +
  "ulaşamayacağı yerde saklayın.";

const HARICI_NOT =
  "\n\nYalnızca harici kullanım içindir. İlk kullanımdan önce küçük bir alanda " +
  "deneyin. Gözle temasından kaçının.";

export const URUNLER_2: UrunTanimi[] = [
  /* ==================== TAKVİYE — TEKİL ==================== */
  {
    slug: "igde-cekirdegi-tozu",
    baslik: "İğde Çekirdeği Tozu",
    kategoriSlug: "takviye-urunler",
    fiyat: "340.00",
    kisa: "İğde meyvesinin çekirdeğinden öğütülen %100 doğal toz. Vegan.",
    aciklama: `İğde meyvesinin çekirdeğinden özenle öğütülerek elde edilen doğal toz. Bitkisel lif kaynağıdır.

Kullanım: Günde 1-2 tatlı kaşığı (yaklaşık 5-10 g), bir bardak ılık su, yoğurt, smoothie veya bitkisel içecek ile karıştırarak tüketilebilir.

Katkısız ve koruyucusuz. Vegan. Serin ve kuru yerde, ağzı kapalı saklayın.${SET_NOT}`,
    infografik: `${H} 16.46.59.jpeg`,
    showroom: "21-igde-cekirdegi-tozu.jpg",
  },
  {
    slug: "akdiken-tenturu-500ml",
    baslik: "Akdiken Tentürü 500 ml",
    kategoriSlug: "takviye-urunler",
    fiyat: "620.00",
    kisa: "Safranlı akdiken (deve dikeni) özlü konsantre içecek. 500 ml.",
    aciklama: `Akdiken (deve dikeni) bitkisinin özüyle hazırlanan, safran içeren konsantre içecek.

Kullanım: Bir bardak suya karıştırılarak tüketilmesi önerilir. Mide pH dengesini korumak ve emilimi artırmak için suyla alınır.

Hacim: 500 ml. Serin ve ışık almayan yerde saklayın.${SET_NOT}`,
    infografik: `${H} 16.46.59 (1).jpeg`,
  },
  {
    slug: "hayit-tenturu-500ml",
    baslik: "Hayıt Tentürü 500 ml",
    kategoriSlug: "takviye-urunler",
    fiyat: "580.00",
    kisa: "Bal sirkeli, doğal fermantasyonla üretilen hayıt tentürü. 500 ml.",
    aciklama: `Hayıt (Vitex agnus-castus) tohumundan doğal fermantasyon yöntemiyle üretilen tentür. Bal sirkesi ile hazırlanır.

Kullanım: Günde 1-2 kez, 1 tatlı kaşığı (5 ml) bir miktar su ile alınması önerilir.

Hacim: 500 ml. Koruyucu ve katkı maddesi içermez.${SET_NOT}`,
    infografik: `${H} 16.46.59 (2).jpeg`,
  },
  {
    slug: "hayit-macunu-250g",
    baslik: "Hayıt Macunu 250 g",
    orijinalAd: "Menopoz — Hayıt Macunu",
    kategoriSlug: "takviye-urunler",
    fiyat: "540.00",
    kisa: "Hayıt, meyan ve hünnap içeren bitkisel karışım macun. 250 g.",
    aciklama: `İçindekiler: Hayıt, meyan kökü, hünnap ve doğal destek karışımı.

Kullanım: Günde 1-2 tatlı kaşığı tüketilebilir.

Ağırlık: 250 g. Bitkisel içeriklidir, güvenli kullanım için etiketindeki öneriye uyun.${SET_NOT}`,
    infografik: `${H} 16.46.59 (3).jpeg`,
  },
  {
    slug: "glucosamine-kondroitin-boswellia-macun",
    baslik: "Glukozamin, Kondroitin & Boswellia Macun 200 ml",
    kategoriSlug: "takviye-urunler",
    fiyat: "890.00",
    kisa: "Glukozamin, kondroitin, boswellia, propolis ve bitkisel yağlar. 200 ml.",
    aciklama: `İçindekiler: Glukozamin, kondroitin, boswellia serrata, propolis ve bal peteği, tip I ve tip II kolajen, kuyruk yağı (%40 bal mumu), hindistan cevizi yağı, susam yağı, defne yaprağı yağı, misk adaçayı yağı.

Eklem ve kıkırdak yapısının korunmasına destek olmak üzere hazırlanmıştır.

Hacim: 200 ml. Katkı maddesi içermez, GMP standartlarında üretilmiştir.${SET_NOT}`,
    infografik: `${H} 16.47.00.jpeg`,
    showroom: "22-glucosamine-macun.jpg",
  },
  {
    slug: "celik-suyu-demir-suyu",
    baslik: "Çelik Suyu (Demir Suyu)",
    kategoriSlug: "takviye-urunler",
    fiyat: "420.00",
    kisa: "Geleneksel yöntemle hazırlanan demir kaynaklı içecek.",
    aciklama: `Geleneksel yöntemle hazırlanan, doğal mineral ve demir içeren içecek.

Kullanım: Kullanmadan önce çalkalayın. Günde 1 tatlı kaşığı aç karnına tüketilmesi önerilir.

Cam şişe. Serin ve kuru yerde saklayın, açtıktan sonra buzdolabında tutun.${SET_NOT}`,
    infografik: `${H} 16.47.01 (10).jpeg`,
  },
  {
    slug: "igde-cekirdegi-macunu",
    baslik: "İğde Çekirdeği Macunu",
    kategoriSlug: "takviye-urunler",
    fiyat: "460.00",
    kisa: "İğde çekirdeği tozundan hazırlanan bitkisel macun.",
    aciklama: `İğde çekirdeği tozundan hazırlanan bitkisel karışım macun. Cam kavanoz.

Kullanım: Günde 1-2 tatlı kaşığı tüketilebilir. Süt veya suyla alınabilir.

Serin ve kuru yerde saklayın.${SET_NOT}`,
    infografik: `${H} 16.47.03 (2).jpeg`,
    showroom: "28-igde-cekirdegi-macunu.jpg",
  },
  {
    slug: "hemcare-x3-250ml",
    baslik: "At Kestanesi Ekstraktı 250 ml",
    orijinalAd: "Hemcare-X3",
    kategoriSlug: "takviye-urunler",
    fiyat: "980.00",
    kisa: "At kestanesi, gotu kola, rutin ve MSM içeren standardize ekstrakt.",
    aciklama: `İçindekiler: At kestanesi ekstresi (Aesculus hippocastanum), damar otu, gotu kola, ruscus, rutin, zufa otu, MSM, hesperidin, piperin.

Standardize bitkisel ekstrakt. Damar sağlığını desteklemeye yönelik hazırlanmıştır.

Kullanım: Günde 2 defa 5 ml. En az 4 hafta düzenli kullanım önerilir.

Hacim: 250 ml. GMP standartlarında üretilmiştir.${SET_NOT}`,
    infografik: `${H} 16.47.05.jpeg`,
  },
  {
    slug: "altin-yag-karisimi-50ml",
    /**
     * MÜKERRER — siteye konmuyor.
     * Bu ürün katalogda `d-vitamini-altin-yag-karisimi` olarak zaten var ve
     * o kaydın üç adet showroom görseli bulunuyor. İkisi aynı ürün.
     */
    beklet: true,
    baslik: "Altın Yağ Karışımı 50 ml",
    kategoriSlug: "takviye-urunler",
    fiyat: "740.00",
    kisa: "On üç bitkisel yağın karışımı. Omega 3-6-9, B, C, D, E vitaminleri.",
    aciklama: `İçindekiler: İncir çekirdeği yağı, keten tohumu yağı, çörek otu yağı, zeytinyağı, üzüm çekirdeği yağı, avokado yağı, ceviz yağı, fındık yağı, fıstık yağı, susam yağı, buğday yağı, kenevir tohumu yağı, udihindi yağı, aspir yağı.

İçerdiği vitamin ve mineraller: Omega 3-6-9, B6-B12 kompleks, C, D ve E vitamini, folik asit, magnezyum, potasyum, fosfor, çinko, selenyum.

Kullanım: Yetişkinler günde 1 çay kaşığı, çocuklar günde yarım çay kaşığı.

Hacim: 50 ml. Serin ve kuru yerde muhafaza edin.${SET_NOT}`,
    infografik: `${H} 16.47.04 (7).jpeg`,
  },
  {
    slug: "mumiyo-tablet-30",
    baslik: "Mumiyo Tablet — 30 Tablet, 100 mg",
    kategoriSlug: "takviye-urunler",
    fiyat: "690.00",
    kisa: "Himalaya kaynaklı mumiyo (shilajit) tableti. 30 tablet, 100 mg.",
    aciklama: `Himalaya bölgesinden elde edilen mumiyo (shilajit) özünden hazırlanan tablet.

Kullanım: Günde 1 tablet, bol su ile alınır.

Ambalaj: 30 tablet x 100 mg.${SET_NOT}`,
    infografik: `${H} 16.47.04 (8).jpeg`,
  },
  {
    slug: "sari-halile",
    baslik: "Sarı Halile",
    kategoriSlug: "takviye-urunler",
    fiyat: "310.00",
    kisa: "Kurutulmuş sarı halile meyvesi. Geleneksel bitkisel içerik.",
    aciklama: `Kurutulmuş sarı halile (Terminalia chebula) meyvesi. Geleneksel kullanımda tercih edilen bitkisel bir içeriktir.

Kullanım: Demlenerek veya öğütülerek tüketilebilir. Etiketindeki öneriye uyun.

Serin ve kuru yerde, ağzı kapalı saklayın.${SET_NOT}`,
    infografik: `${H} 16.47.04 (10).jpeg`,
    showroom: "27-sari-halile.jpg",
  },
  {
    slug: "iskin-koku-sirkesi",
    baslik: "Işkın Kökü Sirkesi — Ev Yapımı",
    kategoriSlug: "takviye-urunler",
    fiyat: "380.00",
    kisa: "Sadece ışkın kökü ve su. Ev yapımı, katkısız sirke.",
    aciklama: `Işkın (ravent) kökünden ev yapımı yöntemle üretilen sirke. İçeriğinde yalnızca ışkın kökü ve su bulunur; katkı maddesi içermez.

Kullanım: Sabah ve akşam, tok karnına, bir yemek kaşığı yarım su bardağı suyun içerisine karıştırılarak içilir.

Serin ve kuru yerde saklayın.${SET_NOT}`,
    infografik: `${H} 16.47.05 (5).jpeg`,
    showroom: "24-iskin-koku-sirkesi.jpg",
  },
  {
    slug: "hayit-tohumlu-macun-300g",
    baslik: "Hayıt Tohumlu Bitkisel Karışım Macun 300 g",
    orijinalAd: "Hamilelik Yolunda Doğal Destek",
    kategoriSlug: "takviye-urunler",
    fiyat: "620.00",
    kisa: "Hayıt tohumlu bitkisel karışım macun. 300 g.",
    aciklama: `Hayıt (Vitex agnus-castus) tohumu ve bitkisel karışım ile hazırlanan macun.

Kullanım: Günde 1-2 tatlı kaşığı tüketilebilir.

Ağırlık: 300 g.${SET_NOT} Gebelik planlayan veya gebe olan kişilerin kullanmadan önce mutlaka hekimine danışması gerekir.`,
    infografik: `${H} 16.47.05 (7).jpeg`,
  },

  /* ==================== CİLT & VÜCUT — TEKİL ==================== */
  {
    slug: "ismid-surmesi",
    baslik: "İsmid Sürmesi",
    kategoriSlug: "cilt-bakimi",
    fiyat: "290.00",
    kisa: "Geleneksel yöntemle hazırlanmış sürme. Pirinç şişe.",
    aciklama: `Geleneksel yöntemlerle hazırlanmış doğal içerikli sürme. Pirinç şişe ve sürme çubuğu ile birlikte.

Kullanım: Gece yatmadan önce, temiz sürme çubuğu ile uygulanması önerilir.

Sürme çubuğunu başkasıyla paylaşmayın. Göz tahrişi olursa kullanımı bırakın.`,
    infografik: `${H} 16.47.00 (1).jpeg`,
  },
  {
    slug: "hint-yagi",
    beklet: true,
    baslik: "Hint Yağı",
    kategoriSlug: "bitkisel-yaglar",
    fiyat: "260.00",
    kisa: "Damlalıklı amber şişede saf hint yağı. Cilt, saç ve kirpik bakımı.",
    aciklama: `Saf hint yağı (kastor yağı). Damlalıklı amber cam şişe.

Kullanım alanları: Cilt bakımı (derinlemesine nemlendirir), saç ve kirpik bakımı (kıl köklerini besler), masaj.

Kullanım: Temiz cilde veya saç derisine birkaç damla uygulayıp masaj yapın. Kirpik ve kaşta ince bir fırça ile uygulanabilir.${HARICI_NOT}`,
    infografik: `${H} 16.47.01.jpeg`,
  },
  {
    slug: "yag-bezesi-serumu",
    baslik: "Doğal Yağ Bezesi Serumu",
    kategoriSlug: "cilt-bakimi",
    fiyat: "480.00",
    kisa: "Gözenekleri tıkamadan fazla yağı dengeleyen bakım serumu.",
    aciklama: `Cildin kendine has yağ dengesine zarar vermeden, gözenekleri tıkamadan fazla yağı ve tıkanmış gözenekleri temizlemeye yardımcı bakım serumu.

Kullanım: Temiz cilde birkaç damla uygulayıp nazikçe yedirin. Sabah ve akşam kullanılabilir.

Paraben içermez. %100 doğal içerikli.${HARICI_NOT}`,
    infografik: `${H} 16.47.01 (5).jpeg`,
  },
  {
    slug: "kantoron-kremi",
    baslik: "Kantaron Kremi",
    orijinalAd: "Kantoron Kremi",
    kategoriSlug: "cilt-bakimi",
    fiyat: "430.00",
    kisa: "Sarı kantaron (St. John's Wort) yağı ile hazırlanan bakım kremi.",
    aciklama: `Sarı kantaron (Hypericum perforatum) yağı ile hazırlanan doğal bakım kremi.

Kullanım alanları: Kuru ve hassas cilt bölgeleri, tahriş ve kızarıklık görülen yerler, kas ve eklem masajı.

Kullanım: Temiz cilde ince bir tabaka hâlinde masaj yaparak uygulayın.

%100 doğal içerikli.${HARICI_NOT} Sarı kantaron cildi güneşe duyarlı hâle getirebilir; uygulama sonrası doğrudan güneşe çıkmayın.`,
    infografik: `${H} 16.47.01 (8).jpeg`,
    showroom: "23-kantoron-kremi.jpg",
  },
  {
    slug: "dudak-dolgunlastirici-balsam",
    baslik: "Dudak Bakım Balsamı",
    orijinalAd: "Dudak Dolgunlaştırıcı Balsam",
    kategoriSlug: "cilt-bakimi",
    fiyat: "180.00",
    kisa: "Dudak kuruluğu ve çatlaklarına karşı renk veren bakım balsamı.",
    aciklama: `Dudakların bakımı için hazırlanmış balsam. Kuruluk ve çatlaklara karşı nemlendirir, dudaklara doğal bir renk ve parlaklık verir.

Kullanım: Temiz dudaklara gün içinde ihtiyaç duydukça sürün.

Stick formunda.${HARICI_NOT}`,
    infografik: `${H} 16.47.02 (1).jpeg`,
  },
  {
    slug: "at-kili-vucut-fircasi",
    baslik: "At Kılı Vücut Fırçası",
    kategoriSlug: "cilt-bakimi",
    fiyat: "220.00",
    kisa: "%100 doğal at kılı, ahşap saplı kuru fırçalama fırçası.",
    aciklama: `Hiçbir sentetik kıl içermeyen, %100 doğal at kılından üretilmiş vücut fırçası. Ahşap saplı.

Kullanım: Duştan önce kuru cilde, ayaklardan kalbe doğru dairesel hareketlerle 1-5 dakika fırçalayın. Ölü deriden arındırır, cildi hazırlar.

Hassas ciltler için de uygundur. Kullanım sonrası kurumaya bırakın.`,
    infografik: `${H} 16.47.02 (2).jpeg`,
  },
  {
    slug: "ardic-yagli-masaj-kremi",
    baslik: "Ardıç Yağlı Masaj Kremi 210 ml",
    kategoriSlug: "cilt-bakimi",
    fiyat: "390.00",
    kisa: "Ardıç yağı içeren masaj kremi. Bel, boyun, eklem bölgeleri için.",
    aciklama: `Ardıç yağı ve bitkisel yağlarla hazırlanan masaj kremi.

Kullanım: Günde 2-3 defa istenen bölgeye masaj yaparak uygulayın. Uygulamadan sonra bölgeyi sıcak tutmak için streç film veya sıcak havlu ile sarılması önerilir.

Hacim: 210 ml.${HARICI_NOT}`,
    infografik: `${H} 16.47.02 (3).jpeg`,
  },
  {
    slug: "ahri-kahra-kremi",
    baslik: "Ahri Kahra Kremi",
    kategoriSlug: "cilt-bakimi",
    fiyat: "460.00",
    kisa: "Gün boyu nem ve pürüzsüz görünüm için bakım kremi.",
    aciklama: `Cildi gün boyu nemli tutan, besleyen ve canlılık kazandıran bakım kremi. Cilt tonunu dengelemeye ve ince çizgilerin görünümünü azaltmaya yardımcı olur.

Kullanım alanları: Yüz, göz çevresi, boyun.

Kullanım: Temiz cilde sabah ve akşam nazikçe uygulayın.${HARICI_NOT}`,
    infografik: `${H} 16.47.02 (9).jpeg`,
    showroom: "29-ahri-kahra-kremi.jpg",
  },
  {
    slug: "algi-acici-zihin-yagi",
    beklet: true,
    baslik: "Zihin Yağı — Roll-on",
    orijinalAd: "Algı Açıcı Zihin Yağı",
    kategoriSlug: "cilt-bakimi",
    fiyat: "280.00",
    kisa: "Şakak ve ense bölgesine roll-on ile uygulanan bitkisel yağ karışımı.",
    aciklama: `Bitkisel yağ karışımı, roll-on uygulayıcılı amber cam şişe.

Kullanım: Şakak, alın, kulak arkası, ense ve bilek bölgelerine roll-on ile sürüp nazikçe masaj yapın. Gün içinde ihtiyaç duydukça tekrarlanabilir.${HARICI_NOT} Göz çevresine uygulamayın.`,
    infografik: `${H} 16.47.03 (3).jpeg`,
  },
  {
    slug: "sidr-oksuruk-merhemi",
    baslik: "Sidr İçerikli Göğüs Merhemi",
    orijinalAd: "Sidr İçerikli Öksürük Kremi",
    kategoriSlug: "cilt-bakimi",
    fiyat: "350.00",
    kisa: "Soğuk sıkım ve distile yağlarla hazırlanmış göğüs merhemi.",
    aciklama: `Doğal soğuk sıkım ve distile yağlarla hazırlanmış, sidr içerikli merhem. Yumuşak dokulu bir kış merhemidir.

Kullanım: Göğüs, sırt ve ayak tabanına ince bir tabaka hâlinde masaj yaparak uygulanır.${HARICI_NOT} Bebeklerde ve küçük çocuklarda kullanmadan önce doktorunuza danışın.`,
    infografik: `${H} 16.47.03 (8).jpeg`,
    showroom: "26-sidr-gogus-merhemi.jpg",
  },
  {
    slug: "tuy-bitirici-rolon",
    baslik: "Tüy Bakım Roll-on",
    orijinalAd: "Tüy Bitirici Rolon",
    kategoriSlug: "cilt-bakimi",
    fiyat: "320.00",
    kisa: "Bitkisel özlerle hazırlanmış roll-on tüy bakım ürünü.",
    aciklama: `Bitkisel yağlar ve özlerle zenginleştirilmiş roll-on. Cildi tahriş etmeden bakım yapar, nem dengesini korur ve yumuşaklık kazandırır.

Kullanım: Temiz ve kuru cilde roll-on ile uygulayın. Düzenli kullanım önerilir.

%100 doğal içerik. Kimyasal ve paraben içermez. Hayvanlar üzerinde test edilmemiştir.${HARICI_NOT}`,
    infografik: `${H} 16.47.05 (8).jpeg`,
  },
  {
    slug: "dide-i-nur-damla-20ml",
    baslik: "Safran & Propolis Damla 20 ml",
    orijinalAd: "Dide-i Nur",
    kategoriSlug: "takviye-urunler",
    fiyat: "780.00",
    kisa: "Safran, ham propolis, gül ve yaban mersini özlü suda çözünebilir damla.",
    aciklama: `İçindekiler: Safran, ham propolis, gül ekstresi, saf gül yağı, yaban mersini ekstresi.

Suda çözünebilir damla. Tarım ve Orman Bakanlığı onaylı, patentli formül.

Kullanım: Günde 2-4 damla önerilir. Etiketindeki kullanım talimatına uyun.

Hacim: 20 ml. Buzdolabında saklanmalıdır.${SET_NOT}`,
    // DÜZELTME: 16.47.01 (4) Propolisli Göz/Kulak Damlası'ydı. Dide-i Nur
    // kutulu görseli 16.47.03 (10)'da.
    infografik: `${H} 16.47.03 (10).jpeg`,
  },
  {
    slug: "goz-cevresi-temizleme-solusyonu",
    baslik: "Göz Çevresi Temizleme Solüsyonu 30 ml",
    kategoriSlug: "cilt-bakimi",
    fiyat: "420.00",
    kisa: "Propolis, saban, pantenol ve yaban mersini içeren temizleme solüsyonu.",
    aciklama: `İçindekiler: Propolis, saban, pantenol, yaban mersini.

Göz kapağı ve çevresindeki kir, yağ ve kalıntıları arındırmak için hazırlanmış temizleme solüsyonu.

Kullanım: Göz kapağını ve çevresini nazikçe temizleyin.

Hacim: 30 ml.${HARICI_NOT} Göz içine damlatmayın.`,
    infografik: `${H} 16.47.04 (5).jpeg`,
  },

  /* ==================== AĞIZ & DİŞ ==================== */
  {
    slug: "sidr-kil-dis-macunu",
    beklet: true,
    baslik: "Sidr İçerikli Kil Diş Macunu",
    kategoriSlug: "agiz-dis",
    fiyat: "260.00",
    kisa: "İyot takviyeli, sidr içerikli kil diş macunu.",
    aciklama: `Sidr (Arabistan hünnabı) içerikli, iyot takviyeli kil diş macunu.

Kullanım: Günde 2 kez, yumuşak diş fırçası ile dişleri fırçalayın. Bambu diş fırçası ile birlikte kullanılabilir.

Kimyasal içermez. Vegan.`,
    infografik: `${H} 16.47.03.jpeg`,
  },

  /* ==================== SABUN & TEMİZLİK ==================== */
  {
    slug: "sidr-sabunu",
    baslik: "Sidr Sabunu",
    kategoriSlug: "sabun-temizlik",
    fiyat: "170.00",
    kisa: "Sidr yaprağı içerikli, el yapımı doğal katı sabun.",
    aciklama: `Sidr (Arabistan hünnabı) yaprağı ile hazırlanan el yapımı doğal sabun.

Kullanım alanları: Yüz, vücut ve saç temizliği.

Kullanım: Islak cilde nazikçe masaj yaparak uygulayın, bol su ile durulayın.

Kimyasal içermez. Hayvanlar üzerinde test edilmemiştir.${HARICI_NOT}`,
    infografik: `${H} 16.47.03 (1).jpeg`,
    showroom: "25-sidr-sabunu.jpg",
  },

  /* ==================== EV & KOKU ==================== */
  {
    slug: "misk-amber-sidr-mum",
    baslik: "Misk Amber Kokulu Sidr Mum",
    kategoriSlug: "ev-koku",
    fiyat: "240.00",
    kisa: "Amber cam kavanozda, misk amber kokulu doğal sidr mumu.",
    aciklama: `Sidr ağacı esansiyel yağları ile hazırlanan, misk amber kokulu doğal mum. Amber cam kavanoz.

Kullanım: Kısa süreli yakılmalı, ortam havalandırılmalı ve mum güvenli bir zeminde yakılmalıdır. Yanan mumu gözetimsiz bırakmayın, çocuklardan ve evcil hayvanlardan uzak tutun.

Kimyasal madde içermez.`,
    // DÜZELTME: 16.47.04 (1) Saç Onarım Seti'ymiş. Sidr Mumu 16.47.03 (11)'de.
    infografik: `${H} 16.47.03 (11).jpeg`,
  },

  /* ==================== SETLER ==================== */
  {
    slug: "ayak-bakim-seti-8-parca",
    baslik: "Ayak Bakım Seti — 8 Parça",
    kategoriSlug: "setler",
    fiyat: "1480.00",
    setIcerigi: [
      "Koku önleyici sprey",
      "Bakım serumu",
      "Topuk çatlak kremi",
      "Magnezyum sülfat (İngiliz tuzu)",
      "Lugol iyot",
      "İpek kese",
      "Topuk taşı",
      "Katran sabun",
    ],
    kisa: "Sekiz parçalık kapsamlı ayak bakım seti.",
    aciklama: `Sekiz parçalık ayak bakım seti. Temizlik, peeling ve nemlendirme adımlarının tamamını kapsar.

Kullanım: Magnezyum sülfatı ılık suya ekleyip ayak banyosu yapın. Topuk taşı ve ipek kese ile nazikçe ovun. Katran sabunla yıkayın. Serum ve kremi temiz, kuru cilde uygulayın. Koku önleyici spreyi gün içinde kullanın.${HARICI_NOT}`,
    infografik: `${H} 16.47.00 (3).jpeg`,
  },
  {
    slug: "bagirsak-temizleme-destek-seti",
    baslik: "Bağırsak Temizleme Destek Seti",
    kategoriSlug: "setler",
    fiyat: "1590.00",
    setIcerigi: [
      "Kombu detoks çay",
      "Bağırsak macunu",
      "Bağırsak çalıştırıcı çay",
      "Mumiyo tablet",
      "Lugol iyot",
      "Gaz giderici krem",
    ],
    kisa: "Detoks çay, macun, bitki çayı, tablet ve harici gaz kremi.",
    aciklama: `Altı parçalık set. Bağırsakların düzenli çalışmasını desteklemeye yönelik bitkisel içeriklerden oluşur.

Kullanım: Kombu detoksu sabah aç karnına yarım su bardağı; bağırsak macununu sabah ve akşam aç karnına 1 tatlı kaşığı; bağırsak çalıştırıcı çayı günde 1 fincan (tercihen akşam); mumiyo tableti günde 1 adet bol su ile tüketin. Gaz giderici kremi karın bölgesine dairesel hareketlerle uygulayın.${SET_NOT}`,
    infografik: `${H} 16.47.00 (5).jpeg`,
  },
  {
    slug: "botox-etkili-bakim-seti",
    baslik: "Sıkılaştırıcı Yüz Bakım Seti",
    orijinalAd: "Botox Etkili Set",
    kategoriSlug: "setler",
    fiyat: "1690.00",
    setIcerigi: [
      "Yüz temizleme toniği",
      "Anti-aging serum",
      "Mumiyolu bakım kremi",
      "Mumiyo sabun",
      "Mumiyo tablet",
      "At kılı yüz fırçası",
      "Kabak lifi",
    ],
    kisa: "Yedi parçalık yüz bakım seti — tonik, serum, krem, sabun ve fırça.",
    aciklama: `Yedi parçalık yüz bakım seti. Temizlik, peeling, serum ve nemlendirme adımlarını kapsar.

Kullanım: Kabak lifi ve at kılı fırça ile nazikçe temizleyin. Toniği pamukla uygulayın. Serumu temiz cilde yedirin, ardından kremi sürün. Mumiyo sabunu günlük temizlikte kullanın. Mumiyo tableti etiketindeki öneriye göre tüketin.${HARICI_NOT}${SET_NOT}`,
    infografik: `${H} 16.47.00 (6).jpeg`,
  },
  {
    slug: "gunluk-bagisiklik-destek-seti",
    baslik: "Günlük Bağışıklık Destek Seti",
    orijinalAd: "Bağışıklık Güçlendirici Set",
    kategoriSlug: "setler",
    fiyat: "1980.00",
    setIcerigi: [
      "Çelik demir suyu",
      "Bağışıklık macunu",
      "Kalsiyum magnezyum çinko tablet",
      "Altın yağ (D vitamini)",
      "Lugol iyot",
      "Propolis",
      "Mumiyo tablet",
      "Akgünlük sakızı",
      "Zerdeçal ekstresi",
    ],
    kisa: "Dokuz parçalık takviye seti — macun, tablet, propolis ve ekstraktlar.",
    aciklama: `Dokuz parçalık takviye seti. Zerdeçal (curcumin) ekstresi, propolis, akgünlük sakızı ve mineral tabletlerinden oluşur.

Kullanım: Çelik demir suyunu günde 1 tatlı kaşığı aç karnına; bağışıklık macununu sabah ve akşam 1 tatlı kaşığı; kalsiyum magnezyum çinko tabletini günde 2 tablet bol su ile; altın yağı günde 2 damla akşam aç karnına; propolisi günde 10 damla; mumiyo tableti günde 1 adet; akgünlük sakızını sabah 1 adet çiğneyerek; zerdeçal ekstresini günde 1 kapsül yemeklerden sonra tüketin.${SET_NOT}`,
    infografik: `${H} 16.47.00 (7).jpeg`,
  },
  {
    slug: "beyaz-sac-bakim-seti",
    baslik: "Saç Renk Bakım Seti",
    orijinalAd: "Beyaz Saç Giderici Set",
    kategoriSlug: "setler",
    fiyat: "1280.00",
    setIcerigi: [
      "Bakım serumu",
      "Özel toz karışım",
      "Bitkisel macun",
      "Çörek otlu sabun",
    ],
    kisa: "Serum, toz karışım, bitkisel macun ve çörek otlu sabun.",
    aciklama: `Dört parçalık saç bakım seti. Bitkisel içeriklerle hazırlanmıştır.

Kullanım: Serumu temiz saç derisine püskürtüp masaj yapın. Toz karışımı ve macunu etiketindeki öneriye göre kullanın. Çörek otlu sabunla saçı yıkayın.${HARICI_NOT}`,
    infografik: `${H} 16.47.02 (4).jpeg`,
  },
  {
    slug: "karaciger-destek-seti",
    baslik: "Karaciğer Destek Seti",
    orijinalAd: "Karaciğer Temizleme Seti",
    kategoriSlug: "setler",
    fiyat: "1440.00",
    setIcerigi: [
      "Kombu detoks çay",
      "Gileburu sirkesi",
      "Karaciğer macunu",
      "Mumiyo tablet",
      "Lugol iyot",
    ],
    kisa: "Detoks çay, gileburu sirkesi, macun, tablet ve lugol iyot.",
    aciklama: `Beş parçalık takviye seti. Bitkisel içeriklerle hazırlanmıştır.

Kullanım: Kombu detoks çayı sabah aç karnına; gileburu sirkesini günde 1 tatlı kaşığı su ile; karaciğer macununu sabah ve akşam 1 tatlı kaşığı; mumiyo tableti günde 1 adet bol su ile tüketin.${SET_NOT}`,
    infografik: `${H} 16.47.02 (7).jpeg`,
  },
  {
    slug: "sivilce-akne-bakim-seti",
    baslik: "Sivilce & Akne Bakım Seti",
    kategoriSlug: "setler",
    fiyat: "1520.00",
    setIcerigi: [
      "Kombu detoks çay",
      "Karaciğer macunu",
      "Yüz temizleme toniği",
      "Aktif karbonlu kil maskesi",
      "Sivilce akne kremi",
      "Mumiyo tablet",
      "Lugol iyot",
      "Karma sabun",
    ],
    kisa: "Sekiz parçalık cilt bakım seti — tonik, kil maskesi, krem ve sabun.",
    aciklama: `Sekiz parçalık set. Cildin dıştan bakımı için ürünler ile bitkisel takviyelerden oluşur.

Kullanım: Karma sabunla yüzü yıkayın, toniği pamukla uygulayın. Kil maskesini haftada 1-2 kez uygulayıp durulayın. Kremi temiz cilde günde 1-2 kez sürün. Kombu detoks çayı ve macunu etiketindeki öneriye göre tüketin.${HARICI_NOT}${SET_NOT}`,
    infografik: `${H} 16.47.02 (8).jpeg`,
  },
  {
    slug: "dogal-zayiflama-destek-seti",
    baslik: "Doğal Zayıflama Destek Seti",
    kategoriSlug: "setler",
    fiyat: "1740.00",
    setIcerigi: [
      "Kombu detoks çay",
      "Bağırsak çalıştırıcı çay",
      "Fit karışım",
      "Zayıflamaya yardımcı yağ",
      "Mentollü masaj serumu",
      "Lugol iyot",
      "Mumiyo tablet",
    ],
    kisa: "İki bitki çayı, fit karışım, masaj yağı ve serum.",
    aciklama: `Yedi parçalık set. Bitkisel içerikler ve harici masaj ürünlerinden oluşur.

Kullanım: Kombu detoks çayı sabah aç karnına; bağırsak çalıştırıcı çayı akşam; fit karışımı ve mumiyo tableti etiketindeki öneriye göre tüketin. Masaj yağı ve mentollü serumu bölgeye dairesel hareketlerle uygulayın.

En iyi sonuç için dengeli beslenme ve düzenli egzersizle destekleyin.${SET_NOT}`,
    infografik: `${H} 16.47.02.jpeg`,
    showroom: "30-dogal-zayiflama-seti.jpg",
  },
  {
    slug: "dolasim-destek-seti",
    baslik: "Dolaşım Destek Seti",
    orijinalAd: "Tansiyon Destek Seti",
    kategoriSlug: "setler",
    fiyat: "1620.00",
    setIcerigi: [
      "Kombu detoks çay",
      "Detoks çay",
      "Kara halile macunu",
      "Kedi otlu stres çayı",
      "Akgünlük sakızı",
      "Mumiyo tablet",
      "Lugol iyot",
    ],
    kisa: "İki detoks çayı, macun, stres çayı, sakız ve tabletler.",
    aciklama: `Yedi parçalık takviye seti. Bitkisel çaylar, macun ve tabletlerden oluşur.

Kullanım: Kombu detoks çayı sabah aç karnına; detoks çayı günde 1 tatlı kaşığı; kara halile macununu sabah ve akşam 1 tatlı kaşığı; kedi otlu stres çayını akşam yatmadan önce 1 fincan tüketin.${SET_NOT} Tansiyon ilacı kullananların mutlaka hekimine danışması gerekir.`,
    infografik: `${H} 16.47.01 (1).jpeg`,
  },
  {
    slug: "erkek-destek-seti",
    baslik: "Erkeklere Özel Destek Seti",
    orijinalAd: "Prostat Seti",
    kategoriSlug: "setler",
    fiyat: "1860.00",
    setIcerigi: [
      "Çelik demir suyu",
      "Bitkisel kür",
      "İğde çekirdeği tozu",
      "Mumiyo tablet",
      "Özel krem",
      "Özel serum",
      "Lugol iyot",
    ],
    kisa: "Demir suyu, bitkisel kür, iğde tozu, tablet ve harici bakım ürünleri.",
    aciklama: `Yedi parçalık set. Bitkisel takviyeler ile harici bakım ürünlerinden oluşur.

Kullanım: Her ürünü kendi etiketindeki öneriye göre kullanın. Krem ve serum yalnızca harici kullanım içindir.${SET_NOT}`,
    infografik: `${H} 16.47.01 (3).jpeg`,
  },
  {
    slug: "tiroid-destek-seti",
    baslik: "Tiroid Destek Seti",
    orijinalAd: "Tiroid - Guatr Seti",
    kategoriSlug: "setler",
    fiyat: "1580.00",
    setIcerigi: [
      "Bitkisel kür",
      "Bakım kremi",
      "Boğaz masaj yağı",
      "Lugol iyot",
      "D vitamini",
    ],
    kisa: "Bitkisel kür, bakım kremi, masaj yağı, lugol iyot ve D vitamini.",
    aciklama: `Beş parçalık set. Bitkisel içerikler ile harici bakım ürünlerinden oluşur.

Kullanım: Bitkisel kürü sabah ve akşam aç karnına 1 tatlı kaşığı; D vitaminini sabah ve akşam aç karnına 1 çay kaşığı tüketin. Bakım kremini sırta, boğaz masaj yağını boğaz bölgesine masaj yaparak uygulayın.

%100 doğal ve güvenilir. Paraben, sülfat ve zararlı kimyasal içermez. Vegan.${SET_NOT} Tiroid ilacı kullananların mutlaka hekimine danışması gerekir.`,
    infografik: `${H} 16.47.04.jpeg`,
  },
  {
    slug: "sac-onarim-ve-bakim-seti",
    baslik: "Saç Onarım ve Bakım Seti",
    kategoriSlug: "setler",
    fiyat: "1740.00",
    setIcerigi: [
      "Sidr şampuan",
      "Çelik demir suyu",
      "Saç besleyici krem",
      "Saç onarım bakım serumu",
      "Karma sabun",
      "D vitamini",
      "Lugol iyot",
      "Mumiyo tablet",
      "Kemik tarak",
    ],
    kisa: "Dokuz parçalık saç bakım seti — şampuan, krem, serum ve tarak.",
    aciklama: `Dokuz parçalık saç bakım seti. Temizlik, bakım ve besleme adımlarını kapsar.

Kullanım: Sidr şampuanla saçı yıkayın. Durulama gerektirmeyen besleyici kremi nemli saça uygulayın. Onarım serumunu saç derisine püskürtüp masaj yapın. Kemik tarakla nazikçe tarayın. Takviyeleri etiketindeki öneriye göre tüketin.${HARICI_NOT}${SET_NOT}`,
    // DÜZELTME: bir sıra kaymıştı; Saç Onarım Seti 16.47.04 (1)'de.
    infografik: `${H} 16.47.04 (1).jpeg`,
  },
  {
    slug: "direnc-destek-seti",
    baslik: "Direnç Destek Seti",
    orijinalAd: "Enfeksiyon Destek Seti",
    kategoriSlug: "setler",
    fiyat: "1920.00",
    setIcerigi: [
      "Udihindi yağı",
      "Çörek otu yağı",
      "Propolis",
      "Deva karışımı",
      "Çelik demir suyu",
      "Akgünlük sakızı",
      "Kan macunu",
      "Lugol iyot",
      "Mumiyo tablet",
    ],
    kisa: "Dokuz parçalık takviye seti — yağlar, propolis, macun ve tabletler.",
    aciklama: `Dokuz parçalık takviye seti. Bitkisel yağlar, arı ürünleri ve mineral takviyelerinden oluşur.

Kullanım: Her ürünü kendi etiketindeki öneriye göre tüketin. Akgünlük sakızını sabah 1 adet çiğneyin, mumiyo tableti günde 1 adet bol su ile alın.${SET_NOT}`,
    // DÜZELTME: 16.47.04 (3) Varis Seti'ymiş. Enfeksiyon Seti 16.47.04 (2)'de.
    infografik: `${H} 16.47.04 (2).jpeg`,
  },
  {
    slug: "mide-rahatlatici-destek-seti",
    baslik: "Mide Rahatlatıcı Destek Seti",
    kategoriSlug: "setler",
    fiyat: "1380.00",
    setIcerigi: [
      "Mide rahatsızlıkları için macun",
      "Kombu çayı",
      "Gaz giderici krem",
      "Mumiyo tablet",
      "Lugol iyot",
    ],
    kisa: "Macun, kombu çayı, harici gaz kremi ve tabletler.",
    aciklama: `Beş parçalık set. Sindirim konforunu desteklemeye yönelik bitkisel içerikler ve harici bakım ürününden oluşur.

Kullanım: Macunu sabah ve akşam 1 tatlı kaşığı; kombu çayını günde 1-2 fincan; mumiyo tableti günde 1 adet tüketin. Gaz giderici kremi karın bölgesine dairesel hareketlerle masaj yaparak uygulayın.${SET_NOT}`,
    infografik: `${H} 16.47.05 (6).jpeg`,
  },
  {
    slug: "cocuk-gece-konfor-seti",
    baslik: "Çocuk Gece Konfor Destek Seti",
    orijinalAd: "Alt Islatanlar İçin Set",
    kategoriSlug: "anne-bebek",
    fiyat: "1290.00",
    setIcerigi: [
      "Çelik demir suyu",
      "Bitkisel macun",
      "İğde çekirdeği tozu",
      "Kuyruk yağlı krem",
      "Lugol iyot",
    ],
    kisa: "Demir suyu, bitkisel macun, iğde tozu ve harici bakım kremi.",
    aciklama: `Beş parçalık set. Bitkisel takviyeler ile harici bakım kreminden oluşur.

Kullanım: Her ürünü kendi etiketindeki öneriye göre kullanın. Krem yalnızca harici kullanım içindir.

ÇOCUKLARDA KULLANIM: Çocuklarda takviye kullanımı hekim kontrolünde olmalıdır. Kullanmadan önce çocuk doktorunuza danışın.${SET_NOT}`,
    infografik: `${H} 16.47.03 (4).jpeg`,
  },
];
