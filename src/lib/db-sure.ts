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
 * Kısa tutuluyor. Ölçüm: panel sayfaları dönüşümlü olarak 1 sn / 6.2 sn
 * sürüyordu ve 6.2 sn'nin tamamı beklenen zaman aşımıydı.
 *
 * Vercel istekleri birden fazla serverless örneğine dağıtıyor; donmuş bir
 * örneğin bağlantısını havuz çoktan kapatmış oluyor. O bağlantıyı beklemek
 * yerine hızlıca pes edip taze bağlantıyla YENİDEN denemek çok daha ucuz:
 * yeni bağlantı kurmak ölçülen ~600 ms.
 */
const VARSAYILAN_MS = 2500;

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
      return await sureli(islem(), ms + 1500);
    } catch (e2) {
      console.error("[db] taze bağlantıyla da okunamadı:", e2);
      return yedek;
    }
  }
}
