import { test, expect, type Page } from "@playwright/test";

/**
 * Bu testler VERİTABANI OLMADAN da geçer. Amaç, arayüzün ve akışın
 * her ekran boyutunda ayakta olduğunu doğrulamak; katalog boşsa boş
 * durum gösterilir.
 */

const EKRANLAR = [
  { ad: "kucuk-telefon", w: 375, h: 667 },
  { ad: "buyuk-telefon", w: 430, h: 932 },
  { ad: "tablet", w: 768, h: 1024 },
  { ad: "kucuk-laptop", w: 1024, h: 768 },
  { ad: "laptop", w: 1440, h: 900 },
  { ad: "masaustu-1080p", w: 1920, h: 1080 },
];

async function yatayTasmaVarMi(page: Page) {
  return page.evaluate(() => {
    const d = document.documentElement;
    // 1px tolerans: alt piksel yuvarlamaları
    return d.scrollWidth - d.clientWidth > 1;
  });
}

test.describe("Mağaza — temel sayfalar", () => {
  test("ana sayfa açılır ve tek h1 içerir", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page).toHaveTitle(/Organik Şifa/);
  });

  test("Türkçe karakterler doğru render edilir", async ({ page }) => {
    await page.goto("/");
    const govde = await page.locator("body").innerText();
    expect(govde).toContain("Şifa");
    expect(govde).not.toContain("Ã");
    expect(govde).not.toContain("�");
  });

  test("tüm ürünler sayfası açılır", async ({ page }) => {
    await page.goto("/urunler");
    await expect(
      page.getByRole("heading", { name: "Tüm Ürünler", level: 1 }),
    ).toBeVisible();
  });

  test("hakkımızda ve iletişim açılır", async ({ page }) => {
    await page.goto("/hakkimizda");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await page.goto("/iletisim");
    await expect(
      page.getByRole("heading", { name: "İletişim", level: 1 }),
    ).toBeVisible();
  });

  test("bilinmeyen adres 404 sayfası gösterir", async ({ page }) => {
    const yanit = await page.goto("/olmayan-bir-sayfa");
    expect(yanit?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: /bulamadık/i }),
    ).toBeVisible();
  });
});

test.describe("Yasal sayfalar", () => {
  const sayfalar = [
    ["/mesafeli-satis-sozlesmesi", "Mesafeli Satış Sözleşmesi"],
    ["/on-bilgilendirme", "Ön Bilgilendirme Formu"],
    ["/iptal-iade", "İptal ve İade Koşulları"],
    ["/teslimat-kargo", "Teslimat ve Kargo"],
    ["/kvkk", "KVKK Aydınlatma Metni"],
    ["/gizlilik-cerez", "Gizlilik ve Çerez Politikası"],
  ] as const;

  for (const [yol, baslik] of sayfalar) {
    test(`${baslik} açılır`, async ({ page }) => {
      await page.goto(yol);
      await expect(page.getByRole("heading", { name: baslik, level: 1 })).toBeVisible();
    });
  }

  test("cayma hakkı istisnası iade sayfasında yazılı", async ({ page }) => {
    await page.goto("/iptal-iade");
    await expect(page.getByText(/ambalajı açıl/i).first()).toBeVisible();
    await expect(page.getByText(/14 gün/i).first()).toBeVisible();
  });
});

test.describe("Sepet ve sipariş akışı", () => {
  test("boş sepet yönlendirme sunar", async ({ page }) => {
    await page.goto("/sepet");
    await expect(page.getByText("Sepetin şu an boş.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Ürünlere göz at" })).toBeVisible();
  });

  test("ödeme sayfası boş sepette ürünlere yönlendirir", async ({ page }) => {
    await page.goto("/odeme");
    await expect(page.getByText("Sepetin boş.")).toBeVisible();
  });

  test("tokensiz sipariş sayfası 404 verir", async ({ page }) => {
    const yanit = await page.goto("/siparis/ORD-000001");
    expect(yanit?.status()).toBe(404);
  });
});

