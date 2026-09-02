import type { MetadataRoute } from "next";

const GIZLI = ["/panel", "/panel/", "/sepet", "/odeme", "/siparis/"];

/**
 * Yapay zekâ arama motorlarının tarayıcıları AÇIKÇA serbest bırakılır.
 *
 * Neden: ChatGPT, Perplexity, Claude ve Gemini yanıtlarında kaynak
 * gösterebilmek için siteyi tarayabilmelidir. Bu botlardan biri
 * engellenirse o platformda hiç görünmezsin — ve bu sessiz bir kayıptır.
 *
 * Panel, sepet, ödeme ve sipariş sayfaları hepsine kapalıdır.
 */
const YAPAY_ZEKA_BOTLARI = [
  "GPTBot", // OpenAI — ChatGPT eğitimi
  "OAI-SearchBot", // OpenAI — ChatGPT arama
  "ChatGPT-User", // OpenAI — kullanıcı isteğiyle sayfa açma
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot", // Anthropic
  "Claude-User",
  "Claude-SearchBot",
  "Google-Extended", // Gemini
  "Applebot-Extended",
  "meta-externalagent",
  "Bingbot",
  "cohere-ai",
  "MistralAI-User",
];

export default function robots(): MetadataRoute.Robots {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: GIZLI },
      ...YAPAY_ZEKA_BOTLARI.map((bot) => ({
        userAgent: bot,
        allow: "/",
        disallow: GIZLI,
      })),
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
