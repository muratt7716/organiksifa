"use server";

import { cache } from "react";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { supabaseSunucu } from "@/lib/supabase/server";
import { db } from "@/db";
import { adminProfiles } from "@/db/schema";
import { DEMO_MODU, DEMO_ADMIN } from "@/lib/demo";

const GirisSemasi = z.object({
  email: z.string().email("Geçerli bir e-posta adresi yaz"),
  sifre: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});

export type GirisDurumu = { hata?: string };

export async function girisYap(
  _prev: GirisDurumu,
  formData: FormData,
): Promise<GirisDurumu> {
  const parsed = GirisSemasi.safeParse({
    email: formData.get("email"),
    sifre: formData.get("sifre"),
  });
  if (!parsed.success) return { hata: parsed.error.issues[0].message };

  const supabase = await supabaseSunucu();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.sifre,
  });

  if (error) return { hata: "E-posta veya şifre hatalı. Tekrar dene." };
  redirect("/panel");
}

export async function cikisYap() {
  const supabase = await supabaseSunucu();
  await supabase.auth.signOut();
  redirect("/panel/giris");
}

export type Admin = { id: string; ad: string; rol: string };

/**
 * Oturumdaki yöneticiyi döner. İlk girişte profil kaydını kendiliğinden oluşturur.
 *
 * Supabase veya veritabanı yapılandırılmamışsa null döner (fail-closed):
 * yetkiyi doğrulayamadığımız durumda içeri almayız.
 */
export async function mevcutAdmin(): Promise<Admin | null> {
  return adminGetir();
}

/**
 * React cache(): aynı istek içinde kaç kez çağrılırsa çağrılsın
 * Supabase Auth'a YALNIZCA BİR ağ isteği yapılır.
 *
 * Bu olmadan panel yerleşimi, sayfa ve her Server Action ayrı ayrı
 * getUser() çağırıyordu — her biri Frankfurt'a gidiş-dönüş.
 */
const adminGetir = cache(async (): Promise<Admin | null> => {
  // Yerel demo: Supabase Auth yokken paneli görebilmek için.
  // Üretimde etkinleşmesi imkânsızdır (bkz. src/lib/demo.ts).
  if (DEMO_MODU) return { ...DEMO_ADMIN };

  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return null;
    }

    const supabase = await supabaseSunucu();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const [profil] = await db
      .select()
      .from(adminProfiles)
      .where(eq(adminProfiles.id, user.id));
    if (profil) return { id: profil.id, ad: profil.ad, rol: profil.rol };

    const [yeni] = await db
      .insert(adminProfiles)
      .values({
        id: user.id,
        ad: user.email?.split("@")[0] ?? "Yönetici",
        rol: "owner",
      })
      .returning();
    return { id: yeni.id, ad: yeni.ad, rol: yeni.rol };
  } catch (e) {
    console.error("[auth] yönetici doğrulanamadı", e);
    return null;
  }
});

/** Server Action'larda yetki kapısı. Yetki kontrolü TEK yerde toplanır. */
export async function yetkiGerekli(): Promise<Admin> {
  const admin = await mevcutAdmin();
  if (!admin) throw new Error("Oturumun kapanmış. Tekrar giriş yap.");
  return admin;
}
