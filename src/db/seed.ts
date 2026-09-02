import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"], quiet: true });

import { db } from "./index";
import { categories, settings } from "./schema";
import { slugify } from "../lib/slug";

const KATEGORILER = [
  { ad: "Setler", aciklama: "Birlikte kullanılmak üzere hazırlanmış ürün setleri." },
  { ad: "Takviye Ürünler", aciklama: "Günlük destek için doğal takviye edici gıdalar." },
  { ad: "Cilt Bakımı", aciklama: "Bitkisel özlerle hazırlanan krem ve merhemler." },
  { ad: "Bitkisel Yağlar", aciklama: "Soğuk sıkım ve karışım bitkisel yağlar." },
  { ad: "Çay & Detoks", aciklama: "Bitki çayları ve detoks destek ürünleri." },
  { ad: "Sabun & Temizlik", aciklama: "El yapımı sabunlar ve doğal temizlik ürünleri." },
];

async function main() {
  console.log("Baslangic verisi yukleniyor...");

  await db.insert(settings).values({ id: 1 }).onConflictDoNothing();
  console.log("  - ayarlar hazir");

  for (const [i, k] of KATEGORILER.entries()) {
    await db
      .insert(categories)
      .values({
        ad: k.ad,
        slug: slugify(k.ad),
        aciklama: k.aciklama,
        sira: (i + 1) * 10,
      })
      .onConflictDoNothing();
  }
  console.log(`  - ${KATEGORILER.length} kategori hazir`);

  console.log("Tamamlandi.");
  process.exit(0);
}

main().catch((e) => {
  console.error("Seed basarisiz:", e);
  process.exit(1);
});
