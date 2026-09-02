import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { sureli } from "@/lib/db-sure";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Teşhis ucu — /api/saglik
 *
 * Vercel'in veritabanına gerçekten ulaşıp ulaşamadığını ve ne kadar
 * sürdüğünü gösterir. Tarayıcıdan açılabilir; gizli bilgi sızdırmaz
 * (bağlantı adresi maskelenir).
 */
export async function GET() {
  const basladi = Date.now();

  const ortam = {
    DATABASE_URL: Boolean(process.env.DATABASE_URL),
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? null,
  };

  // Bağlantı adresinden yalnızca host ve portu göster
  let hedef: string | null = null;
  if (process.env.DATABASE_URL) {
    try {
      const u = new URL(process.env.DATABASE_URL);
      hedef = `${u.hostname}:${u.port}`;
    } catch {
      hedef = "cozumlenemedi";
    }
  }

  if (!ortam.DATABASE_URL) {
    return NextResponse.json(
      { durum: "hata", sebep: "DATABASE_URL tanımlı değil", ortam, hedef },
      { status: 503 },
    );
  }

  try {
    const t0 = Date.now();
    await sureli(db.execute(sql`SELECT 1`), 5000);
    const pingMs = Date.now() - t0;

    const t1 = Date.now();
    const sayim = (await sureli(
      db.execute(sql`
        SELECT
          (SELECT count(*)::int FROM products WHERE yayinda) AS urun,
          (SELECT count(*)::int FROM orders)                 AS siparis
      `),
      5000,
    )) as unknown as { urun: number; siparis: number }[];
    const sorguMs = Date.now() - t1;

    const satir = Array.isArray(sayim) ? sayim[0] : undefined;

    return NextResponse.json({
      durum: "iyi",
      hedef,
      ortam,
      sureler: { ping: `${pingMs} ms`, sorgu: `${sorguMs} ms`, toplam: `${Date.now() - basladi} ms` },
      veri: { yayindaUrun: satir?.urun ?? null, siparis: satir?.siparis ?? null },
    });
  } catch (e) {
    return NextResponse.json(
      {
        durum: "hata",
        hedef,
        ortam,
        sebep: e instanceof Error ? e.message : String(e),
        toplam: `${Date.now() - basladi} ms`,
      },
      { status: 503 },
    );
  }
}
