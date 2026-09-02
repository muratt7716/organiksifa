"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ImagePlus, Trash2, Star } from "lucide-react";
import { gorseliHazirla, boyutOku } from "@/lib/image-upload";
import { imzaliYuklemeUrlAl } from "@/actions/uploads";
import { genelUrl, KOVA } from "@/lib/storage";
import { ImageCropper } from "./ImageCropper";
import type { Kutu } from "@/lib/image-analysis";
import { cn } from "@/lib/utils";

export type GorselKaydi = {
  url: string;
  storagePath: string;
  genislik: number;
  yukseklik: number;
  zeminRengi: string;
  alt: string;
};

const anonIstemci = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://localhost",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "anon",
);

export function ImageUploader({
  value,
  onChange,
}: {
  value: GorselKaydi[];
  onChange: (g: GorselKaydi[]) => void;
}) {
  const [bekleyen, setBekleyen] = useState<{
    file: File;
    src: string;
    w: number;
    h: number;
  } | null>(null);
  const [ilerleme, setIlerleme] = useState<string>();
  const [hata, setHata] = useState<string>();

  async function dosyaSecildi(file: File) {
    setHata(undefined);
    try {
      const { w, h } = await boyutOku(file);
      setBekleyen({ file, src: URL.createObjectURL(file), w, h });
    } catch {
      setHata(
        "Bu dosyayı açamadım. iPhone HEIC biçimindeyse telefonda " +
          "Ayarlar → Kamera → Biçimler → 'En Uyumlu' seç.",
      );
    }
  }

  async function yukle(file: File, kirpma?: Kutu) {
    setBekleyen(null);
    try {
      setIlerleme("Fotoğraf hazırlanıyor…");
      const hazir = await gorseliHazirla(file, kirpma);

      setIlerleme("Yükleniyor…");
      const { path, token } = await imzaliYuklemeUrlAl();
      const { error } = await anonIstemci.storage
        .from(KOVA)
        .uploadToSignedUrl(path, token, hazir.blob, { contentType: "image/webp" });

      if (error) {
        throw new Error("Yükleme tamamlanamadı. İnternet bağlantını kontrol et.");
      }

      onChange([
        ...value,
        {
          url: genelUrl(path),
          storagePath: path,
          genislik: hazir.genislik,
          yukseklik: hazir.yukseklik,
          zeminRengi: hazir.zeminRengi,
          alt: "",
        },
      ]);
    } catch (e) {
      setHata(e instanceof Error ? e.message : "Fotoğraf yüklenemedi");
    } finally {
      setIlerleme(undefined);
    }
  }

  if (bekleyen) {
    return (
      <ImageCropper
        src={bekleyen.src}
        genislik={bekleyen.w}
        yukseklik={bekleyen.h}
        onTamam={(k) => yukle(bekleyen.file, k)}
        onAtla={() => yukle(bekleyen.file)}
      />
    );
  }

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <p className="text-sm bg-yesil-50 text-yesil-800 rounded-kontrol p-3">
          <strong>Kapak fotoğrafı</strong>, müşterinin katalogda gördüğü
          fotoğraftır. Uzun/dikey bir fotoğraf kapakta küçük kalır — kareye
          yakın bir fotoğrafın varsa onu kapak yap.
        </p>
      )}

      <ul className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {value.map((g, i) => (
          <li key={g.storagePath} className="relative">
            <div
              className={cn(
                "aspect-square rounded-gorsel overflow-hidden grid place-items-center",
                i === 0 ? "ring-2 ring-yesil-700" : "border border-notr-200",
              )}
              style={{ backgroundColor: g.zeminRengi }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.url}
                alt=""
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {i === 0 ? (
              <span
                className="absolute top-1 left-1 inline-flex items-center gap-1
                           text-[11px] bg-yesil-700 text-notr-0 px-1.5 py-0.5 rounded"
              >
                <Star size={10} aria-hidden="true" /> Kapak
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onChange([g, ...value.filter((_, j) => j !== i)])}
                className="absolute inset-x-1 bottom-1 inline-flex items-center justify-center
                           gap-1 min-h-[32px] text-[11px] bg-notr-0/95 rounded
                           cursor-pointer hover:bg-notr-0 transition-colors"
              >
                <Star size={11} aria-hidden="true" /> Kapak yap
              </button>
            )}

            <button
              type="button"
              aria-label={`${i + 1}. fotoğrafı kaldır`}
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="absolute -top-2 -right-2 size-9 grid place-items-center rounded-full
                         bg-notr-0 border border-notr-200 cursor-pointer shadow-sm"
            >
              <Trash2 size={15} className="text-hata" aria-hidden="true" />
            </button>
          </li>
        ))}

        <li>
          <label
            className="aspect-square rounded-gorsel border-2 border-dashed border-notr-200
                       grid place-items-center gap-1 cursor-pointer text-notr-600 text-xs
                       text-center p-2 hover:border-yesil-400 hover:bg-yesil-50 transition-colors"
          >
            <span className="grid place-items-center gap-1">
              <ImagePlus size={24} aria-hidden="true" />
              <span>Fotoğraf ekle</span>
            </span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) dosyaSecildi(f);
                e.target.value = "";
              }}
            />
          </label>
        </li>
      </ul>

      {ilerleme && (
        <p className="text-sm text-notr-600" aria-live="polite">
          {ilerleme}
        </p>
      )}
      {hata && (
        <p role="alert" className="text-sm text-hata bg-hata-zemin rounded-kontrol p-2">
          {hata}
        </p>
      )}
      <p className="text-xs text-notr-400">
        Fotoğraflar yüklenirken otomatik olarak WebP biçimine çevrilip
        küçültülür (yaklaşık 5 MB → 200 KB). Büyük dosya yüklemekten çekinme.
      </p>
    </div>
  );
}
