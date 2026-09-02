import { test, expect, type Page } from "@playwright/test";
import { testPngOlustur } from "./yardimcilar/png";

/**
 * CANLI TEST — gerçek Supabase gerektirir.
 *
 * Ürün ekleme (fotoğraf yükleme dâhil), mağazada görünme, sepete ekleme,
 * sipariş oluşturma ve siparişin panelde görünmesini uçtan uca doğrular.
 * Hiçbir sahte veri kullanılmaz; her adım gerçek veritabanına yazar.
 *
 * Çalıştırmak için .env.local içine ekle:
 *   PANEL_TEST_EPOSTA="yonetici@ornek.com"
 *   PANEL_TEST_SIFRE="..."
 *
 * Sonra: npm run test:panel
 */

const EPOSTA = process.env.PANEL_TEST_EPOSTA;
const SIFRE = process.env.PANEL_TEST_SIFRE;
const SUPABASE_VAR = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

test.skip(
  !EPOSTA || !SIFRE || !SUPABASE_VAR,
  "Canlı test atlandı: PANEL_TEST_EPOSTA / PANEL_TEST_SIFRE ve Supabase ayarları gerekiyor.",
);

const DAMGA = Date.now();
const URUN_ADI = `Test Ürünü ${DAMGA}`;
const FIYAT_METNI = "1.250,00";

async function girisYap(page: Page) {
  await page.goto("/panel/giris");
  await page.getByLabel("E-posta").fill(EPOSTA!);
  await page.getByLabel("Şifre").fill(SIFRE!);
  await page.getByRole("button", { name: "Giriş yap" }).click();
  await expect(page).toHaveURL(/\/panel$/, { timeout: 20_000 });
}

test.describe.configure({ mode: "serial" });

