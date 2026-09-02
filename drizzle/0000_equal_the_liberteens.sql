CREATE TABLE "brands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ad" text NOT NULL,
	"slug" text NOT NULL,
	"aktif" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ad" text NOT NULL,
	"slug" text NOT NULL,
	"aciklama" text,
	"sira" integer DEFAULT 0 NOT NULL,
	"aktif" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_images" (
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
--> statement-breakpoint
CREATE TABLE "products" (
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
--> statement-breakpoint
CREATE TABLE "order_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"siparis_id" uuid NOT NULL,
	"tip" text NOT NULL,
	"eski_deger" text,
	"yeni_deger" text,
	"aktor_adi" text,
	"not" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
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
--> statement-breakpoint
CREATE TABLE "orders" (
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
--> statement-breakpoint
CREATE TABLE "reviews" (
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
--> statement-breakpoint
CREATE TABLE "admin_profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ad" text NOT NULL,
	"rol" text DEFAULT 'staff' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"anahtar" text PRIMARY KEY NOT NULL,
	"sayac" integer DEFAULT 0 NOT NULL,
	"pencere_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
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
--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_urun_id_products_id_fk" FOREIGN KEY ("urun_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_kategori_id_categories_id_fk" FOREIGN KEY ("kategori_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_marka_id_brands_id_fk" FOREIGN KEY ("marka_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_events" ADD CONSTRAINT "order_events_siparis_id_orders_id_fk" FOREIGN KEY ("siparis_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_siparis_id_orders_id_fk" FOREIGN KEY ("siparis_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_urun_id_products_id_fk" FOREIGN KEY ("urun_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_urun_id_products_id_fk" FOREIGN KEY ("urun_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_siparis_id_orders_id_fk" FOREIGN KEY ("siparis_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "brands_slug_idx" ON "brands" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "product_images_urun_idx" ON "product_images" USING btree ("urun_id","sira");--> statement-breakpoint
CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "products_kategori_idx" ON "products" USING btree ("kategori_id");--> statement-breakpoint
CREATE INDEX "products_yayin_idx" ON "products" USING btree ("yayinda","sira");--> statement-breakpoint
CREATE INDEX "order_events_siparis_idx" ON "order_events" USING btree ("siparis_id","created_at");--> statement-breakpoint
CREATE INDEX "order_items_siparis_idx" ON "order_items" USING btree ("siparis_id");--> statement-breakpoint
CREATE UNIQUE INDEX "orders_siparis_no_idx" ON "orders" USING btree ("siparis_no");--> statement-breakpoint
CREATE UNIQUE INDEX "orders_idempotency_idx" ON "orders" USING btree ("idempotency_key");--> statement-breakpoint
CREATE INDEX "orders_telefon_idx" ON "orders" USING btree ("telefon_e164");--> statement-breakpoint
CREATE INDEX "orders_durum_idx" ON "orders" USING btree ("durum","created_at");--> statement-breakpoint
CREATE INDEX "reviews_urun_durum_idx" ON "reviews" USING btree ("urun_id","durum");--> statement-breakpoint
CREATE INDEX "reviews_durum_idx" ON "reviews" USING btree ("durum","created_at");