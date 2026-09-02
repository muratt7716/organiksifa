import { describe, it, expect } from "vitest";
import { slugify, benzersizSlug } from "@/lib/slug";
import { fiyatAyristir, fiyatBicimle, indirimYuzdesi } from "@/lib/price";
import { telefonNormalize, telefonGoster } from "@/lib/phone";
import { kargoHesapla } from "@/lib/shipping";
import { waLink, siparisMesaji } from "@/lib/whatsapp";
import {
  tekRenkKenarlariKirp,
  zeminRengi,
  type Pikseller,
} from "@/lib/image-analysis";

/* ------------------------------ slug ------------------------------ */

describe("slugify", () => {
  it("Türkçe karakterleri ASCII karşılığına çevirir", () => {
    expect(slugify("Çörekotu Yağı")).toBe("corekotu-yagi");
    expect(slugify("Iğdır Şifası")).toBe("igdir-sifasi");
    expect(slugify("İNCİ ÇEKİRDEĞİ")).toBe("inci-cekirdegi");
    expect(slugify("Hücre Yenileyici Merhem")).toBe("hucre-yenileyici-merhem");
  });

  it("noktalama ve fazla boşluğu tek tireye indirir", () => {
    expect(slugify("Uyuz Seti  (4 Ürün)")).toBe("uyuz-seti-4-urun");
    expect(slugify("D Vitamini — Altın Yağ")).toBe("d-vitamini-altin-yag");
  });

  it("baştaki ve sondaki tireleri temizler", () => {
    expect(slugify("  ...Merhem!  ")).toBe("merhem");
  });

  it("boş girdide boş döner", () => {
    expect(slugify("")).toBe("");
    expect(slugify("!!!")).toBe("");
  });
});

describe("benzersizSlug", () => {
  it("çakışma yoksa tabanı döner", () => {
    expect(benzersizSlug("merhem", [])).toBe("merhem");
  });

  it("çakışmada sonuna sayı ekler", () => {
    expect(benzersizSlug("merhem", ["merhem"])).toBe("merhem-2");
    expect(benzersizSlug("merhem", ["merhem", "merhem-2"])).toBe("merhem-3");
  });

  it("taban boşsa urun kullanır", () => {
    expect(benzersizSlug("", [])).toBe("urun");
  });
});

/* ------------------------------ fiyat ------------------------------ */

describe("fiyatAyristir", () => {
  it("Türkçe ondalık ayracını kabul eder", () => {
    expect(fiyatAyristir("1.250,00")).toBe(1250);
    expect(fiyatAyristir("450,50")).toBe(450.5);
    expect(fiyatAyristir("89,9")).toBe(89.9);
  });

  it("İngilizce biçimi de kabul eder", () => {
    expect(fiyatAyristir("1250.50")).toBe(1250.5);
    expect(fiyatAyristir("1,250.50")).toBe(1250.5);
  });

  it("binlik ayracı olarak tek noktayı çözer", () => {
    expect(fiyatAyristir("1.250")).toBe(1250);
    expect(fiyatAyristir("12.500")).toBe(12500);
  });

  it("sade ondalığı bozmaz", () => {
    expect(fiyatAyristir("1.5")).toBe(1.5);
    expect(fiyatAyristir("450")).toBe(450);
  });

  it("para simgesi ve boşluğu yok sayar", () => {
    expect(fiyatAyristir(" 890 ₺ ")).toBe(890);
    expect(fiyatAyristir("340 TL")).toBe(340);
  });

  it("geçersiz girdide null döner", () => {
    expect(fiyatAyristir("")).toBeNull();
    expect(fiyatAyristir("bedava")).toBeNull();
    expect(fiyatAyristir("elli lira")).toBeNull();
  });

  it("iki basamağa yuvarlar", () => {
    expect(fiyatAyristir("10,999")).toBe(11);
  });
});

describe("fiyatBicimle", () => {
  it("Türkçe biçimde gösterir", () => {
    expect(fiyatBicimle(1250)).toBe("1.250,00 ₺");
    expect(fiyatBicimle(89.9)).toBe("89,90 ₺");
  });
});

