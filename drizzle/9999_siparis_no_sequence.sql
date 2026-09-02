-- Sipariş numarası üreteci
--
-- Neden sequence: "son siparişi bul, 1 ekle" mantığı aynı anda iki müşteri
-- sipariş verdiğinde AYNI numarayı üretir. Sequence bunu veritabanı düzeyinde
-- garantiler.
--
-- Bu dosya drizzle-kit tarafından üretilmedi; migration'lardan SONRA
-- Supabase SQL Editor'da bir kez çalıştırılmalıdır.

CREATE SEQUENCE IF NOT EXISTS siparis_no_seq START 1;

CREATE OR REPLACE FUNCTION yeni_siparis_no() RETURNS text AS $$
  SELECT 'ORD-' || lpad(nextval('siparis_no_seq')::text, 6, '0');
$$ LANGUAGE sql VOLATILE;
