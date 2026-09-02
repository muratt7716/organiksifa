import { deflateSync } from "node:zlib";

/** CRC32 — PNG chunk'ları için gerekli. */
function crc32(buf: Buffer): number {
  let c: number;
  const tablo: number[] = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    tablo[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = tablo[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(tip: string, veri: Buffer): Buffer {
  const uzunluk = Buffer.alloc(4);
  uzunluk.writeUInt32BE(veri.length);
  const govde = Buffer.concat([Buffer.from(tip, "ascii"), veri]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(govde));
  return Buffer.concat([uzunluk, govde, crc]);
}

/**
 * Gerçek bir PNG üretir: dış çerçeve `cerceve`, iç dikdörtgen `ic` renginde.
 *
 * Testte siyah çerçeveli bir görsel kullanmak, letterbox kırpma ve zemin
 * rengi hesabının uçtan uca gerçekten çalıştığını doğrular — ürün kartının
 * simsiyah çıkmadığını görürüz.
 */
export function testPngOlustur(
  genislik = 600,
  yukseklik = 600,
  cerceve: [number, number, number] = [0, 0, 0],
  ic: [number, number, number] = [46, 125, 83],
  bant = 60,
): Buffer {
  const satirlar: Buffer[] = [];
  for (let y = 0; y < yukseklik; y++) {
    const satir = Buffer.alloc(1 + genislik * 3);
    satir[0] = 0; // filtre: None
    for (let x = 0; x < genislik; x++) {
      const icte =
        x >= bant && x < genislik - bant && y >= bant && y < yukseklik - bant;
      const [r, g, b] = icte ? ic : cerceve;
      satir[1 + x * 3] = r;
      satir[2 + x * 3] = g;
      satir[3 + x * 3] = b;
    }
    satirlar.push(satir);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(genislik, 0);
  ihdr.writeUInt32BE(yukseklik, 4);
  ihdr[8] = 8; // bit derinliği
  ihdr[9] = 2; // renk tipi: truecolor RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(Buffer.concat(satirlar))),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
