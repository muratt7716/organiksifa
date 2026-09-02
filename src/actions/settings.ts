"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { telefonNormalize } from "@/lib/phone";
import { fiyatAyristir } from "@/lib/price";
import { yetkiGerekli } from "./auth";

const AyarSemasi = z.object({
  siteAdi: z.string().trim().min(2, "Site adı en az 2 harf olmalı"),
  siteSlogan: z.string().trim().max(120).optional(),
  whatsappNumarasi: z.string().optional(),
  kargoBedavaAcik: z.boolean(),
  kargoBedavaLimitMetni: z.string().optional(),
  kargoUcretiMetni: z.string().optional(),
  duyuruMetni: z.string().max(160).optional(),
  duyuruAcik: z.boolean(),
  instagramUrl: z.string().optional(),
  iletisimTelefon: z.string().optional(),
  iletisimEmail: z.string().optional(),
  ticaretUnvani: z.string().optional(),
  adres: z.string().optional(),
  mersisNo: z.string().optional(),
  vergiDairesi: z.string().optional(),
  vergiNo: z.string().optional(),
  etbisDogrulamaUrl: z.string().optional(),
  telegramAcik: z.boolean(),
  epostaAcik: z.boolean(),
});

export type AyarGirdisi = z.infer<typeof AyarSemasi>;

export async function ayarlariKaydet(
  girdi: AyarGirdisi,
): Promise<{ hata?: string; basarili?: boolean }> {
  await yetkiGerekli();

  const parsed = AyarSemasi.safeParse(girdi);
  if (!parsed.success) return { hata: parsed.error.issues[0].message };
  const v = parsed.data;

  let wa: string | null = null;
  if (v.whatsappNumarasi?.trim()) {
    wa = telefonNormalize(v.whatsappNumarasi);
    if (!wa) {
      return {
        hata: "WhatsApp numarasını anlayamadım. 10 haneli olmalı — örnek: 0532 111 22 33",
      };
    }
  }

  const limit = v.kargoBedavaLimitMetni?.trim()
    ? fiyatAyristir(v.kargoBedavaLimitMetni)
    : null;
  if (v.kargoBedavaLimitMetni?.trim() && limit === null) {
    return { hata: "Bedava kargo limitini anlayamadım. Örnek: 750" };
  }

  const ucret = v.kargoUcretiMetni?.trim() ? fiyatAyristir(v.kargoUcretiMetni) : null;
  if (v.kargoUcretiMetni?.trim() && ucret === null) {
    return { hata: "Kargo ücretini anlayamadım. Örnek: 99" };
  }

  await db
    .insert(settings)
    .values({
      id: 1,
      siteAdi: v.siteAdi,
      siteSlogan: v.siteSlogan || null,
      whatsappNumarasi: wa,
      kargoBedavaAcik: v.kargoBedavaAcik,
      kargoBedavaLimit: limit?.toFixed(2) ?? null,
      kargoUcreti: ucret?.toFixed(2) ?? null,
      duyuruMetni: v.duyuruMetni || null,
      duyuruAcik: v.duyuruAcik,
      instagramUrl: v.instagramUrl || null,
      iletisimTelefon: v.iletisimTelefon || null,
      iletisimEmail: v.iletisimEmail || null,
      ticaretUnvani: v.ticaretUnvani || null,
      adres: v.adres || null,
      mersisNo: v.mersisNo || null,
      vergiDairesi: v.vergiDairesi || null,
      vergiNo: v.vergiNo || null,
      etbisDogrulamaUrl: v.etbisDogrulamaUrl || null,
      bildirimKanallari: { telegram: v.telegramAcik, email: v.epostaAcik },
      guncellendiAt: new Date(),
    })
    .onConflictDoUpdate({
      target: settings.id,
      set: {
        siteAdi: v.siteAdi,
        siteSlogan: v.siteSlogan || null,
        whatsappNumarasi: wa,
        kargoBedavaAcik: v.kargoBedavaAcik,
        kargoBedavaLimit: limit?.toFixed(2) ?? null,
        kargoUcreti: ucret?.toFixed(2) ?? null,
        duyuruMetni: v.duyuruMetni || null,
        duyuruAcik: v.duyuruAcik,
        instagramUrl: v.instagramUrl || null,
        iletisimTelefon: v.iletisimTelefon || null,
        iletisimEmail: v.iletisimEmail || null,
        ticaretUnvani: v.ticaretUnvani || null,
        adres: v.adres || null,
        mersisNo: v.mersisNo || null,
        vergiDairesi: v.vergiDairesi || null,
        vergiNo: v.vergiNo || null,
        etbisDogrulamaUrl: v.etbisDogrulamaUrl || null,
        bildirimKanallari: { telegram: v.telegramAcik, email: v.epostaAcik },
        guncellendiAt: new Date(),
      },
    });

  revalidatePath("/", "layout");
  revalidatePath("/panel/ayarlar");
  return { basarili: true };
}

/** Ayarlar ekranındaki "Test Et" butonu — bildirim kanallarını gerçekten dener. */
export async function bildirimTestEt(): Promise<{ mesaj: string }> {
  await yetkiGerekli();
  const { siparisBildir } = await import("@/lib/notify");
  const [satir] = await db.select().from(settings).where(eq(settings.id, 1));

  await siparisBildir(
    {
      siparisNo: "TEST-000000",
      musteriAdi: "Test Müşteri",
      telefon: "+90 500 000 00 00",
      il: "İstanbul",
      ilce: "Kadıköy",
      toplam: 1,
      kalemSayisi: 1,
      satirlar: [{ baslik: "Bildirim testi", adet: 1 }],
      siparisUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    },
    satir?.bildirimKanallari ?? {},
  );

  const telegramVar = Boolean(
    process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID,
  );
  return {
    mesaj: telegramVar
      ? "Test bildirimi gönderildi. Telefonuna düştü mü?"
      : "Telegram ayarlanmamış. TELEGRAM_BOT_TOKEN ve TELEGRAM_CHAT_ID gerekiyor.",
  };
}
