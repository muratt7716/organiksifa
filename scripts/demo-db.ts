/**
 * Yerel demo veritabanı — `npm run demo:db`
 *
 * PGlite (WASM'a derlenmiş GERÇEK PostgreSQL) çalıştırır ve onu Postgres
 * tel protokolü üzerinden 5433 portunda yayınlar. Böylece uygulama hiçbir
 * değişiklik yapmadan normal `DATABASE_URL` bağlantısını kullanır.
 *
 * Docker gerekmez, kurulum gerekmez, Supabase gerekmez.
 * Sahte veri katmanı DEĞİLDİR — gerçek şema, gerçek SQL, gerçek sorgular.
 */
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";

const PORT = 5433;
const KLASOR = ".pglite";

async function main() {
  console.log("Demo veritabanı açılıyor…");
  const db = await PGlite.create(KLASOR);

  const sunucu = new PGLiteSocketServer({ db, port: PORT, host: "127.0.0.1" });
  await sunucu.start();

  console.log(`\n  PostgreSQL hazır → postgresql://postgres@127.0.0.1:${PORT}/postgres`);
  console.log(`  Veriler: ${KLASOR}/ klasöründe kalıcı\n`);
  console.log("  Kapatmak için Ctrl+C\n");

  const kapat = async () => {
    console.log("\nKapatılıyor…");
    await sunucu.stop();
    await db.close();
    process.exit(0);
  };
  process.on("SIGINT", kapat);
  process.on("SIGTERM", kapat);
}

main().catch((e) => {
  console.error("Demo veritabanı başlatılamadı:", e);
  process.exit(1);
});
