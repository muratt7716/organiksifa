# Ortam Değişkenleri

> **Depo private kalmalıdır.**
>
> Gizli anahtar (`sb_secret_…`) ve veritabanı şifresi bu dosyada
> **bulunmaz** — GitHub'ın gizli anahtar koruması depoda tutulmalarına
> izin vermiyor. İkisi de Supabase panelinden her an alınabilir:
>
> - `SUPABASE_SERVICE_ROLE_KEY` → Project Settings → **API Keys** → *secret*
> - Veritabanı şifresi → Project Settings → **Database** → Connection string

Yeni bir bilgisayarda çalışmaya başlamak için: aşağıdaki bloğu kopyala,
proje kökünde `.env.local` adıyla kaydet, boş olan iki satırı doldur.

```bash
# ---------------------------------------------------------------
# Supabase — proje: pqgjqfguzttoyxnconst
# ---------------------------------------------------------------
NEXT_PUBLIC_SUPABASE_URL="https://pqgjqfguzttoyxnconst.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_LwaGTyeBi0fvHTg2bOaHoQ_3MgJBlDS"

# Supabase > Project Settings > API Keys > "secret" anahtari (sb_secret_ ile baslar)
# GitHub gizli anahtar koruması bu değeri depoda tutmaya izin vermiyor;
# panelden kopyalayıp buraya yapıştır.
SUPABASE_SERVICE_ROLE_KEY=""

# ---------------------------------------------------------------
# Veritabanı bağlantısı
# Supabase > Project Settings > Database > Connection string
#   DATABASE_URL  -> "Transaction pooler"   port 6543
#   DIRECT_URL    -> "Direct connection"    port 5432
# İkisinde de [YOUR-PASSWORD] yerine veritabanı şifreni yaz.
# ---------------------------------------------------------------
DATABASE_URL=""
DIRECT_URL=""

# ---------------------------------------------------------------
# Site
# ---------------------------------------------------------------
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# ---------------------------------------------------------------
# Bildirim (isteğe bağlı ama şiddetle önerilir)
# Telegram: @BotFather -> /newbot -> token
#           @userinfobot -> chat id
#           Sonra kendi botuna bir kez /start yaz
# ---------------------------------------------------------------
TELEGRAM_BOT_TOKEN=""
TELEGRAM_CHAT_ID=""

# E-posta: doğrulanmış alan adı gerektirir, *.vercel.app'te ÇALIŞMAZ
RESEND_API_KEY=""
BILDIRIM_EPOSTA=""

# ---------------------------------------------------------------
# Canlı panel testi (npm run test:panel)
# Supabase > Authentication > Users bölümünden açtığın hesap
# ---------------------------------------------------------------
PANEL_TEST_EPOSTA=""
PANEL_TEST_SIFRE=""
```

---

## Anahtar biçimleri hakkında

Supabase iki biçim sunuyor; ikisi de geçerli:

| Yeni biçim | Eski biçim (JWT) | Nereye |
|---|---|---|
| `sb_publishable_…` | `role: anon` olan JWT | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `sb_secret_…` | `role: service_role` olan JWT | `SUPABASE_SERVICE_ROLE_KEY` |

Yeni biçim kullanılıyor. Eski JWT anon anahtarı yedek olarak:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZ2pxZmd1enR0b3l4bmNvbnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNjM0ODUsImV4cCI6MjEwMzkzOTQ4NX0.xOn9pMY55EYGwp8vz_bnzNLTaJ6RXsg-mgmSzJw0-5g
```

> `NEXT_PUBLIC_` ile başlayan anahtarlar zaten tarayıcıya gönderilir —
> bunlar gizli değildir, gizli olmaları da beklenmez.
> Gizli olan tek şey `SUPABASE_SERVICE_ROLE_KEY` ve veritabanı şifresidir.
> `supabase/kurulum.sql` içindeki RLS bölümü, anon anahtarıyla müşteri
> verisine erişilmesini zaten engelliyor.

---

## Vercel'e eklenecekler

Vercel → Project → **Settings → Environment Variables**.
Her birini **Production** ve **Preview** için ekle:

| Değişken | Değer |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://pqgjqfguzttoyxnconst.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_LwaGTyeBi0fvHTg2bOaHoQ_3MgJBlDS` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API Keys → **secret** anahtarı |
| `DATABASE_URL` | pooler bağlantısı, **port 6543** |
| `DIRECT_URL` | doğrudan bağlantı, **port 5432** |
| `NEXT_PUBLIC_SITE_URL` | Vercel'in verdiği adres, örn. `https://organiksifa.vercel.app` |
| `TELEGRAM_BOT_TOKEN` | (varsa) |
| `TELEGRAM_CHAT_ID` | (varsa) |

`DEMO_MODU` değişkenini Vercel'e **ekleme**. Zaten üretimde etkisizdir
(`NODE_ENV=production` olduğu için) ama hiç bulunmaması daha temiz.

Değişkenleri ekledikten sonra **Redeploy** et — Next.js bunları derleme
anında gömer, mevcut derleme yenilerini görmez.
