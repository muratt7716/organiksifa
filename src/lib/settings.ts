import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { sayi } from "./price";
import { sureliVeyaYedek } from "./db-sure";

export type Ayarlar = typeof settings.$inferSelect;

/** Veritabanı henüz kurulmamışsa bile site ayakta kalsın diye kullanılan varsayılan. */
export const VARSAYILAN_AYAR: Ayarlar = {
  id: 1,
  siteAdi: "Organik Şifa",
  siteSlogan: "Doğadan gelen şifa, kapına kadar",
  whatsappNumarasi: null,
  whatsappSablon: null,
  kargoBedavaAcik: true,
  kargoBedavaLimit: "750.00",
  kargoUcreti: "99.00",
  varsayilanKdv: "0",
  duyuruMetni: null,
  duyuruAcik: false,
  instagramUrl: null,
  iletisimTelefon: null,
  iletisimEmail: null,
  ticaretUnvani: null,
  adres: null,
  mersisNo: null,
  vergiDairesi: null,
  vergiNo: null,
  etbisDogrulamaUrl: null,
  bildirimKanallari: { telegram: true, email: false },
  guncellendiAt: new Date(),
};

/**
 * Ayarlar bir sayfada birden çok yerden okunuyor: yerleşim (duyuru şeridi),
 * generateMetadata (site adı), ürün sayfası (kargo limiti), footer (iletişim).
 *
 * cache() bunları TEK sorguya indiriyor. Ölçüm: ürün sayfası 18 sorgu atıyordu,
 * bunun 3'ü aynı ayarlar okumasıydı. Supabase'e her gidiş-dönüş ~48 ms.
 *
 * Bellekleme istek başınadır — bir sonraki istekte veri yine taze okunur.
 */
export const ayarlariGetir = cache(async (): Promise<Ayarlar> => {
  return sureliVeyaYedek(async () => {
    const [satir] = await db.select().from(settings).where(eq(settings.id, 1));
    return satir ?? VARSAYILAN_AYAR;
  }, VARSAYILAN_AYAR);
});

/** Kargo hesabı için sayıya çevrilmiş ayar. */
export function kargoAyari(a: Ayarlar) {
  return {
    kargoBedavaAcik: a.kargoBedavaAcik,
    kargoBedavaLimit: a.kargoBedavaLimit ? sayi(a.kargoBedavaLimit) : null,
    kargoUcreti: a.kargoUcreti ? sayi(a.kargoUcreti) : null,
  };
}
