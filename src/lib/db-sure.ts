/**
 * Veritabanı okumalarına sert süre sınırı.
 *
 * Neden gerekli: serverless'te fonksiyon örneği çağrılar arasında dondurulur.
 * Uyandığında elindeki TCP bağlantısı havuz tarafından çoktan kapatılmış
 * olabilir. postgres.js bunu bilmeden sorgu gönderir ve YANIT HİÇ GELMEZ —
 * hata da fırlatmaz. try/catch bu durumu yakalayamaz; sayfa asılı kalır.
 *
 * Bu sarmalayıcı, süre dolduğunda hata fırlatır. Çağıran taraftaki
 * try/catch devreye girer ve sayfa boş durumla ayakta kalır.
 */

export class VeritabaniSuresiDoldu extends Error {
  constructor(saniye: number) {
    super(`Veritabanı ${saniye} saniyede yanıt vermedi`);
    this.name = "VeritabaniSuresiDoldu";
  }
}

/**
 * İlk deneme için sınır — canlıda ölçülen gerçek sürelere göre seçildi:
 *
 *   sağlıklı sorgu ............  94 ms
 *   taze bağlantı + sorgu ..... 604 ms
 *
 * Yani 900 ms, çalışan bir bağlantı için fazlasıyla yeterli. Ölü bir
 * bağlantıyı bundan uzun beklemek saf kayıp: serverless'te donmuş örneğin
 * bağlantısını havuz çoktan kapatmış oluyor ve yanıt hiç gelmiyor.
 *
 * 2500 ms denendi, panel sayfaları ~3.4 sn'ye oturdu (2.5 boşa + 0.9 gerçek).
 */
const VARSAYILAN_MS = 900;

/** Yeniden denemede bağlantı sıfırdan kurulacağı için daha geniş. */
const YENIDEN_DENEME_MS = 5000;

export async function sureli<T>(
  islem: Promise<T>,
  ms: number = VARSAYILAN_MS,
): Promise<T> {
  let sayac: ReturnType<typeof setTimeout> | undefined;

  const zamanAsimi = new Promise<never>((_, red) => {
    sayac = setTimeout(() => red(new VeritabaniSuresiDoldu(ms / 1000)), ms);
  });

  try {
    return await Promise.race([islem, zamanAsimi]);
  } catch (e) {
    if (e instanceof VeritabaniSuresiDoldu) {
      // Ölü bağlantıyı at: yoksa bu örnek her istekte asılı kalmaya devam eder.
      const { baglantiyiSifirla } = await import("@/db");
      baglantiyiSifirla();
    }
    throw e;
  } finally {
    if (sayac) clearTimeout(sayac);
  }
}

/**
 * Süre dolarsa ya da hata olursa yedek değeri döndürür — hiç fırlatmaz.
 * Okuma yollarında (katalog, ayarlar) kullanılır: site boş durumla ayakta kalır.
 */
export async function sureliVeyaYedek<T>(
  islem: () => Promise<T>,
  yedek: T,
  ms: number = VARSAYILAN_MS,
): Promise<T> {
  try {
    return await sureli(islem(), ms);
  } catch (e) {
    if (!(e instanceof VeritabaniSuresiDoldu)) {
      console.error("[db] okuma başarısız:", e);
      return yedek;
    }

    /**
     * İlk deneme ölü bağlantıya takıldı; sureli() onu attı.
     * Şimdi TAZE bağlantıyla bir kez daha deniyoruz — sayfa boş
     * görünmesin diye. Bu deneme genelde ~600 ms sürer.
     */
    try {
      return await sureli(islem(), YENIDEN_DENEME_MS);
    } catch (e2) {
      console.error("[db] taze bağlantıyla da okunamadı:", e2);
      return yedek;
    }
  }
}
