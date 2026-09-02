import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Db = PostgresJsDatabase<typeof schema>;

const globalForDb = globalThis as unknown as {
  __osDb?: Db;
  __osClient?: ReturnType<typeof postgres>;
};

function olustur(): Db {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL tanımlı değil. .env.example dosyasını .env.local olarak " +
        "kopyalayıp Supabase bağlantı bilgilerini doldur.",
    );
  }

  /**
   * Supabase transaction pooler'ı (port 6543) prepared statement DESTEKLEMEZ.
   * prepare:false verilmezse üretimde teşhis edilmesi zor
   * "prepared statement already exists" hataları çıkar.
   *
   * Yerel demo (PGlite soketi) de aynı ayarla sorunsuz çalışır.
   */
  /**
   * idle_timeout KISA tutulmalı.
   *
   * Serverless'te fonksiyon çağrılar arasında dondurulur. Uzun bir
   * idle_timeout, donmuş örnekte açık kalan bir TCP bağlantısı bırakır;
   * havuz o bağlantıyı kendi tarafından kapatır ama örnek bunu bilmez ve
   * uyandığında ölü bağlantıya sorgu göndererek zaman aşımına uğrar.
   *
   * 20 saniye, bağlantının donmadan önce kapanmasını sağlar.
   */
  const client =
    globalForDb.__osClient ??
    postgres(url, {
      prepare: false,
      max: 1,
      idle_timeout: 20,
      max_lifetime: 60 * 5,
      connect_timeout: 10,
    });
  globalForDb.__osClient = client;
  return drizzle(client, { schema });
}

/**
 * Bağlantı ilk sorguya kadar kurulmaz.
 *
 * Böylece veritabanı henüz hazır değilken `next build` çalışabilir ve
 * sayfalar (hepsi try/catch ile yazıldı) boş durum göstererek ayakta kalır.
 * Gerçek bir sorgu denendiğinde hata açıkça yükselir — sessizce yanlış
 * veri dönmez.
 */
export const db: Db = new Proxy({} as Db, {
  get(_hedef, ozellik, alici) {
    if (!globalForDb.__osDb) globalForDb.__osDb = olustur();
    return Reflect.get(globalForDb.__osDb, ozellik, alici);
  },
});

export { schema };
