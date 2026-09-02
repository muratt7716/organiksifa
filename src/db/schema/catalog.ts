import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  numeric,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ad: text("ad").notNull(),
    slug: text("slug").notNull(),
    aciklama: text("aciklama"),
    sira: integer("sira").notNull().default(0),
    aktif: boolean("aktif").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("categories_slug_idx").on(t.slug)],
);

export const brands = pgTable(
  "brands",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ad: text("ad").notNull(),
    slug: text("slug").notNull(),
    aktif: boolean("aktif").notNull().default(true),
  },
  (t) => [uniqueIndex("brands_slug_idx").on(t.slug)],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    baslik: text("baslik").notNull(),
    slug: text("slug").notNull(),
    kisaAciklama: text("kisa_aciklama"),
    aciklama: text("aciklama"),

    fiyat: numeric("fiyat", { precision: 10, scale: 2 }).notNull(),
    eskiFiyat: numeric("eski_fiyat", { precision: 10, scale: 2 }),
    kdvOrani: numeric("kdv_orani", { precision: 4, scale: 2 }),

    kategoriId: uuid("kategori_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    markaId: uuid("marka_id").references(() => brands.id, { onDelete: "set null" }),

    // Setler ayrı tablo değil — panel sadeliği için metin listesi.
    setIcerigi: text("set_icerigi").array(),
    // Varyanta geçilirse ilişki verisi hazır olsun diye sigorta alanı.
    varyantGrupId: text("varyant_grup_id"),

    stokta: boolean("stokta").notNull().default(true),
    yayinda: boolean("yayinda").notNull().default(true),
    oneCikan: boolean("one_cikan").notNull().default(false),
    kargoBedava: boolean("kargo_bedava").notNull().default(false),

    // Yorum onaylandığında güncellenir — katalogda toplama sorgusu çalıştırmamak için.
    ortalamaPuan: numeric("ortalama_puan", { precision: 2, scale: 1 }),
    yorumSayisi: integer("yorum_sayisi").notNull().default(0),

    sira: integer("sira").notNull().default(0),
    seoBaslik: text("seo_baslik"),
    seoAciklama: text("seo_aciklama"),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("products_slug_idx").on(t.slug),
    index("products_kategori_idx").on(t.kategoriId),
    index("products_yayin_idx").on(t.yayinda, t.sira),
  ],
);

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    urunId: uuid("urun_id").references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    storagePath: text("storage_path").notNull(),
    alt: text("alt").notNull().default(""),
    genislik: integer("genislik").notNull(),
    yukseklik: integer("yukseklik").notNull(),

    /**
     * Yükleme anında görselin kenarından ölçülen renk.
     * Kart, görseli KIRPMADAN (object-fit: contain) bu renkteki kare zeminin
     * ortasına yerleştirir. Böylece hangi oranda görsel yüklenirse yüklensin
     * katalog bozulmaz.
     */
    zeminRengi: text("zemin_rengi").notNull().default("#EDF1E8"),

    // kapak | galeri | infografik
    tur: text("tur").notNull().default("galeri"),
    yayinda: boolean("yayinda").notNull().default(true),
    sira: integer("sira").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("product_images_urun_idx").on(t.urunId, t.sira)],
);
