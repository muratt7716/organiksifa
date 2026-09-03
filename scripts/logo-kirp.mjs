/**
 * Logo dosyalarının etrafındaki boş kenarları kırpar.
 *   node scripts/logo-kirp.mjs           (ölçer, dosyaya dokunmaz)
 *   node scripts/logo-kirp.mjs --yaz     (kırpıp üzerine yazar)
 *
 * Neden gerekli: AI ile üretilen logolarda marka, tuvalin ortasında bol
 * boşlukla duruyor. `h-8` gibi bir yükseklik verdiğinde o boşluk da
 * ölçeklendiği için logo olduğundan küçük görünüyor. Kırpınca aynı CSS
 * yüksekliğinde marka gözle görülür biçimde büyüyor.
 *
 * Yeni bir logo üretilirse bu betik tekrar çalıştırılmalı.
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const KOK = path.join(import.meta.dirname, "..", "public", "marka");
const YAZ = process.argv.includes("--yaz");

for (const ad of ["logo-yatay", "logo-sembol"]) {
  const yol = path.join(KOK, `${ad}.png`);
  if (!fs.existsSync(yol)) {
    console.log(`${ad}: dosya yok, atlandı`);
    continue;
  }

  const once = await sharp(yol).metadata();
  // threshold: beyaza çok yakın pikselleri de boşluk say.
  const kirpik = await sharp(yol).trim({ threshold: 10 }).png().toBuffer();
  const sonra = await sharp(kirpik).metadata();

  const kazanc = Math.round(
    (1 - (sonra.width * sonra.height) / (once.width * once.height)) * 100,
  );

  console.log(
    `${ad.padEnd(12)} ${once.width}x${once.height} -> ${sonra.width}x${sonra.height}` +
      `  oran ${(sonra.width / sonra.height).toFixed(2)}  (%${kazanc} boşluk atıldı)`,
  );

  if (YAZ) {
    fs.writeFileSync(yol, kirpik);
    console.log(`             yazıldı: public/marka/${ad}.png`);
  }
}

if (!YAZ) console.log("\n(ölçüm modu — yazmak için: node scripts/logo-kirp.mjs --yaz)");