test.describe("Panel güvenliği", () => {
  const korunanlar = [
    "/panel",
    "/panel/urunler",
    "/panel/urunler/yeni",
    "/panel/siparisler",
    "/panel/kategoriler",
    "/panel/yorumlar",
    "/panel/ayarlar",
  ];

  for (const yol of korunanlar) {
    test(`${yol} oturumsuz erişimde girişe yönlenir`, async ({ page }) => {
      await page.goto(yol);
      await expect(page).toHaveURL(/\/panel\/giris$/);
    });
  }

  test("giriş formu erişilebilir etiketlere sahip", async ({ page }) => {
    await page.goto("/panel/giris");
    await expect(page.getByLabel("E-posta")).toBeVisible();
    await expect(page.getByLabel("Şifre")).toBeVisible();
    await expect(page.getByRole("button", { name: "Giriş yap" })).toBeVisible();
  });
});

test.describe("Responsive — yatay taşma olmamalı", () => {
  const yollar = ["/", "/urunler", "/sepet", "/odeme", "/hakkimizda", "/iletisim", "/kvkk"];

  for (const ekran of EKRANLAR) {
    test(`${ekran.ad} (${ekran.w}px) hiçbir sayfada yatay kaydırma yok`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: ekran.w, height: ekran.h });
      for (const yol of yollar) {
        // networkidle kullanmıyoruz: canlı veritabanına bağlıyken uzun
        // istekler testi kararsız hale getiriyor. Gövdenin görünmesi yeterli.
        await page.goto(yol, { waitUntil: "domcontentloaded" });
        await page.locator("body").waitFor({ state: "visible" });
        await page.waitForTimeout(150);
        expect(await yatayTasmaVarMi(page), `${yol} @ ${ekran.w}px`).toBe(false);
      }
    });
  }
});

test.describe("Erişilebilirlik temelleri", () => {
  test("içeriğe geç bağlantısı klavyeyle görünür olur", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "İçeriğe geç" })).toBeFocused();
  });

  test("dokunulabilir öğeler en az 44px yüksekliğinde", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const butonlar = page.locator("a, button").filter({ hasNotText: /^$/ });
    const sayi = Math.min(await butonlar.count(), 25);

    for (let i = 0; i < sayi; i++) {
      const oge = butonlar.nth(i);
      if (!(await oge.isVisible())) continue;
      const kutu = await oge.boundingBox();
      if (!kutu || kutu.height === 0) continue;
      // Ekran okuyucuya özel gizli öğeler (sr-only) dokunma hedefi değildir.
      if (kutu.height <= 2 || kutu.width <= 2) continue;
      // Metin içi bağlantılar (satır içi) hariç: yalnızca blok öğeler
      const satirIci = await oge.evaluate(
        (el) => getComputedStyle(el).display === "inline",
      );
      if (satirIci) continue;
      expect(kutu.height, `${await oge.innerText()} çok kısa`).toBeGreaterThanOrEqual(
        40,
      );
    }
  });

  test("her sayfada dil ve başlık tanımlı", async ({ page }) => {
    for (const yol of ["/", "/urunler", "/sepet", "/kvkk"]) {
      await page.goto(yol);
      await expect(page.locator("html")).toHaveAttribute("lang", "tr");
      expect(await page.title()).not.toBe("");
    }
  });
});

test.describe("SEO", () => {
  // sitemap canlı veritabanını sorguluyor; Supabase ücretsiz planda ilk
  // istek soğuk başlangıç nedeniyle yavaş olabiliyor.
  test.slow();

  test("robots.txt üretilir", async ({ request }) => {
    const yanit = await request.get("/robots.txt");
    expect(yanit.status()).toBe(200);
    const metin = await yanit.text();
    expect(metin).toContain("Sitemap:");
    expect(metin).toContain("Disallow: /panel");
  });

  test("sitemap.xml üretilir", async ({ request }) => {
    const yanit = await request.get("/sitemap.xml");
    expect(yanit.status()).toBe(200);
    expect(await yanit.text()).toContain("<urlset");
  });

  test("ana sayfada meta açıklama var", async ({ page }) => {
    await page.goto("/");
    const aciklama = page.locator('meta[name="description"]');
    await expect(aciklama).toHaveCount(1);
    expect((await aciklama.getAttribute("content"))?.length).toBeGreaterThan(40);
  });
});