describe("indirimYuzdesi", () => {
  it("eski fiyat büyükse yüzde hesaplar", () => {
    expect(indirimYuzdesi(750, 1000)).toBe(25);
  });
  it("eski fiyat yoksa veya küçükse null döner", () => {
    expect(indirimYuzdesi(750, null)).toBeNull();
    expect(indirimYuzdesi(750, 700)).toBeNull();
  });
});

/* ------------------------------ telefon ------------------------------ */

describe("telefonNormalize", () => {
  it("yaygın Türkçe yazımları E.164 rakamına çevirir", () => {
    expect(telefonNormalize("0532 111 22 33")).toBe("905321112233");
    expect(telefonNormalize("05321112233")).toBe("905321112233");
    expect(telefonNormalize("532 111 22 33")).toBe("905321112233");
    expect(telefonNormalize("+90 532 111 22 33")).toBe("905321112233");
    expect(telefonNormalize("905321112233")).toBe("905321112233");
    expect(telefonNormalize("0090 532 111 22 33")).toBe("905321112233");
  });

  it("parantez ve tireyi yok sayar", () => {
    expect(telefonNormalize("(0532) 111-22-33")).toBe("905321112233");
  });

  it("eksik veya fazla haneli numarada null döner", () => {
    expect(telefonNormalize("532 111 22")).toBeNull();
    expect(telefonNormalize("0532 111 22 33 44")).toBeNull();
    expect(telefonNormalize("")).toBeNull();
    expect(telefonNormalize("merhaba")).toBeNull();
  });
});

describe("telefonGoster", () => {
  it("okunabilir biçimde gösterir", () => {
    expect(telefonGoster("905321112233")).toBe("+90 532 111 22 33");
  });
});

/* ------------------------------ kargo ------------------------------ */

const AYAR = { kargoBedavaAcik: true, kargoBedavaLimit: 750, kargoUcreti: 99 };

describe("kargoHesapla", () => {
  it("limit altında sabit ücret alır ve kalanı bildirir", () => {
    const s = kargoHesapla([{ fiyat: 540, adet: 1, kargoBedava: false }], AYAR);
    expect(s.ucret).toBe(99);
    expect(s.bedavayaKalan).toBe(210);
  });

  it("limit üstünde bedava yapar", () => {
    const s = kargoHesapla([{ fiyat: 800, adet: 1, kargoBedava: false }], AYAR);
    expect(s.ucret).toBe(0);
    expect(s.bedavayaKalan).toBeNull();
  });

  it("sepette kargo bedava ürün varsa tüm sipariş bedava", () => {
    const s = kargoHesapla(
      [
        { fiyat: 100, adet: 1, kargoBedava: true },
        { fiyat: 200, adet: 1, kargoBedava: false },
      ],
      AYAR,
    );
    expect(s.ucret).toBe(0);
    expect(s.kural).toContain("kargo bedava ürün");
  });

  it("bedava kargo kapalıysa limiti dikkate almaz", () => {
    const s = kargoHesapla([{ fiyat: 5000, adet: 1, kargoBedava: false }], {
      ...AYAR,
      kargoBedavaAcik: false,
    });
    expect(s.ucret).toBe(99);
  });

  it("kargo ücreti sıfırsa her zaman bedava", () => {
    const s = kargoHesapla([{ fiyat: 10, adet: 1, kargoBedava: false }], {
      ...AYAR,
      kargoUcreti: 0,
    });
    expect(s.ucret).toBe(0);
  });

  it("adet çarpımını hesaba katar", () => {
    const s = kargoHesapla([{ fiyat: 400, adet: 2, kargoBedava: false }], AYAR);
    expect(s.ucret).toBe(0);
  });

  it("boş sepette ücret almaz", () => {
    expect(kargoHesapla([], AYAR).ucret).toBe(0);
  });
});

/* ------------------------------ whatsapp ------------------------------ */

describe("waLink", () => {
  it("numarayı temizler ve mesajı tam kaçırır", () => {
    const link = waLink("+90 532 111 22 33", "Merhaba & hoş geldin #1");
    expect(link.startsWith("https://wa.me/905321112233?text=")).toBe(true);
    // encodeURI olsaydı & ve # kaçmaz, mesaj kesilirdi
    expect(link).toContain("%26");
    expect(link).toContain("%23");
  });

  it("satır sonlarını kaçırır", () => {
    expect(waLink("905321112233", "a\nb")).toContain("%0A");
  });
});

