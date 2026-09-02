-- =============================================================================
-- ORGANİK ŞİFA — SUPABASE KURULUM
-- =============================================================================
-- Supabase panelinde SQL Editor'ı aç, bu dosyanın TAMAMINI yapıştır ve çalıştır.
-- Tekrar çalıştırmak güvenlidir (her şey IF NOT EXISTS / ON CONFLICT ile yazıldı).
--
-- Bu dosya şunları yapar:
--   1. 11 tabloyu oluşturur
--   2. İlişkileri ve indeksleri kurar
--   3. Sipariş numarası üretecini kurar
--   4. RLS'i açar (GÜVENLİK — açıklaması aşağıda)
--   5. Başlangıç verisini (ayarlar + 6 kategori) ekler
-- =============================================================================


-- =============================================================================
-- 1. TABLOLAR
-- =============================================================================

CREATE TABLE IF NOT EXISTS "brands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ad" text NOT NULL,
	"slug" text NOT NULL,
	"aktif" boolean DEFAULT true NOT NULL
);

CREATE TABLE IF NOT EXISTS "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ad" text NOT NULL,
	"slug" text NOT NULL,
	"aciklama" text,
	"sira" integer DEFAULT 0 NOT NULL,
	"aktif" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"baslik" text NOT NULL,
	"slug" text NOT NULL,
	"kisa_aciklama" text,
	"aciklama" text,
	"fiyat" numeric(10, 2) NOT NULL,
	"eski_fiyat" numeric(10, 2),
	"kdv_orani" numeric(4, 2),
	"kategori_id" uuid,
	"marka_id" uuid,
	"set_icerigi" text[],
	"varyant_grup_id" text,
	"stokta" boolean DEFAULT true NOT NULL,
	"yayinda" boolean DEFAULT true NOT NULL,
	"one_cikan" boolean DEFAULT false NOT NULL,
	"kargo_bedava" boolean DEFAULT false NOT NULL,
	"ortalama_puan" numeric(2, 1),
	"yorum_sayisi" integer DEFAULT 0 NOT NULL,
	"sira" integer DEFAULT 0 NOT NULL,
	"seo_baslik" text,
	"seo_aciklama" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- zemin_rengi: yükleme anında görselin kenarından ölçülen renk.
-- Ürün kartı görseli KIRPMADAN bu renkteki kare zeminin ortasına koyar;
-- böylece hangi oranda görsel yüklenirse yüklensin katalog bozulmaz.
CREATE TABLE IF NOT EXISTS "product_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"urun_id" uuid,
	"url" text NOT NULL,
	"storage_path" text NOT NULL,
	"alt" text DEFAULT '' NOT NULL,
	"genislik" integer NOT NULL,
	"yukseklik" integer NOT NULL,
	"zemin_rengi" text DEFAULT '#EDF1E8' NOT NULL,
	"tur" text DEFAULT 'galeri' NOT NULL,
	"yayinda" boolean DEFAULT true NOT NULL,
	"sira" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- odeme_durumu, siparis durumundan AYRI eksendir.
-- Aynı alana karıştırmak sanal POS'a geçerken veri göçü gerektirir.
CREATE TABLE IF NOT EXISTS "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"siparis_no" text NOT NULL,
	"erisim_token" uuid DEFAULT gen_random_uuid() NOT NULL,
	"idempotency_key" uuid NOT NULL,
	"musteri_adi" text NOT NULL,
	"telefon" text NOT NULL,
	"telefon_e164" text NOT NULL,
	"email" text,
	"il" text NOT NULL,
	"ilce" text NOT NULL,
	"adres" text NOT NULL,
	"not" text,
	"ara_toplam" numeric(10, 2) NOT NULL,
	"indirim_tutari" numeric(10, 2) DEFAULT '0' NOT NULL,
	"indirim_aciklamasi" text,
	"kargo_ucreti" numeric(10, 2) DEFAULT '0' NOT NULL,
	"kargo_kurali_snapshot" text,
	"toplam_kdv" numeric(10, 2) DEFAULT '0' NOT NULL,
	"toplam" numeric(10, 2) NOT NULL,
	"durum" text DEFAULT 'yeni' NOT NULL,
	"iptal_nedeni" text,
	"odeme_durumu" text DEFAULT 'bekliyor' NOT NULL,
	"odeme_yontemi" text,
	"odenen_tutar" numeric(10, 2),
	"odeme_at" timestamp with time zone,
	"kargo_firmasi" text,
	"kargo_takip_no" text,
	"kargoya_verildi_at" timestamp with time zone,
	"whatsapp_tiklama" integer DEFAULT 0 NOT NULL,
	"whatsapp_son_tiklama_at" timestamp with time zone,
	"mesafeli_sozlesme_onay_at" timestamp with time zone,
	"kvkk_onay_at" timestamp with time zone,
	"ticari_ileti_izni" boolean DEFAULT false NOT NULL,
	"ip" text,
	"user_agent" text,
	"admin_notu" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Snapshot alanları: ürün fiyatı sonradan değişse bile geçmiş siparişler değişmez.
