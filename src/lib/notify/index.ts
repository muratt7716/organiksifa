import { fiyatBicimle } from "../price";

export type YeniSiparisOlayi = {
  siparisNo: string;
  musteriAdi: string;
  telefon: string;
  il: string;
  ilce: string;
  toplam: number;
  kalemSayisi: number;
  satirlar: { baslik: string; adet: number }[];
  siparisUrl: string;
};

export interface NotificationChannel {
  ad: string;
  aktifMi(): boolean;
  gonder(olay: YeniSiparisOlayi): Promise<void>;
}

export function olayMetni(o: YeniSiparisOlayi): string {
  return [
    `🛒 YENİ SİPARİŞ — ${o.siparisNo}`,
    "",
    `${o.musteriAdi}`,
    `${o.telefon}`,
    `${o.il} / ${o.ilce}`,
    "",
    ...o.satirlar.map((s) => `• ${s.baslik} x${s.adet}`),
    "",
    `TOPLAM: ${fiyatBicimle(o.toplam)}`,
    "",
    o.siparisUrl,
  ].join("\n");
}

/* ------------------------- Telegram ------------------------- */

class TelegramKanali implements NotificationChannel {
  ad = "telegram";

  aktifMi() {
    return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
  }

  async gonder(olay: YeniSiparisOlayi) {
    const token = process.env.TELEGRAM_BOT_TOKEN!;
    const chatId = process.env.TELEGRAM_CHAT_ID!;
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: olayMetni(olay),
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) throw new Error(`Telegram ${res.status}`);
  }
}

/* ------------------------- E-posta -------------------------
 * Resend doğrulanmış alan adı ister; *.vercel.app üzerinde ÇALIŞMAZ.
 * Domain alınana kadar kapalı kalır.
 * ----------------------------------------------------------- */

class EpostaKanali implements NotificationChannel {
  ad = "email";

  aktifMi() {
    return Boolean(process.env.RESEND_API_KEY && process.env.BILDIRIM_EPOSTA);
  }

  async gonder(olay: YeniSiparisOlayi) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Organik Şifa <siparis@resend.dev>",
        to: [process.env.BILDIRIM_EPOSTA],
        subject: `Yeni sipariş — ${olay.siparisNo} · ${fiyatBicimle(olay.toplam)}`,
        text: olayMetni(olay),
      }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}`);
  }
}

/* ------------------------- Konsol (geliştirme) ------------------------- */

class KonsolKanali implements NotificationChannel {
  ad = "konsol";
  aktifMi() {
    return process.env.NODE_ENV !== "production";
  }
  async gonder(olay: YeniSiparisOlayi) {
    console.log("\n" + olayMetni(olay) + "\n");
  }
}

const KANALLAR: NotificationChannel[] = [
  new TelegramKanali(),
  new EpostaKanali(),
  new KonsolKanali(),
];

/**
 * Bildirimi tüm açık kanallara gönderir.
 * ASLA hata fırlatmaz — bildirim çökse bile sipariş kaydı korunmalıdır.
 */
export async function siparisBildir(
  olay: YeniSiparisOlayi,
  acikKanallar: Record<string, boolean> = {},
): Promise<void> {
  const isler = KANALLAR.filter((k) => {
    if (k.ad === "konsol") return k.aktifMi();
    if (acikKanallar[k.ad] === false) return false;
    return k.aktifMi();
  }).map(async (k) => {
    try {
      await k.gonder(olay);
    } catch (e) {
      console.error(`[bildirim:${k.ad}] gönderilemedi`, e);
    }
  });

  await Promise.allSettled(isler);
}
