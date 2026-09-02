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

const VARSAYILAN_MS = 6000;

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
    if (e instanceof VeritabaniSuresiDoldu) {
      console.error(`[db] ${e.message} — bağlantı sıfırlanıyor`);
      // Ölü bağlantıyı at: yoksa bu örnek her istekte asılı kalmaya devam eder.
      const { baglantiyiSifirla } = await import("@/db");
      baglantiyiSifirla();
    } else {
      console.error("[db] okuma başarısız:", e);
    }
    return yedek;
  }
}