CREATE TABLE IF NOT EXISTS "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"siparis_id" uuid NOT NULL,
	"urun_id" uuid,
	"baslik_snapshot" text NOT NULL,
	"slug_snapshot" text NOT NULL,
	"gorsel_snapshot" text,
	"birim_fiyat" numeric(10, 2) NOT NULL,
	"kdv_orani_snapshot" numeric(4, 2),
	"adet" integer NOT NULL,
	"satir_toplam" numeric(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS "order_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"siparis_id" uuid NOT NULL,
	"tip" text NOT NULL,
	"eski_deger" text,
	"yeni_deger" text,
	"aktor_adi" text,
	"not" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"urun_id" uuid NOT NULL,
	"ad" text NOT NULL,
	"puan" integer NOT NULL,
	"yorum" text NOT NULL,
	"durum" text DEFAULT 'bekliyor' NOT NULL,
	"siparis_id" uuid,
	"dogrulanmis_alici" boolean DEFAULT false NOT NULL,
	"satici_yaniti" text,
	"ip" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"onay_at" timestamp with time zone
);

CREATE TABLE IF NOT EXISTS "admin_profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ad" text NOT NULL,
	"rol" text DEFAULT 'staff' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "rate_limits" (
	"anahtar" text PRIMARY KEY NOT NULL,
	"sayac" integer DEFAULT 0 NOT NULL,
	"pencere_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"site_adi" text DEFAULT 'Organik Şifa' NOT NULL,
	"site_slogan" text DEFAULT 'Doğadan gelen şifa, kapına kadar',
	"whatsapp_numarasi" text,
	"whatsapp_sablon" text,
	"kargo_bedava_acik" boolean DEFAULT true NOT NULL,
	"kargo_bedava_limit" numeric(10, 2) DEFAULT '750.00',
	"kargo_ucreti" numeric(10, 2) DEFAULT '99.00',
	"varsayilan_kdv" numeric(4, 2) DEFAULT '0',
	"duyuru_metni" text,
	"duyuru_acik" boolean DEFAULT false NOT NULL,
	"instagram_url" text,
	"iletisim_telefon" text,
	"iletisim_email" text,
	"ticaret_unvani" text,
	"adres" text,
	"mersis_no" text,
	"vergi_dairesi" text,
	"vergi_no" text,
	"etbis_dogrulama_url" text,
	"bildirim_kanallari" jsonb DEFAULT '{"telegram":true,"email":false}'::jsonb,
	"guncellendi_at" timestamp with time zone DEFAULT now() NOT NULL
);


-- =============================================================================
-- 2. İLİŞKİLER
-- =============================================================================

DO $$ BEGIN
	ALTER TABLE "product_images" ADD CONSTRAINT "product_images_urun_id_products_id_fk"
		FOREIGN KEY ("urun_id") REFERENCES "public"."products"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
	ALTER TABLE "products" ADD CONSTRAINT "products_kategori_id_categories_id_fk"
		FOREIGN KEY ("kategori_id") REFERENCES "public"."categories"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
	ALTER TABLE "products" ADD CONSTRAINT "products_marka_id_brands_id_fk"
		FOREIGN KEY ("marka_id") REFERENCES "public"."brands"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
	ALTER TABLE "order_items" ADD CONSTRAINT "order_items_siparis_id_orders_id_fk"
		FOREIGN KEY ("siparis_id") REFERENCES "public"."orders"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
	ALTER TABLE "order_items" ADD CONSTRAINT "order_items_urun_id_products_id_fk"
		FOREIGN KEY ("urun_id") REFERENCES "public"."products"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
	ALTER TABLE "order_events" ADD CONSTRAINT "order_events_siparis_id_orders_id_fk"
		FOREIGN KEY ("siparis_id") REFERENCES "public"."orders"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
	ALTER TABLE "reviews" ADD CONSTRAINT "reviews_urun_id_products_id_fk"
		FOREIGN KEY ("urun_id") REFERENCES "public"."products"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
	ALTER TABLE "reviews" ADD CONSTRAINT "reviews_siparis_id_orders_id_fk"
		FOREIGN KEY ("siparis_id") REFERENCES "public"."orders"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =============================================================================
-- 3. İNDEKSLER
-- =============================================================================

