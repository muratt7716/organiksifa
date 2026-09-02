import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { products } from "./catalog";
import { orders } from "./orders";

export const YORUM_DURUMLARI = ["bekliyor", "onayli", "reddedildi"] as const;
export type YorumDurumu = (typeof YORUM_DURUMLARI)[number];

/**
 * Moderasyon ZORUNLU: yorum onaylanmadan sitede görünmez.
 * Bu tek kural spam sorununu ortadan kaldırır — bot 500 yorum atsa
 * hiçbiri yayına çıkmaz, ablan bekleyen listede toplu siler.
 */
export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    urunId: uuid("urun_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    ad: text("ad").notNull(),
    puan: integer("puan").notNull(),
    yorum: text("yorum").notNull(),
    durum: text("durum").notNull().default("bekliyor"),

    // Sipariş sayfasından yazılan yorumlar otomatik "doğrulanmış alıcı" olur.
    siparisId: uuid("siparis_id").references(() => orders.id, { onDelete: "set null" }),
    dogrulanmisAlici: boolean("dogrulanmis_alici").notNull().default(false),

    saticiYaniti: text("satici_yaniti"),
    ip: text("ip"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    onayAt: timestamp("onay_at", { withTimezone: true }),
  },
  (t) => [
    index("reviews_urun_durum_idx").on(t.urunId, t.durum),
    index("reviews_durum_idx").on(t.durum, t.createdAt),
  ],
);
