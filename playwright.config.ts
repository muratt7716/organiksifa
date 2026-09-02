import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

// Canlı panel testleri .env.local'daki Supabase bilgilerine ihtiyaç duyar.
dotenv.config({ path: ".env.local" });

const PORT = 3100;
const BASE = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Supabase ücretsiz planın bağlantı havuzu sınırlı; çok sayıda eşzamanlı
  // istek testleri kararsız hale getiriyor (sitede değil, test ortamında).
  workers: 3,
  retries: 1,
  reporter: [["list"]],

  use: {
    baseURL: BASE,
    trace: "on-first-retry",
    locale: "tr-TR",
    timezoneId: "Europe/Istanbul",
  },

  projects: [
    { name: "masaustu", use: { ...devices["Desktop Chrome"] } },
    { name: "mobil", use: { ...devices["Pixel 7"] } },
  ],

  webServer: {
    command: `npx next start -p ${PORT}`,
    url: BASE,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
