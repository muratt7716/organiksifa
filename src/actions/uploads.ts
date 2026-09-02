"use server";

import { supabaseServis } from "@/lib/supabase/server";
import { KOVA } from "@/lib/storage";
import { yetkiGerekli } from "./auth";

/**
 * Tarayıcının doğrudan Storage'a yüklemesi için tek kullanımlık imzalı URL üretir.
 * Dosya Vercel fonksiyonundan GEÇMEZ — hem hızlı hem kota dostu.
 *
 * NOT: Bu dosya "use server" olduğu için TÜM export'ları async fonksiyon
 * olmak zorundadır. Sabitler ve saf yardımcılar `@/lib/storage` içinde durur.
 */
export async function imzaliYuklemeUrlAl(uzanti = "webp") {
  await yetkiGerekli();
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${uzanti}`;
  const { data, error } = await supabaseServis()
    .storage.from(KOVA)
    .createSignedUploadUrl(path);

  if (error || !data) {
    throw new Error(
      "Yükleme adresi alınamadı. Supabase Storage'da 'urunler' kovası var mı?",
    );
  }
  return { path: data.path, token: data.token };
}

export async function depodanSil(paths: string[]) {
  await yetkiGerekli();
  if (paths.length === 0) return;
  await supabaseServis().storage.from(KOVA).remove(paths);
}
