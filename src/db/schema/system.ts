import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  numeric,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

/** Tek satırlık ayar tablosu (id = 1). Panelden yönetilir. */
export const settings = pgTable("settings", {
  id: integer("id").primaryKey().default(1),

  siteAdi: text("site_adi").notNull().default("Organik Şifa"),
  siteSlogan: text("site_slogan").default("Doğadan gelen şifa, kapına kadar"),

  // E.164, sadece rakam: 905321112233
  // Yanlış biçim girilirse sitedeki TÜM WhatsApp bağlantıları sessizce ölür.
  whatsappNumarasi: text("whatsapp_numarasi"),
  whatsappSablon: text("whatsapp_sablon"),

  kargoBedavaAcik: boolean("kargo_bedava_acik").notNull().default(true),
  kargoBedavaLimit: numeric("kargo_bedava_limit", { precision: 10, scale: 2 }).default(
    "750.00",
  ),
  kargoUcreti: numeric("kargo_ucreti", { precision: 10, scale: 2 }).default("99.00"),
  varsayilanKdv: numeric("varsayilan_kdv", { precision: 4, scale: 2 }).default("0"),

  duyuruMetni: text("duyuru_metni"),
  duyuruAcik: boolean("duyuru_acik").notNull().default(false),

  instagramUrl: text("instagram_url"),
  iletisimTelefon: text("iletisim_telefon"),
  iletisimEmail: text("iletisim_email"),

  // Yayın öncesi doldurulur; tüm yasal sayfalara otomatik işler.
  ticaretUnvani: text("ticaret_unvani"),
  adres: text("adres"),
  mersisNo: text("mersis_no"),
  vergiDairesi: text("vergi_dairesi"),
  vergiNo: text("vergi_no"),
  etbisDogrulamaUrl: text("etbis_dogrulama_url"),

  bildirimKanallari: jsonb("bildirim_kanallari")
    .$type<Record<string, boolean>>()
    .default({ telegram: true, email: false }),

  guncellendiAt: timestamp("guncellendi_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Bot bir gecede 10.000 sahte sipariş atarsa panel kullanılamaz hale gelir. */
export const rateLimits = pgTable("rate_limits", {
  anahtar: text("anahtar").primaryKey(),
  sayac: integer("sayac").notNull().default(0),
  pencereAt: timestamp("pencere_at", { withTimezone: true }).notNull().defaultNow(),
});

export const adminProfiles = pgTable("admin_profiles", {
  id: uuid("id").primaryKey(),
  ad: text("ad").notNull(),
  rol: text("rol").notNull().default("staff"), // owner | staff
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