describe("siparisMesaji", () => {
  const mesaj = siparisMesaji({
    siparisNo: "ORD-000042",
    musteriAdi: "Ayşe Kaya",
    satirlar: [{ baslik: "Uyuz Seti", adet: 1, satirToplam: 890 }],
    araToplam: 890,
    kargoUcreti: 0,
    toplam: 890,
  });

  it("sipariş numarasını en başa koyar", () => {
    expect(mesaj.startsWith("Sipariş No: ORD-000042")).toBe(true);
  });

  it("ücretsiz kargoyu belirtir", () => {
    expect(mesaj).toContain("Kargo: Ücretsiz");
  });

  it("toplam tutarı içerir", () => {
    expect(mesaj).toContain("TOPLAM: 890,00 ₺");
  });
});

/* --------------------------- görsel analizi --------------------------- */

function gorselUret(
  w: number,
  h: number,
  cerceve: [number, number, number],
  ic: [number, number, number],
  bant: number,
): Pikseller {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const icte = x >= bant && x < w - bant && y >= bant && y < h - bant;
      const [r, g, b] = icte ? ic : cerceve;
      const i = (y * w + x) * 4;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }
  return { data, width: w, height: h };
}

describe("tekRenkKenarlariKirp", () => {
  it("siyah letterbox şeritlerini kırpar", () => {
    const px = gorselUret(20, 20, [0, 0, 0], [200, 220, 200], 4);
    expect(tekRenkKenarlariKirp(px)).toEqual({ x: 4, y: 4, w: 12, h: 12 });
  });

  it("beyaz kenar boşluğunu da kırpar", () => {
    const px = gorselUret(20, 20, [255, 255, 255], [30, 80, 55], 3);
    expect(tekRenkKenarlariKirp(px)).toEqual({ x: 3, y: 3, w: 14, h: 14 });
  });

  it("kırpılacak kenar yoksa tüm görseli döner", () => {
    const px = gorselUret(10, 10, [120, 130, 140], [120, 130, 140], 0);
    expect(tekRenkKenarlariKirp(px)).toEqual({ x: 0, y: 0, w: 10, h: 10 });
  });

  it("her şey tek renkse görseli tamamen yemez", () => {
    const px = gorselUret(10, 10, [0, 0, 0], [0, 0, 0], 5);
    const k = tekRenkKenarlariKirp(px);
    expect(k.w).toBeGreaterThan(0);
    expect(k.h).toBeGreaterThan(0);
  });

  it("hafif JPEG gürültüsünü tolere eder", () => {
    const px = gorselUret(20, 20, [2, 1, 3], [200, 220, 200], 4);
    expect(tekRenkKenarlariKirp(px, 8)).toEqual({ x: 4, y: 4, w: 12, h: 12 });
  });

  it("kalın kenar bandını da kırpar", () => {
    const px = gorselUret(20, 20, [255, 255, 255], [30, 80, 55], 8);
    expect(tekRenkKenarlariKirp(px)).toEqual({ x: 8, y: 8, w: 4, h: 4 });
  });
});

describe("zeminRengi", () => {
  it("kırpılmış alanın kenar rengini döner", () => {
    const px = gorselUret(20, 20, [0, 0, 0], [237, 241, 232], 4);
    expect(zeminRengi(px, tekRenkKenarlariKirp(px))).toBe("#EDF1E8");
  });

  it("siyah şeritli görselde SİYAH dönmez", () => {
    const px = gorselUret(20, 20, [0, 0, 0], [240, 245, 238], 4);
    expect(zeminRengi(px, tekRenkKenarlariKirp(px))).not.toBe("#000000");
  });

  it("çok koyu kenarı okunabilir sınıra çeker", () => {
    const px = gorselUret(20, 20, [10, 10, 10], [10, 10, 10], 0);
    const renk = zeminRengi(px, { x: 0, y: 0, w: 20, h: 20 });
    expect(renk).toMatch(/^#[0-9A-F]{6}$/);
    expect(renk).not.toBe("#0A0A0A");
  });
});
