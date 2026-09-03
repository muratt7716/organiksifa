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
  const client = postgres(url, {
    prepare: false,
    max: 1,
    idle_timeout: 20,
    max_lifetime: 60 * 5,
    connect_timeout: 10,

    /**
     * OS_SQL_LOG=1 ile her sorgu süresiyle birlikte yazılır.
     *
     * "Sayfa 1.3 saniye sürüyor" bilgisi tek başına işe yaramıyor; asıl soru
     * kaç sorgu atıldığı. Supabase'e her gidiş-dönüş ~48 ms (ölçüldü), yani
     * sorgu SAYISI doğrudan sayfa süresi demek. Bu kanca onu görünür kılıyor.
     */
    debug:
      process.env.OS_SQL_LOG === "1"
        ? (_bag, sorgu) => {
            const tek = sorgu.replace(/\s+/g, " ").trim().slice(0, 110);
            console.log(`[sql] ${tek}`);
          }
        : undefined,
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

/**
 * Önbellekteki bağlantıyı atar; bir sonraki sorgu yenisini kurar.
 *
 * Serverless'te donmuş bir örneğin bağlantısı havuz tarafından kapatılmış
 * olabilir. Bu durumda sorgu yanıt vermez ve o örnek KALICI olarak bozulur
 * — her istek asılı kalır. Zaman aşımı yakalandığında bu çağrılır ve
 * örnek kendini onarır.
 */
export function baglantiyiSifirla() {
  const eski = globalForDb.__osClient;
  globalForDb.__osDb = undefined;
  globalForDb.__osClient = undefined;
  // Kapatmayı bekleme: ölü bağlantıda close() de asılı kalabilir.
  void eski?.end({ timeout: 1 }).catch(() => {});
}

export { schema };
