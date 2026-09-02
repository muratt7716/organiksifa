import { describe, it, expect } from "vitest";
import { inflateSync } from "node:zlib";
import { testPngOlustur } from "../e2e/yardimcilar/png";

/**
 * Canlı panel testi bu üreteçle gerçek bir fotoğraf yüklüyor.
 * Üreteç bozuksa canlı test sessizce yanlış şeyi test eder — bu yüzden
 * ürettiği PNG'nin yapısını burada doğruluyoruz.
 */
describe("testPngOlustur", () => {
  const png = testPngOlustur(120, 120, [0, 0, 0], [46, 125, 83], 20);

  it("geçerli PNG imzasıyla başlar", () => {
    expect([...png.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  });

  it("IHDR, IDAT ve IEND chunk'larını içerir", () => {
    const metin = png.toString("latin1");
    expect(metin).toContain("IHDR");
    expect(metin).toContain("IDAT");
    expect(metin).toContain("IEND");
  });

  it("IHDR doğru boyutu ve renk tipini bildirir", () => {
    // 8 bayt imza + 4 bayt uzunluk + 4 bayt "IHDR" = 16
    expect(png.readUInt32BE(16)).toBe(120); // genişlik
    expect(png.readUInt32BE(20)).toBe(120); // yükseklik
    expect(png[24]).toBe(8); // bit derinliği
    expect(png[25]).toBe(2); // truecolor RGB
  });

  it("piksel verisi çerçeve ve iç rengi doğru taşır", () => {
    const idatBaslangic = png.indexOf(Buffer.from("IDAT", "ascii")) + 4;
    const uzunluk = png.readUInt32BE(idatBaslangic - 8);
    const ham = inflateSync(png.subarray(idatBaslangic, idatBaslangic + uzunluk));

    const satirBayt = 1 + 120 * 3;

    // İlk satır tamamen çerçeve rengi (siyah)
    expect(ham[0]).toBe(0); // filtre baytı
    expect([ham[1], ham[2], ham[3]]).toEqual([0, 0, 0]);

    // Orta satırın ortası iç renk (yeşil)
    const ortaSatir = 60 * satirBayt;
    const ortaPiksel = ortaSatir + 1 + 60 * 3;
    expect([ham[ortaPiksel], ham[ortaPiksel + 1], ham[ortaPiksel + 2]]).toEqual([
      46, 125, 83,
    ]);

    // Orta satırın kenarı hâlâ çerçeve rengi
    expect([ham[ortaSatir + 1], ham[ortaSatir + 2], ham[ortaSatir + 3]]).toEqual([
      0, 0, 0,
    ]);
  });

  it("varsayılan boyutta makul bir dosya üretir", () => {
    const varsayilan = testPngOlustur();
    expect(varsayilan.length).toBeGreaterThan(200);
    expect(varsayilan.length).toBeLessThan(200_000);
  });
});