CREATE UNIQUE INDEX IF NOT EXISTS "brands_slug_idx"      ON "brands"      ("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "categories_slug_idx"  ON "categories"  ("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "products_slug_idx"    ON "products"    ("slug");
CREATE        INDEX IF NOT EXISTS "products_kategori_idx" ON "products"   ("kategori_id");
CREATE        INDEX IF NOT EXISTS "products_yayin_idx"   ON "products"    ("yayinda","sira");
CREATE        INDEX IF NOT EXISTS "product_images_urun_idx" ON "product_images" ("urun_id","sira");

CREATE UNIQUE INDEX IF NOT EXISTS "orders_siparis_no_idx"  ON "orders" ("siparis_no");
CREATE UNIQUE INDEX IF NOT EXISTS "orders_idempotency_idx" ON "orders" ("idempotency_key");
CREATE        INDEX IF NOT EXISTS "orders_telefon_idx"     ON "orders" ("telefon_e164");
CREATE        INDEX IF NOT EXISTS "orders_durum_idx"       ON "orders" ("durum","created_at");
CREATE        INDEX IF NOT EXISTS "order_items_siparis_idx"  ON "order_items"  ("siparis_id");
CREATE        INDEX IF NOT EXISTS "order_events_siparis_idx" ON "order_events" ("siparis_id","created_at");

CREATE INDEX IF NOT EXISTS "reviews_urun_durum_idx" ON "reviews" ("urun_id","durum");
CREATE INDEX IF NOT EXISTS "reviews_durum_idx"      ON "reviews" ("durum","created_at");


-- =============================================================================
-- 4. SİPARİŞ NUMARASI ÜRETECİ
-- =============================================================================
-- "Son siparişi bul, 1 ekle" mantığı aynı anda iki müşteri sipariş verdiğinde
-- AYNI numarayı üretir. Sequence bunu veritabanı düzeyinde garantiler.

CREATE SEQUENCE IF NOT EXISTS siparis_no_seq START 1;

CREATE OR REPLACE FUNCTION yeni_siparis_no() RETURNS text AS $$
  SELECT 'ORD-' || lpad(nextval('siparis_no_seq')::text, 6, '0');
$$ LANGUAGE sql VOLATILE;


-- =============================================================================
-- 5. GÜVENLİK — RLS  (BU BÖLÜMÜ ATLAMA)
-- =============================================================================
--
-- Supabase, public şemasındaki HER tabloyu otomatik olarak REST API'den yayınlar.
-- anon anahtarı ise tarayıcıda açıkta durur (NEXT_PUBLIC_...).
--
-- RLS açılmazsa siteyi ziyaret eden herkes şunu çağırıp tüm müşteri adlarını,
-- telefonlarını ve adreslerini indirebilir:
--     https://PROJEID.supabase.co/rest/v1/orders?select=*
--
-- Aşağıda RLS açılıyor ve HİÇBİR politika tanımlanmıyor.
-- Sonuç: anon ve authenticated rolleri hiçbir satır göremez.
--
-- Site ETKİLENMEZ: uygulama Drizzle ile postgres rolü üzerinden doğrudan
-- bağlanır ve bu rol RLS'i baypas eder.

ALTER TABLE "brands"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "categories"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "products"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_images"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "orders"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "order_items"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "order_events"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "reviews"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "admin_profiles"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "rate_limits"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "settings"        ENABLE ROW LEVEL SECURITY;

-- Ek güvenlik: REST API'ye açılan rollerden tablo yetkilerini de geri al.
-- (Roller yoksa sessizce geçilir — bu dosya yerel Postgres'te de çalışsın diye.)
DO $$ BEGIN
	IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
		REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
		REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
	END IF;
	IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
		REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;
		REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM authenticated;
	END IF;
END $$;


-- =============================================================================
-- 6. BAŞLANGIÇ VERİSİ
-- =============================================================================

INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (ad, slug, aciklama, sira) VALUES
  ('Setler',           'setler',          'Birlikte kullanılmak üzere hazırlanmış ürün setleri.', 10),
  ('Takviye Ürünler',  'takviye-urunler', 'Günlük destek için doğal takviye edici gıdalar.',      20),
  ('Cilt Bakımı',      'cilt-bakimi',     'Bitkisel özlerle hazırlanan krem ve merhemler.',       30),
  ('Bitkisel Yağlar',  'bitkisel-yaglar', 'Soğuk sıkım ve karışım bitkisel yağlar.',              40),
  ('Çay & Detoks',     'cay-detoks',      'Bitki çayları ve detoks destek ürünleri.',             50),
  ('Sabun & Temizlik', 'sabun-temizlik',  'El yapımı sabunlar ve doğal temizlik ürünleri.',       60)
ON CONFLICT (slug) DO NOTHING;


-- =============================================================================
-- BİTTİ — kontrol
-- =============================================================================
-- Aşağıdaki sorgu 11 satır dönmeli:
--   SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY 1;
--
-- Sipariş numarası üreteci çalışıyor mu:
--   SELECT yeni_siparis_no();     -->  ORD-000001
--
-- SIRADAKİ ADIMLAR (SQL değil, panelden):
--   1. Storage > New bucket > ad: urunler, PUBLIC: açık
--   2. Authentication > Users > Add user (Auto Confirm işaretli)
--   3. Projede: .env.local doldur, sonra `npm run dogrula`
-- =============================================================================
