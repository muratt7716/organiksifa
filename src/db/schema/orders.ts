import {
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  timestamp,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { products } from "./catalog";

export const SIPARIS_DURUMLARI = [
  "yeni",
  "goruseldi",
  "onaylandi",
  "kargoda",
  "teslim",
  "iptal",
] as const;
export type SiparisDurumu = (typeof SIPARIS_DURUMLARI)[number];

export const ODEME_DURUMLARI = ["bekliyor", "alindi", "kismi", "iade"] as const;
export type OdemeDurumu = (typeof ODEME_DURUMLARI)[number];

export const DURUM_ETIKET: Record<SiparisDurumu, string> = {
  yeni: "Yeni",
  goruseldi: "Görüşüldü",
  onaylandi: "Onaylandı",
  kargoda: "Kargoda",
  teslim: "Teslim edildi",
  iptal: "İptal",
};

export const ODEME_ETIKET: Record<OdemeDurumu, string> = {
  bekliyor: "Ödeme bekliyor",
  alindi: "Ödeme alındı",
  kismi: "Kısmi ödeme",
  iade: "İade edildi",
};

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    siparisNo: text("siparis_no").notNull(),
    // Sipariş sayfası kalıcı ve paylaşılabilir olsun diye.
    erisimToken: uuid("erisim_token").notNull().defaultRandom(),
    // F5 / çift submit koruması.
    idempotencyKey: uuid("idempotency_key").notNull(),

    musteriAdi: text("musteri_adi").notNull(),
    telefon: text("telefon").notNull(),
    telefonE164: text("telefon_e164").notNull(),
    email: text("email"),
    il: text("il").notNull(),
    ilce: text("ilce").notNull(),
    adres: text("adres").notNull(),
    not: text("not"),

    araToplam: numeric("ara_toplam", { precision: 10, scale: 2 }).notNull(),
    indirimTutari: numeric("indirim_tutari", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    indirimAciklamasi: text("indirim_aciklamasi"),
    kargoUcreti: numeric("kargo_ucreti", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    kargoKuraliSnapshot: text("kargo_kurali_snapshot"),
    toplamKdv: numeric("toplam_kdv", { precision: 10, scale: 2 }).notNull().default("0"),
    toplam: numeric("toplam", { precision: 10, scale: 2 }).notNull(),

    durum: text("durum").notNull().default("yeni"),
    iptalNedeni: text("iptal_nedeni"),

    // Ödeme, sipariş durumundan AYRI eksendir. Aynı enum'a karıştırmak
    // sonradan veri göçü gerektirir.
    odemeDurumu: text("odeme_durumu").notNull().default("bekliyor"),
    odemeYontemi: text("odeme_yontemi"),
    odenenTutar: numeric("odenen_tutar", { precision: 10, scale: 2 }),
    odemeAt: timestamp("odeme_at", { withTimezone: true }),

    kargoFirmasi: text("kargo_firmasi"),
    kargoTakipNo: text("kargo_takip_no"),
    kargoyaVerildiAt: timestamp("kargoya_verildi_at", { withTimezone: true }),

    whatsappTiklama: integer("whatsapp_tiklama").notNull().default(0),
    whatsappSonTiklamaAt: timestamp("whatsapp_son_tiklama_at", { withTimezone: true }),

    mesafeliSozlesmeOnayAt: timestamp("mesafeli_sozlesme_onay_at", { withTimezone: true }),
    kvkkOnayAt: timestamp("kvkk_onay_at", { withTimezone: true }),
    ticariIletiIzni: boolean("ticari_ileti_izni").notNull().default(false),
    ip: text("ip"),
    userAgent: text("user_agent"),
    adminNotu: text("admin_notu"),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("orders_siparis_no_idx").on(t.siparisNo),
    uniqueIndex("orders_idempotency_idx").on(t.idempotencyKey),
    index("orders_telefon_idx").on(t.telefonE164),
    index("orders_durum_idx").on(t.durum, t.createdAt),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    siparisId: uuid("siparis_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    urunId: uuid("urun_id").references(() => products.id, { onDelete: "set null" }),

    // Snapshot: ürün fiyatı sonradan değişse bile geçmiş siparişler değişmez.
    baslikSnapshot: text("baslik_snapshot").notNull(),
    slugSnapshot: text("slug_snapshot").notNull(),
    gorselSnapshot: text("gorsel_snapshot"),
    birimFiyat: numeric("birim_fiyat", { precision: 10, scale: 2 }).notNull(),
    kdvOraniSnapshot: numeric("kdv_orani_snapshot", { precision: 4, scale: 2 }),

    adet: integer("adet").notNull(),
    satirToplam: numeric("satir_toplam", { precision: 10, scale: 2 }).notNull(),
  },
  (t) => [index("order_items_siparis_idx").on(t.siparisId)],
);

export const orderEvents = pgTable(
  "order_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    siparisId: uuid("siparis_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    tip: text("tip").notNull(),
    eskiDeger: text("eski_deger"),
    yeniDeger: text("yeni_deger"),
    aktorAdi: text("aktor_adi"),
    not: text("not"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("order_events_siparis_idx").on(t.siparisId, t.createdAt)],
);
