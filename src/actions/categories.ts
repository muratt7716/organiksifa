"use server";

import { revalidatePath } from "next/cache";
import { asc, eq, desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { benzersizSlug } from "@/lib/slug";
import { yetkiGerekli } from "./auth";

export type Kategori = typeof categories.$inferSelect;

const AdSemasi = z
  .string()
  .trim()
  .min(2, "Kategori adı en az 2 harf olmalı")
  .max(60, "Kategori adı çok uzun");

export async function kategorileriGetir(): Promise<Kategori[]> {
  try {
    return await db
      .select()
      .from(categories)
      .orderBy(asc(categories.sira), asc(categories.ad));
  } catch {
    return [];
  }
}

export async function kategoriEkle(_prev: { hata?: string }, formData: FormData) {
  await yetkiGerekli();
  const parsed = AdSemasi.safeParse(formData.get("ad"));
  if (!parsed.success) return { hata: parsed.error.issues[0].message };

  const mevcut = await db.select({ slug: categories.slug }).from(categories);
  const [enSon] = await db
    .select({ sira: categories.sira })
    .from(categories)
    .orderBy(desc(categories.sira))
    .limit(1);

  await db.insert(categories).values({
    ad: parsed.data,
    slug: benzersizSlug(
      parsed.data,
      mevcut.map((k) => k.slug),
    ),
    sira: (enSon?.sira ?? 0) + 10,
  });

  revalidatePath("/panel/kategoriler");
  revalidatePath("/", "layout");
  return {};
}

export async function kategoriGuncelle(id: string, ad: string) {
  await yetkiGerekli();
  const parsed = AdSemasi.safeParse(ad);
  if (!parsed.success) return { hata: parsed.error.issues[0].message };

  await db.update(categories).set({ ad: parsed.data }).where(eq(categories.id, id));
  revalidatePath("/panel/kategoriler");
  revalidatePath("/", "layout");
  return {};
}

export async function kategoriAktiflikDegistir(id: string, aktif: boolean) {
  await yetkiGerekli();
  await db.update(categories).set({ aktif }).where(eq(categories.id, id));
  revalidatePath("/panel/kategoriler");
  revalidatePath("/", "layout");
}