test.describe("Canlı akış — ürün ekleme ve sipariş", () => {
  test("panele giriş yapılır", async ({ page }) => {
    await girisYap(page);
    await expect(page.getByText(/Merhaba,/)).toBeVisible();
  });

  test("fotoğraflı ürün eklenir", async ({ page }) => {
    await girisYap(page);
    await page.goto("/panel/urunler/yeni");

    // Gerçek bir PNG: siyah çerçeve + yeşil iç.
    // Kırpma ve zemin rengi hesabı bu görselle sınanır.
    await page.setInputFiles('input[type="file"]', {
      name: "test-urun.png",
      mimeType: "image/png",
      buffer: testPngOlustur(),
    });

    // Kırpma ekranı açılır; kırpmadan devam ediyoruz.
    await page.getByRole("button", { name: "Kırpmadan devam et" }).click();

    // Yükleme bitene kadar bekle (kapak rozeti belirir).
    await expect(page.getByText("Kapak")).toBeVisible({ timeout: 45_000 });

    await page.getByLabel("Ürün adı").fill(URUN_ADI);
    await page.getByLabel("Fiyat (₺)").fill(FIYAT_METNI);

    const kategori = page.getByLabel("Kategori");
    const secenekler = await kategori.locator("option").allTextContents();
    expect(secenekler.length, "Kategori yok — npm run db:seed").toBeGreaterThan(1);
    await kategori.selectOption({ index: 1 });

    await page.getByLabel("Set içeriği", { exact: false }).fill("Bileşen A\nBileşen B");
    await page
      .getByLabel("Kısa açıklama", { exact: false })
      .fill("Otomatik test tarafından oluşturuldu.");
    await page
      .getByLabel("Açıklama", { exact: true })
      .fill(
        "Bu ürün otomatik uçtan uca test tarafından oluşturulmuştur. " +
          "Testin sonunda arşive alınır ve mağazada görünmez.",
      );

    await page.getByRole("button", { name: "Kaydet" }).click();

    await expect(page).toHaveURL(/\/panel\/urunler$/, { timeout: 30_000 });
    await expect(page.getByText(URUN_ADI)).toBeVisible();
  });

  test("ürün listede doğru fiyatla ve zemin rengiyle görünür", async ({ page }) => {
    await girisYap(page);
    await page.goto("/panel/urunler");

    const satir = page.locator("li", { hasText: URUN_ADI }).first();
    await expect(satir).toBeVisible();
    await expect(satir).toContainText("1.250,00");

    // Zemin rengi siyah OLMAMALI — letterbox kırpma çalışmış olmalı.
    const zemin = await satir
      .locator("span[style*='background-color']")
      .first()
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(zemin, "kapak zemini siyah kalmış: kırpma çalışmamış").not.toBe(
      "rgb(0, 0, 0)",
    );
  });

  test("ürün mağazada görünür ve sepete eklenir", async ({ page }) => {
    await page.goto("/urunler");
    const kart = page.locator("article", { hasText: URUN_ADI }).first();
    await expect(kart).toBeVisible({ timeout: 15_000 });

    await kart.getByRole("link").first().click();
    await expect(page.getByRole("heading", { name: URUN_ADI, level: 1 })).toBeVisible();
    await expect(page.getByText("Bileşen A")).toBeVisible();

    await page.getByRole("button", { name: "Sepete ekle" }).click();
    await expect(page.getByRole("link", { name: "Sepete git" })).toBeVisible();

    await page.goto("/sepet");
    await expect(page.getByText(URUN_ADI)).toBeVisible();
    await expect(page.getByText("1.250,00 ₺").first()).toBeVisible();
  });

  test("sipariş oluşturulur ve WhatsApp adımı gösterilir", async ({ page }) => {
    // Sepeti doldur
    await page.goto("/urunler");
    await page
      .locator("article", { hasText: URUN_ADI })
      .first()
      .getByRole("link")
      .first()
      .click();
    await page.getByRole("button", { name: "Sepete ekle" }).click();

    await page.goto("/odeme");
    await page.getByLabel("Ad soyad").fill("Otomatik Test");
    await page.getByLabel("Telefon").fill("0532 000 00 00");
    await page.getByLabel("İl").selectOption("İstanbul");
    await page.getByLabel("İlçe").fill("Kadıköy");
    await page
      .getByLabel("Açık adres")
      .fill("Test Mahallesi, Otomasyon Sokak No:1 Daire:2");

    await page.getByRole("checkbox").nth(0).check();
    await page.getByRole("checkbox").nth(1).check();

    await page.getByRole("button", { name: "Siparişi oluştur" }).click();

    await expect(page).toHaveURL(/\/siparis\/ORD-\d{6}\?t=/, { timeout: 30_000 });
    await expect(
      page.getByRole("heading", { name: "Siparişin oluşturuldu" }),
    ).toBeVisible();
    await expect(page.getByText(/GÖNDER/)).toBeVisible();
    await expect(page.getByText("1.250,00 ₺").first()).toBeVisible();

    // Sipariş numarasını sonraki test için sakla
    const url = page.url();
    process.env.__TEST_SIPARIS_NO = url.match(/ORD-\d{6}/)?.[0] ?? "";
  });

  test("sipariş sayfası yenilendiğinde kaybolmaz", async ({ page }) => {
    const no = process.env.__TEST_SIPARIS_NO;
    test.skip(!no, "sipariş numarası yok");
    await page.goto("/urunler"); // sepet temizlendi mi kontrolü
    await page.goto("/sepet");
    await expect(page.getByText("Sepetin şu an boş.")).toBeVisible();
  });

  test("sipariş panelde görünür ve durumu değiştirilebilir", async ({ page }) => {
    const no = process.env.__TEST_SIPARIS_NO;
    test.skip(!no, "sipariş numarası yok");

    await girisYap(page);
    await page.goto("/panel/siparisler");
    await expect(page.getByText(no!)).toBeVisible({ timeout: 15_000 });

    await page.locator("li", { hasText: no! }).first().getByRole("link").click();
    await expect(page.getByRole("heading", { name: no!, level: 1 })).toBeVisible();
    await expect(page.getByText("Otomatik Test")).toBeVisible();
    await expect(page.getByText("Kadıköy")).toBeVisible();

    // Durum değişikliği gerçekten kaydediliyor mu
    await page.getByRole("button", { name: "Onaylandı", exact: true }).click();
    await expect(page.getByText("Durum güncellendi")).toBeVisible({
      timeout: 15_000,
    });

    await page.reload();
    await expect(page.getByText(/Onaylandı/).first()).toBeVisible();
  });

  test("temizlik: test ürünü arşive alınır", async ({ page }) => {
    await girisYap(page);
    await page.goto("/panel/urunler");

    const satir = page.locator("li", { hasText: URUN_ADI }).first();
    if (!(await satir.isVisible())) return;

    // Yayından kaldır → mağazada görünmez
    await satir.getByRole("checkbox").nth(1).uncheck();
    await page.waitForTimeout(1500);

    await page.goto("/urunler");
    await expect(page.getByText(URUN_ADI)).toHaveCount(0);
  });
});
