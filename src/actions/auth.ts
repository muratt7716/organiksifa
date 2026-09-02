"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { supabaseSunucu } from "@/lib/supabase/server";
import { db } from "@/db";
import { adminProfiles } from "@/db/schema";
import { DEMO_MODU, DEMO_ADMIN } from "@/lib/demo";
import { sureli } from "@/lib/db-sure";

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

    // Gerçekten oturum yok — tek ve doğru yönlendirme burada olur.
    if (!user) return null;

    /**
     * Buradan sonrası yalnızca AD ve ROL okumasıdır — kimlik zaten
     * doğrulandı. Bu sorgu yavaşlarsa veya başarısız olursa kullanıcıyı
     * DIŞARI ATMAYIZ; adını e-postasından türetip içeri alırız.
     *
     * Aksi hâlde şu oluyordu: metadata sorgusu 6 sn'de zaman aşımına
     * uğruyor -> null dönüyor -> yerleşim "oturum yok" sanıp girise
     * atıyor -> giriş sayfası oturumu görüp geri atıyor. Üç serverless
     * çağrısı, ölçülen 8.2 sn ve kullanıcı yanlış sayfada.
     */
    const yedek: Admin = {
      id: user.id,
      ad: user.email?.split("@")[0] ?? "Yönetici",
      rol: "owner",
    };

    try {
      const [profil] = await sureli(
        db.select().from(adminProfiles).where(eq(adminProfiles.id, user.id)),
        4000,
      );
      if (profil) return { id: profil.id, ad: profil.ad, rol: profil.rol };

      const [yeni] = await sureli(
        db.insert(adminProfiles).values(yedek).returning(),
        4000,
      );
      return { id: yeni.id, ad: yeni.ad, rol: yeni.rol };
    } catch (e) {
      console.error("[auth] profil okunamadı, oturum korunuyor:", e);
      return yedek;
    }
  } catch (e) {
    console.error("[auth] yönetici doğrulanamadı", e);
    return null;
  }
}

/** Server Action'larda yetki kapısı. Yetki kontrolü TEK yerde toplanır. */
export async function yetkiGerekli(): Promise<Admin> {
  const admin = await mevcutAdmin();
  if (!admin) throw new Error("Oturumun kapanmış. Tekrar giriş yap.");
  return admin;
}
