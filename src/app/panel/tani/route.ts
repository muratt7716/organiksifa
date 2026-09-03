import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";

/**
 * Panel gecikmesi için kontrol deneyi.
 *
 * `/api/saglik` ile bu uç nokta AYNI işi yapıyor (bir veritabanı turu).
 * Tek fark: bu yol `/panel/:path*` altında olduğu için **proxy'den geçiyor**.
 *
 * Ölçüm sorusu: proxy'nin dinamik rotalara eklediği maliyet nedir?
 *   /api/saglik  ısınınca ~470 ms
 *   /panel/ayarlar hiç ısınmıyor, 1820 ms tabanında
 *
 * Buradan gelen sayı ikisinin arasındaki farkı proxy'ye mi yoksa sayfa
 * render'ına mı yazacağımızı söyleyecek.
 *
 * Geçici teşhis aracı — sorun çözülünce silinecek.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const t0 = Date.now();
  await db.execute(sql`SELECT 1`);
  const sorgu = Date.now() - t0;

  return NextResponse.json(
    { sorgu: `${sorgu} ms`, not: "proxy kapsaminda, tek sorgu" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
