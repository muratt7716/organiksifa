import imageCompression from "browser-image-compression";
import {
  tekRenkKenarlariKirp,
  zeminRengi,
  type Kutu,
  type Pikseller,
} from "./image-analysis";

export type HazirGorsel = {
  blob: Blob;
  genislik: number;
  yukseklik: number;
  zeminRengi: string;
  onizlemeUrl: string;
};

const HEIC = /\.(heic|heif)$/i;

async function tuvaleCiz(
  file: File | Blob,
): Promise<{ canvas: HTMLCanvasElement; px: Pikseller }> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Tarayıcı görseli işleyemedi.");
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return {
    canvas,
    px: { data: imageData.data, width: canvas.width, height: canvas.height },
  };
}

/**
 * Görseli panelde kullanılabilir hale getirir:
 * HEIC kontrolü → (varsa) kullanıcı kırpması → letterbox temizliği →
 * zemin rengi ölçümü → WebP sıkıştırma.
 *
 * Sıkıştırma TARAYICIDA yapılır; sunucuya ~180 KB gider. Ham 5 MB'lık bir
 * WhatsApp görselini sunucuda işlemek hem yavaş hem kota yakıcıdır.
 */
export async function gorseliHazirla(
  file: File,
  kirpma?: Kutu,
): Promise<HazirGorsel> {
  if (
    HEIC.test(file.name) ||
    file.type === "image/heic" ||
    file.type === "image/heif"
  ) {
    throw new Error(
      "Bu fotoğraf iPhone HEIC biçiminde ve tarayıcı açamıyor. " +
        "Telefonda Ayarlar → Kamera → Biçimler → 'En Uyumlu' seçip tekrar çek, " +
        "ya da fotoğrafı WhatsApp'tan kendine gönderip oradan indir.",
    );
  }

  const { canvas, px } = await tuvaleCiz(file);

  const kutu = kirpma ?? tekRenkKenarlariKirp(px);
  const renk = zeminRengi(px, kutu);

  const hedef = document.createElement("canvas");
  hedef.width = kutu.w;
  hedef.height = kutu.h;
  const hctx = hedef.getContext("2d");
  if (!hctx) throw new Error("Tarayıcı görseli işleyemedi.");
  hctx.drawImage(canvas, kutu.x, kutu.y, kutu.w, kutu.h, 0, 0, kutu.w, kutu.h);

  const ham: Blob = await new Promise((res, rej) =>
    hedef.toBlob(
      (b) => (b ? res(b) : rej(new Error("Görsel işlenemedi"))),
      "image/webp",
      0.92,
    ),
  );

  const sikistirilmis = await imageCompression(
    new File([ham], "gorsel.webp", { type: "image/webp" }),
    {
      maxSizeMB: 0.25,
      maxWidthOrHeight: 1600,
      fileType: "image/webp",
      useWebWorker: true,
    },
  );

  return {
    blob: sikistirilmis,
    genislik: kutu.w,
    yukseklik: kutu.h,
    zeminRengi: renk,
    onizlemeUrl: URL.createObjectURL(sikistirilmis),
  };
}

/** Kırpma ekranı için görselin gerçek boyutunu okur. */
export async function boyutOku(file: File): Promise<{ w: number; h: number }> {
  const bitmap = await createImageBitmap(file);
  const boyut = { w: bitmap.width, h: bitmap.height };
  bitmap.close();
  return boyut;
}
