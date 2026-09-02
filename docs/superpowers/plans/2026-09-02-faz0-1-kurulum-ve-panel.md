# Organik Şifa — Faz 0 + Faz 1: Kurulum ve Ürün Paneli

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Teknik olmayan bir kullanıcının (site sahibinin ablası) telefon, tablet veya bilgisayardan hiç yardım almadan fotoğraflı ürün ekleyebildiği, canlıda çalışan bir yönetim paneli.

**Architecture:** Next.js App Router tek proje. Veritabanına yalnızca sunucu erişir (Server Components + Server Actions); tarayıcı Postgres'e hiç dokunmaz. Görseller tarayıcıda WebP'ye sıkıştırılıp imzalı URL ile doğrudan Supabase Storage'a gider, Vercel fonksiyonundan geçmez. Saf fonksiyonlar (slug, fiyat ayrıştırma, telefon normalize, görsel kenar analizi) ayrı modüllerde tutulur ve TDD ile yazılır.

**Tech Stack:** Next.js 16.3.4 · React 19.2.8 · TypeScript 5 (strict) · Tailwind CSS 4.3.3 · Drizzle ORM 0.45.2 · postgres-js · Supabase (Postgres + Storage + Auth) · Zod 4.5.4 · browser-image-compression 2.0.2 · lucide-react · Vitest

**Spec:** `docs/superpowers/specs/2026-09-02-organik-sifa-design.md`

## Global Constraints

- **Git:** Bu fazda `git init` veya commit YOK. Depo ablanın GitHub hesabı açılınca kurulacak. Adımlardaki commit talimatları, depo kurulduktan sonra uygulanmak üzere yazılmıştır — o ana kadar atlanır.
- **Dil:** Tüm kullanıcıya görünen metin Türkçe. Kod, değişken ve dosya adları İngilizce/ASCII.
- **Panel terminolojisi:** İngilizce teknik terim kullanılmaz. "SKU" değil "Ürün Kodu", "Publish" değil "Yayında", "Slug" hiç gösterilmez.
- **Para:** Tüm para alanları `numeric(10,2)`. JavaScript'te `number` ile aritmetik yapılmaz; toplama sunucuda yapılır.
- **Dokunma alanı:** Her tıklanabilir öğe ≥ 44×44 px.
- **Kontrast:** WCAG 2.2 AA — normal metin ≥ 4.5:1.
- **Renk token'ları:** `#FFFFFF` `#EDF1E8` `#1F5138` `#A8681C` `#17211B` `#D8D2C4` (spec §10).
- **JS bütçesi (gzip):** Panel ≤ 180 KB/rota. Mağaza rotaları bu planın kapsamı dışında.
- **Silme:** Hiçbir ürün gerçekten silinmez — `yayinda = false` yapılır.
- **`cacheComponents`:** v1'de AÇILMAZ (Next 16'da segment export'larını kırar).
- **Sır yönetimi:** `.env*` dosyaları asla depoya girmez. `.gitignore` ilk taskta yazılır.

---

## Dosya Yapısı

```
organiksifa/
├── .env.local                      # gizli, .gitignore'da
├── .env.example                    # şablon, depoda
├── drizzle.config.ts
├── next.config.ts
├── vitest.config.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx              # kök layout, fontlar
│   │   ├── globals.css             # Tailwind 4 @theme token'ları
│   │   ├── page.tsx                # geçici ana sayfa (Faz 2'de değişecek)
│   │   └── panel/
│   │       ├── layout.tsx          # panel kabuğu + yetki kontrolü
│   │       ├── page.tsx            # panel ana sayfa
│   │       ├── giris/page.tsx      # giriş formu
│   │       ├── urunler/
│   │       │   ├── page.tsx        # ürün listesi
│   │       │   ├── yeni/page.tsx   # yeni ürün
│   │       │   └── [id]/page.tsx   # ürün düzenle
│   │       └── kategoriler/page.tsx
│   ├── db/
│   │   ├── index.ts                # bağlantı (pooler, prepare:false)
│   │   └── schema/
│   │       ├── index.ts            # barrel
│   │       ├── catalog.ts          # categories, brands, products, product_images
│   │       ├── orders.ts           # orders, order_items, order_events
│   │       ├── reviews.ts          # reviews
│   │       └── system.ts           # settings, rate_limits, admin_profiles
│   ├── lib/
│   │   ├── slug.ts                 # saf — TDD
│   │   ├── price.ts                # saf — TDD
│   │   ├── phone.ts                # saf — TDD
│   │   ├── image-analysis.ts       # saf — TDD (letterbox + kenar rengi)
│   │   ├── image-upload.ts         # tarayıcı: HEIC, sıkıştırma, yükleme
│   │   ├── supabase/
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   └── utils.ts                # cn()
│   ├── components/
│   │   ├── ui/                     # shadcn/ui bileşenleri
│   │   └── panel/
│   │       ├── PanelNav.tsx
│   │       ├── ImageUploader.tsx
│   │       ├── ImageCropper.tsx
│   │       └── ToggleSwitch.tsx
│   ├── actions/
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── categories.ts
│   │   └── uploads.ts
│   └── middleware.ts               # oturum yenileme
├── drizzle/                        # üretilen SQL migration'ları
└── tests/
    └── lib/
        ├── slug.test.ts
        ├── price.test.ts
        ├── phone.test.ts
        └── image-analysis.test.ts
```

---

### Task 1: Proje iskeleti, tasarım token'ları ve fontlar

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `.gitignore`, `.env.example`
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`
- Create: `src/lib/utils.ts`
- Create: `vitest.config.ts`

**Interfaces:**
- Consumes: hiçbir şey (ilk task)
- Produces: `cn(...inputs: ClassValue[]): string` · Tailwind token adları (`--color-yesil-700`, `--color-amber-600`, `--color-notr-900`, `--font-baslik`, `--font-govde`) · `npm test` komutu

- [ ] **Step 1: Projeyi oluştur**

```bash
cd c:/Users/Administrator/Desktop/organiksifa
npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir --import-alias "@/*" --no-turbopack --yes
```

Mevcut `docs/` ve `ürünler/` klasörleri korunur. Sorulursa "mevcut dosyaları koru" seçilir.

- [ ] **Step 2: Bağımlılıkları kur**

```bash
npm i drizzle-orm postgres zod @supabase/supabase-js @supabase/ssr browser-image-compression lucide-react clsx tailwind-merge
npm i -D drizzle-kit vitest @vitejs/plugin-react dotenv
```

- [ ] **Step 3: `.gitignore`'a sır dosyalarını ekle**

`.gitignore` dosyasının sonuna:

```
# ortam degiskenleri
.env
.env.local
.env*.local

# gecici
/scratch
*.log
```

- [ ] **Step 4: `.env.example` yaz**

```bash
# Supabase > Project Settings > Database > Connection string
# Uygulama: Transaction pooler (port 6543)
DATABASE_URL="postgresql://postgres.PROJE:SIFRE@aws-0-BOLGE.pooler.supabase.com:6543/postgres"
# Migration: dogrudan baglanti (port 5432)
DIRECT_URL="postgresql://postgres.PROJE:SIFRE@aws-0-BOLGE.pooler.supabase.com:5432/postgres"

# Supabase > Project Settings > API
NEXT_PUBLIC_SUPABASE_URL="https://PROJE.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""

NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

- [ ] **Step 5: `src/app/globals.css` — Tailwind 4 token sistemi**

Tailwind 4 CSS-first yapılandırma kullanır; `tailwind.config.js` yoktur.

```css
@import "tailwindcss";

@theme {
  /* Sifa yesili */
  --color-yesil-50:  #F2F7F3;
  --color-yesil-100: #E1EDE5;
  --color-yesil-200: #C2DACB;
  --color-yesil-300: #94BFA6;
  --color-yesil-400: #5E9C7B;
  --color-yesil-500: #367A57;
  --color-yesil-600: #2A6446;
  --color-yesil-700: #1F5138;
  --color-yesil-800: #17402C;
  --color-yesil-900: #102D1F;

  /* Amber cam */
  --color-amber-100: #F5E7CE;
  --color-amber-300: #E0B878;
  --color-amber-500: #C2842A;
  --color-amber-600: #A8681C;
  --color-amber-700: #8A5316;

  /* Notr */
  --color-notr-0:   #FFFFFF;
  --color-notr-100: #EDF1E8;
  --color-notr-200: #D8D2C4;
  --color-notr-400: #9AA096;
  --color-notr-600: #5C665C;
  --color-notr-900: #17211B;

  --color-hata: #B3261E;

  --font-baslik: var(--font-newsreader), Georgia, serif;
  --font-govde:  var(--font-inter), system-ui, sans-serif;

  --radius-kontrol: 6px;
  --radius-gorsel:  2px;
  --radius-panel:   12px;

  --spacing-raf: 1px;
}

:root { color-scheme: light; }

html { -webkit-text-size-adjust: 100%; }

body {
  background: var(--color-notr-0);
  color: var(--color-notr-900);
  font-family: var(--font-govde);
  font-size: 16px;
  line-height: 1.6;
}

h1, h2, h3 { font-family: var(--font-baslik); line-height: 1.15; }

/* Fiyatlar hizali dizilsin */
.rakam { font-variant-numeric: tabular-nums; }

/* Klavye odagi her zaman gorunur */
:focus-visible {
  outline: 2px solid var(--color-yesil-700);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 6: `src/app/layout.tsx` — fontlar ve Türkçe dil**

```tsx
import type { Metadata } from 'next'
import { Inter, Newsreader } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
})

const newsreader = Newsreader({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-newsreader',
  display: 'swap',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Organik Şifa',
  description: 'Organik gıda takviyeleri ve doğal kozmetik ürünleri',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} ${newsreader.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

`latin-ext` alt kümesi Türkçe karakterler (ğ ı ş İ) için **zorunludur**.

- [ ] **Step 7: `src/lib/utils.ts`**

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 8: `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: { environment: 'node', include: ['tests/**/*.test.ts'] },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
```

`package.json` içine script ekle:

```json
"test": "vitest run",
"test:watch": "vitest",
"db:generate": "drizzle-kit generate",
"db:migrate": "drizzle-kit migrate",
"db:studio": "drizzle-kit studio"
```

- [ ] **Step 9: Türkçe karakter doğrulaması**

`src/app/page.tsx` içeriğini geçici olarak şu yap:

```tsx
export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-4xl text-yesil-700">Organik Şifa</h1>
      <p className="text-notr-900">Iğdır ışığı — ÇĞİÖŞÜ çğıöşü</p>
      <p className="rakam text-amber-600">1.250,00 ₺</p>
    </main>
  )
}
```

Çalıştır: `npm run dev` → `http://localhost:3000`

**Doğrula:** Başlık serif (Newsreader), `Ğ İ Ş ç ğ ı ö ş ü` karakterlerinin hiçbiri kutu veya eksik değil. Eğer Newsreader'da bozuk karakter varsa `Newsreader` yerine `Literata` kullan (aynı import, aynı alt kümeler) ve spec §10'a not düş.

- [ ] **Step 10: Testin çalıştığını doğrula**

```bash
npm test
```
Beklenen: `No test files found` — hata değil, kurulumun doğru olduğunu gösterir.

- [ ] **Step 11: Commit** *(depo kurulduysa)*

```bash
git add -A
git commit -m "chore: Next.js 16 iskeleti, tasarim token'lari ve fontlar"
```

---

### Task 2: Saf yardımcı fonksiyonlar — slug, fiyat, telefon (TDD)

**Files:**
- Create: `tests/lib/slug.test.ts`, `src/lib/slug.ts`
- Create: `tests/lib/price.test.ts`, `src/lib/price.ts`
- Create: `tests/lib/phone.test.ts`, `src/lib/phone.ts`

**Interfaces:**
- Consumes: Task 1'in vitest kurulumu
- Produces:
  - `slugify(input: string): string`
  - `benzersizSlug(taban: string, mevcutlar: string[]): string`
  - `fiyatAyristir(input: string): number | null`
  - `fiyatBicimle(kurus: number): string`
  - `telefonNormalize(input: string): string | null`
  - `telefonGoster(e164: string): string`

- [ ] **Step 1: Slug testini yaz (başarısız olacak)**

`tests/lib/slug.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { slugify, benzersizSlug } from '@/lib/slug'

describe('slugify', () => {
  it('Türkçe karakterleri ASCII karşılığına çevirir', () => {
    expect(slugify('Çörekotu Yağı')).toBe('corekotu-yagi')
    expect(slugify('Iğdır Şifası')).toBe('igdir-sifasi')
    expect(slugify('İNCİ ÇEKİRDEĞİ')).toBe('inci-cekirdegi')
  })

  it('noktalama ve fazla boşluğu tek tireye indirir', () => {
    expect(slugify('Uyuz Seti  (4 Ürün)')).toBe('uyuz-seti-4-urun')
    expect(slugify('D Vitamini — Altın Yağ')).toBe('d-vitamini-altin-yag')
  })

  it('baştaki ve sondaki tireleri temizler', () => {
    expect(slugify('  ...Merhem!  ')).toBe('merhem')
  })

  it('boş girdide boş döner', () => {
    expect(slugify('')).toBe('')
    expect(slugify('!!!')).toBe('')
  })
})

describe('benzersizSlug', () => {
  it('çakışma yoksa tabanı döner', () => {
    expect(benzersizSlug('merhem', [])).toBe('merhem')
  })

  it('çakışmada sonuna sayı ekler', () => {
    expect(benzersizSlug('merhem', ['merhem'])).toBe('merhem-2')
    expect(benzersizSlug('merhem', ['merhem', 'merhem-2'])).toBe('merhem-3')
  })

  it('taban boşsa "urun" kullanır', () => {
    expect(benzersizSlug('', [])).toBe('urun')
  })
})
```

- [ ] **Step 2: Testin başarısız olduğunu gör**

```bash
npx vitest run tests/lib/slug.test.ts
```
Beklenen: FAIL — `Cannot find module '@/lib/slug'`

- [ ] **Step 3: `src/lib/slug.ts` yaz**

```ts
const TR_HARF: Record<string, string> = {
  ç: 'c', Ç: 'c', ğ: 'g', Ğ: 'g', ı: 'i', I: 'i', İ: 'i',
  ö: 'o', Ö: 'o', ş: 's', Ş: 's', ü: 'u', Ü: 'u',
}

/** Başlığı URL'de kullanılabilir hale getirir. Türkçe karakterleri ASCII'ye çevirir. */
export function slugify(input: string): string {
  return input
    .split('')
    .map((ch) => TR_HARF[ch] ?? ch)
    .join('')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Mevcut slug'larla çakışmayan bir slug üretir: merhem → merhem-2 → merhem-3 */
export function benzersizSlug(taban: string, mevcutlar: string[]): string {
  const kok = slugify(taban) || 'urun'
  if (!mevcutlar.includes(kok)) return kok
  let n = 2
  while (mevcutlar.includes(`${kok}-${n}`)) n++
  return `${kok}-${n}`
}
```

- [ ] **Step 4: Testin geçtiğini doğrula**

```bash
npx vitest run tests/lib/slug.test.ts
```
Beklenen: PASS — 7 test

- [ ] **Step 5: Fiyat testini yaz**

`tests/lib/price.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { fiyatAyristir, fiyatBicimle } from '@/lib/price'

describe('fiyatAyristir', () => {
  it('Türkçe ondalık ayracını kabul eder', () => {
    expect(fiyatAyristir('1.250,00')).toBe(1250)
    expect(fiyatAyristir('450,50')).toBe(450.5)
    expect(fiyatAyristir('89,9')).toBe(89.9)
  })

  it('İngilizce biçimi de kabul eder', () => {
    expect(fiyatAyristir('1250.50')).toBe(1250.5)
    expect(fiyatAyristir('1,250.50')).toBe(1250.5)
  })

  it('binlik ayracı olarak tek noktayı çözer', () => {
    expect(fiyatAyristir('1.250')).toBe(1250)
    expect(fiyatAyristir('12.500')).toBe(12500)
  })

  it('sade ondalığı bozmaz', () => {
    expect(fiyatAyristir('1.5')).toBe(1.5)
    expect(fiyatAyristir('450')).toBe(450)
  })

  it('para simgesi ve boşluğu yok sayar', () => {
    expect(fiyatAyristir(' 890 ₺ ')).toBe(890)
    expect(fiyatAyristir('340 TL')).toBe(340)
  })

  it('geçersiz girdide null döner', () => {
    expect(fiyatAyristir('')).toBeNull()
    expect(fiyatAyristir('bedava')).toBeNull()
    expect(fiyatAyristir('-50')).toBeNull()
  })

  it('iki basamağa yuvarlar', () => {
    expect(fiyatAyristir('10,999')).toBe(11)
  })
})

describe('fiyatBicimle', () => {
  it('Türkçe biçimde gösterir', () => {
    expect(fiyatBicimle(1250)).toBe('1.250,00 ₺')
    expect(fiyatBicimle(89.9)).toBe('89,90 ₺')
  })
})
```

- [ ] **Step 6: Testin başarısız olduğunu gör**

```bash
npx vitest run tests/lib/price.test.ts
```
Beklenen: FAIL — modül yok

- [ ] **Step 7: `src/lib/price.ts` yaz**

```ts
/**
 * Kullanıcının yazdığı fiyat metnini sayıya çevirir.
 * Ablanın "1.250,00" da "1250.50" da yazabilmesi için iki biçimi de kabul eder.
 * Geçersizse null döner — çağıran taraf Türkçe hata mesajı gösterir.
 */
export function fiyatAyristir(input: string): number | null {
  const s = input.trim().replace(/[\s₺]|TL/gi, '')
  if (!s) return null
  if (!/^[\d.,]+$/.test(s)) return null

  let normalized: string
  const sonVirgul = s.lastIndexOf(',')
  const sonNokta = s.lastIndexOf('.')

  if (sonVirgul >= 0 && sonNokta >= 0) {
    // Hangisi sondaysa ondalık ayracıdır
    normalized = sonVirgul > sonNokta
      ? s.replace(/\./g, '').replace(',', '.')
      : s.replace(/,/g, '')
  } else if (sonVirgul >= 0) {
    normalized = s.replace(',', '.')
  } else if (/^\d{1,3}(\.\d{3})+$/.test(s)) {
    // 1.250 / 12.500 → binlik ayracı
    normalized = s.replace(/\./g, '')
  } else {
    normalized = s
  }

  const n = Number(normalized)
  if (!Number.isFinite(n) || n < 0) return null
  return Math.round(n * 100) / 100
}

const BICIM = new Intl.NumberFormat('tr-TR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function fiyatBicimle(tutar: number): string {
  return `${BICIM.format(tutar)} ₺`
}
```

- [ ] **Step 8: Testin geçtiğini doğrula**

```bash
npx vitest run tests/lib/price.test.ts
```
Beklenen: PASS — 8 test

- [ ] **Step 9: Telefon testini yaz**

`tests/lib/phone.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { telefonNormalize, telefonGoster } from '@/lib/phone'

describe('telefonNormalize', () => {
  it('yaygın Türkçe yazımları E.164 rakamına çevirir', () => {
    expect(telefonNormalize('0532 111 22 33')).toBe('905321112233')
    expect(telefonNormalize('05321112233')).toBe('905321112233')
    expect(telefonNormalize('532 111 22 33')).toBe('905321112233')
    expect(telefonNormalize('+90 532 111 22 33')).toBe('905321112233')
    expect(telefonNormalize('905321112233')).toBe('905321112233')
    expect(telefonNormalize('0090 532 111 22 33')).toBe('905321112233')
  })

  it('parantez ve tireyi yok sayar', () => {
    expect(telefonNormalize('(0532) 111-22-33')).toBe('905321112233')
  })

  it('eksik veya fazla haneli numarada null döner', () => {
    expect(telefonNormalize('532 111 22')).toBeNull()
    expect(telefonNormalize('0532 111 22 33 44')).toBeNull()
    expect(telefonNormalize('')).toBeNull()
    expect(telefonNormalize('merhaba')).toBeNull()
  })
})

describe('telefonGoster', () => {
  it('okunabilir biçimde gösterir', () => {
    expect(telefonGoster('905321112233')).toBe('+90 532 111 22 33')
  })
})
```

- [ ] **Step 10: Testin başarısız olduğunu gör**

```bash
npx vitest run tests/lib/phone.test.ts
```
Beklenen: FAIL

- [ ] **Step 11: `src/lib/phone.ts` yaz**

```ts
/**
 * Türkiye numarasını WhatsApp'ın beklediği biçime çevirir: 905321112233
 * Başında + yok, başında 0 yok, boşluk yok.
 * Ablan ayarlara "0532 111 22 33" yazarsa ve bu normalize edilmezse
 * sitedeki TÜM WhatsApp bağlantıları sessizce çalışmaz hale gelir.
 */
export function telefonNormalize(input: string): string | null {
  let d = input.replace(/\D/g, '')
  if (!d) return null

  if (d.startsWith('00')) d = d.slice(2)
  if (d.startsWith('90') && d.length === 12) d = d.slice(2)
  if (d.startsWith('0') && d.length === 11) d = d.slice(1)

  if (d.length !== 10) return null
  return `90${d}`
}

/** 905321112233 → +90 532 111 22 33 */
export function telefonGoster(e164: string): string {
  const d = e164.replace(/\D/g, '')
  if (d.length !== 12 || !d.startsWith('90')) return e164
  const n = d.slice(2)
  return `+90 ${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6, 8)} ${n.slice(8, 10)}`
}
```

- [ ] **Step 12: Tüm testlerin geçtiğini doğrula**

```bash
npm test
```
Beklenen: PASS — 3 dosya, 19 test

- [ ] **Step 13: Commit**

```bash
git add src/lib tests/lib
git commit -m "feat: slug, fiyat ve telefon yardimcilari (TDD)"
```

---

### Task 3: Görsel analizi — letterbox kırpma ve zemin rengi (TDD)

Bu, kataloğun düzensiz görsellerle bozulmamasını sağlayan çekirdek algoritma. Denetimde yakalanan gerçek sorun: Detox görselinin siyah şeritleri olduğu için kenar rengi siyah ölçülüyor ve ürün kartı simsiyah oluyordu.

**Files:**
- Create: `tests/lib/image-analysis.test.ts`, `src/lib/image-analysis.ts`

**Interfaces:**
- Consumes: Task 1 vitest
- Produces:
  - `type Pikseller = { data: Uint8ClampedArray; width: number; height: number }`
  - `type Kutu = { x: number; y: number; w: number; h: number }`
  - `tekRenkKenarlariKirp(px: Pikseller, tolerans?: number): Kutu`
  - `zeminRengi(px: Pikseller, kutu: Kutu): string`

- [ ] **Step 1: Testi yaz**

`tests/lib/image-analysis.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { tekRenkKenarlariKirp, zeminRengi, type Pikseller } from '@/lib/image-analysis'

/** Test görseli üretir: dış çerçeve `cerceve`, iç dikdörtgen `ic` rengidir. */
function gorselUret(
  w: number, h: number,
  cerceve: [number, number, number],
  ic: [number, number, number],
  bant: number,
): Pikseller {
  const data = new Uint8ClampedArray(w * h * 4)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const icteMi = x >= bant && x < w - bant && y >= bant && y < h - bant
      const [r, g, b] = icteMi ? ic : cerceve
      const i = (y * w + x) * 4
      data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = 255
    }
  }
  return { data, width: w, height: h }
}

describe('tekRenkKenarlariKirp', () => {
  it('siyah letterbox şeritlerini kırpar', () => {
    const px = gorselUret(20, 20, [0, 0, 0], [200, 220, 200], 4)
    expect(tekRenkKenarlariKirp(px)).toEqual({ x: 4, y: 4, w: 12, h: 12 })
  })

  it('beyaz kenar boşluğunu da kırpar', () => {
    const px = gorselUret(20, 20, [255, 255, 255], [30, 80, 55], 3)
    expect(tekRenkKenarlariKirp(px)).toEqual({ x: 3, y: 3, w: 14, h: 14 })
  })

  it('kırpılacak kenar yoksa tüm görseli döner', () => {
    const px = gorselUret(10, 10, [120, 130, 140], [120, 130, 140], 0)
    expect(tekRenkKenarlariKirp(px)).toEqual({ x: 0, y: 0, w: 10, h: 10 })
  })

  it('her şey tek renkse görseli tamamen yemez', () => {
    const px = gorselUret(10, 10, [0, 0, 0], [0, 0, 0], 5)
    const k = tekRenkKenarlariKirp(px)
    expect(k.w).toBeGreaterThan(0)
    expect(k.h).toBeGreaterThan(0)
  })

  it('hafif JPEG gürültüsünü tolere eder', () => {
    const px = gorselUret(20, 20, [2, 1, 3], [200, 220, 200], 4)
    expect(tekRenkKenarlariKirp(px, 8)).toEqual({ x: 4, y: 4, w: 12, h: 12 })
  })
})

describe('zeminRengi', () => {
  it('kırpılmış alanın kenar rengini döner', () => {
    const px = gorselUret(20, 20, [0, 0, 0], [237, 241, 232], 4)
    const kutu = tekRenkKenarlariKirp(px)
    expect(zeminRengi(px, kutu)).toBe('#EDF1E8')
  })

  it('siyah şeritli görselde SİYAH dönmez', () => {
    const px = gorselUret(20, 20, [0, 0, 0], [240, 245, 238], 4)
    const kutu = tekRenkKenarlariKirp(px)
    expect(zeminRengi(px, kutu)).not.toBe('#000000')
  })

  it('çok koyu bir kenarı okunabilir sınıra çeker', () => {
    const px = gorselUret(20, 20, [10, 10, 10], [10, 10, 10], 0)
    const renk = zeminRengi(px, { x: 0, y: 0, w: 20, h: 20 })
    expect(renk).toMatch(/^#[0-9A-F]{6}$/)
  })
})
```

- [ ] **Step 2: Testin başarısız olduğunu gör**

```bash
npx vitest run tests/lib/image-analysis.test.ts
```
Beklenen: FAIL — modül yok

- [ ] **Step 3: `src/lib/image-analysis.ts` yaz**

```ts
export type Pikseller = { data: Uint8ClampedArray; width: number; height: number }
export type Kutu = { x: number; y: number; w: number; h: number }

function pikselOku(px: Pikseller, x: number, y: number): [number, number, number] {
  const i = (y * px.width + x) * 4
  return [px.data[i], px.data[i + 1], px.data[i + 2]]
}

function yakinMi(a: [number, number, number], b: [number, number, number], tol: number) {
  return Math.abs(a[0] - b[0]) <= tol
    && Math.abs(a[1] - b[1]) <= tol
    && Math.abs(a[2] - b[2]) <= tol
}

function satirTekRenkMi(px: Pikseller, y: number, x0: number, x1: number, tol: number) {
  const ilk = pikselOku(px, x0, y)
  for (let x = x0; x <= x1; x++) if (!yakinMi(pikselOku(px, x, y), ilk, tol)) return false
  return true
}

function sutunTekRenkMi(px: Pikseller, x: number, y0: number, y1: number, tol: number) {
  const ilk = pikselOku(px, x, y0)
  for (let y = y0; y <= y1; y++) if (!yakinMi(pikselOku(px, x, y), ilk, tol)) return false
  return true
}

/**
 * Görselin kenarındaki tek renk şeritleri (letterbox, beyaz boşluk) kırpar.
 * Zemin rengi bu şeritlerden ölçülürse kart yanlış renk alır — asıl amaç bu.
 * Görselin tamamı tek renkse hiç kırpmaz.
 */
export function tekRenkKenarlariKirp(px: Pikseller, tolerans = 8): Kutu {
  let ust = 0, alt = px.height - 1, sol = 0, sag = px.width - 1

  while (ust < alt && satirTekRenkMi(px, ust, sol, sag, tolerans)) ust++
  while (alt > ust && satirTekRenkMi(px, alt, sol, sag, tolerans)) alt--
  while (sol < sag && sutunTekRenkMi(px, sol, ust, alt, tolerans)) sol++
  while (sag > sol && sutunTekRenkMi(px, sag, ust, alt, tolerans)) sag--

  const w = sag - sol + 1
  const h = alt - ust + 1
  if (w < 2 || h < 2) return { x: 0, y: 0, w: px.width, h: px.height }
  return { x: sol, y: ust, w, h }
}

function ortancaKanal(degerler: number[]): number {
  const s = [...degerler].sort((a, b) => a - b)
  return s[Math.floor(s.length / 2)]
}

function ikiliyeCevir(n: number): string {
  return Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0').toUpperCase()
}

/**
 * Kırpılmış alanın kenar piksellerinden ortanca rengi çıkarır.
 * Ürün kartı bu rengi zemin olarak kullanır; görsel kırpılmadan
 * (object-fit: contain) bu zeminin ortasına yerleştirilir.
 * Çok koyu renkler okunabilirlik için açılır.
 */
export function zeminRengi(px: Pikseller, kutu: Kutu): string {
  const r: number[] = [], g: number[] = [], b: number[] = []
  const adim = Math.max(1, Math.floor(Math.max(kutu.w, kutu.h) / 64))

  for (let x = kutu.x; x < kutu.x + kutu.w; x += adim) {
    for (const y of [kutu.y, kutu.y + kutu.h - 1]) {
      const p = pikselOku(px, x, y); r.push(p[0]); g.push(p[1]); b.push(p[2])
    }
  }
  for (let y = kutu.y; y < kutu.y + kutu.h; y += adim) {
    for (const x of [kutu.x, kutu.x + kutu.w - 1]) {
      const p = pikselOku(px, x, y); r.push(p[0]); g.push(p[1]); b.push(p[2])
    }
  }

  let [rr, gg, bb] = [ortancaKanal(r), ortancaKanal(g), ortancaKanal(b)]

  // Çok koyu zemin üstünde ürün seçilmez — parlaklığı tabana çek
  const parlaklik = 0.2126 * rr + 0.7152 * gg + 0.0722 * bb
  if (parlaklik < 40) {
    const kat = 40 / Math.max(parlaklik, 1)
    rr = Math.min(255, rr * kat + 24)
    gg = Math.min(255, gg * kat + 24)
    bb = Math.min(255, bb * kat + 24)
  }

  return `#${ikiliyeCevir(rr)}${ikiliyeCevir(gg)}${ikiliyeCevir(bb)}`
}
```

- [ ] **Step 4: Testlerin geçtiğini doğrula**

```bash
npx vitest run tests/lib/image-analysis.test.ts
```
Beklenen: PASS — 8 test

- [ ] **Step 5: Tüm testleri çalıştır**

```bash
npm test
```
Beklenen: PASS — 4 dosya, 27 test

- [ ] **Step 6: Commit**

```bash
git add src/lib/image-analysis.ts tests/lib/image-analysis.test.ts
git commit -m "feat: gorsel kenar analizi - letterbox kirpma ve zemin rengi (TDD)"
```

---

### Task 4: Veritabanı şeması ve migration

**Files:**
- Create: `src/db/schema/catalog.ts`, `src/db/schema/orders.ts`, `src/db/schema/reviews.ts`, `src/db/schema/system.ts`, `src/db/schema/index.ts`
- Create: `src/db/index.ts`, `drizzle.config.ts`
- Create: `src/db/seed.ts`

**Interfaces:**
- Consumes: `.env.local` (Task 1'de şablonu yazıldı)
- Produces: `db` (Drizzle örneği) · tablo nesneleri: `categories`, `brands`, `products`, `productImages`, `orders`, `orderItems`, `orderEvents`, `reviews`, `settings`, `rateLimits`, `adminProfiles`

- [ ] **Step 1: Supabase projesini kur**

1. https://supabase.com → yeni proje, bölge **Frankfurt (eu-central-1)** (Türkiye'ye en yakın)
2. Project Settings → Database → Connection string → **Transaction pooler** (port 6543) → `DATABASE_URL`
3. Aynı sayfada **Direct connection** (port 5432) → `DIRECT_URL`
4. Project Settings → API → URL, anon key, service_role key
5. `.env.example`'ı `.env.local` olarak kopyala ve doldur

- [ ] **Step 2: `drizzle.config.ts` yaz**

```ts
import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  // Migration'lar transaction pooler uzerinden CALISMAZ — dogrudan baglanti sart
  dbCredentials: { url: process.env.DIRECT_URL! },
})
```

- [ ] **Step 3: `src/db/index.ts` yaz**

```ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const url = process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL tanımlı değil')

// Transaction pooler prepared statement DESTEKLEMEZ.
// prepare:false verilmezse uretimde "prepared statement already exists" hatalari cikar.
const client = postgres(url, { prepare: false })

export const db = drizzle(client, { schema })
export { schema }
```

- [ ] **Step 4: `src/db/schema/catalog.ts` yaz**

```ts
import {
  pgTable, uuid, text, boolean, integer, numeric, timestamp, index, uniqueIndex,
} from 'drizzle-orm/pg-core'

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  ad: text('ad').notNull(),
  slug: text('slug').notNull(),
  sira: integer('sira').notNull().default(0),
  aktif: boolean('aktif').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex('categories_slug_idx').on(t.slug)])

export const brands = pgTable('brands', {
  id: uuid('id').primaryKey().defaultRandom(),
  ad: text('ad').notNull(),
  slug: text('slug').notNull(),
  aktif: boolean('aktif').notNull().default(true),
}, (t) => [uniqueIndex('brands_slug_idx').on(t.slug)])

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  baslik: text('baslik').notNull(),
  slug: text('slug').notNull(),
  kisaAciklama: text('kisa_aciklama'),
  aciklama: text('aciklama'),
  fiyat: numeric('fiyat', { precision: 10, scale: 2 }).notNull(),
  eskiFiyat: numeric('eski_fiyat', { precision: 10, scale: 2 }),
  kdvOrani: numeric('kdv_orani', { precision: 4, scale: 2 }),
  kategoriId: uuid('kategori_id').references(() => categories.id, { onDelete: 'set null' }),
  markaId: uuid('marka_id').references(() => brands.id, { onDelete: 'set null' }),
  setIcerigi: text('set_icerigi').array(),
  varyantGrupId: text('varyant_grup_id'),
  stokta: boolean('stokta').notNull().default(true),
  yayinda: boolean('yayinda').notNull().default(true),
  oneCikan: boolean('one_cikan').notNull().default(false),
  kargoBedava: boolean('kargo_bedava').notNull().default(false),
  ortalamaPuan: numeric('ortalama_puan', { precision: 2, scale: 1 }),
  yorumSayisi: integer('yorum_sayisi').notNull().default(0),
  sira: integer('sira').notNull().default(0),
  seoBaslik: text('seo_baslik'),
  seoAciklama: text('seo_aciklama'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('products_slug_idx').on(t.slug),
  index('products_kategori_idx').on(t.kategoriId),
  index('products_yayin_sira_idx').on(t.yayinda, t.sira),
])

export const productImages = pgTable('product_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  urunId: uuid('urun_id').references(() => products.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  storagePath: text('storage_path').notNull(),
  alt: text('alt').notNull().default(''),
  genislik: integer('genislik').notNull(),
  yukseklik: integer('yukseklik').notNull(),
  zeminRengi: text('zemin_rengi').notNull().default('#EDF1E8'),
  tur: text('tur').notNull().default('galeri'), // kapak | galeri | infografik
  yayinda: boolean('yayinda').notNull().default(true),
  sira: integer('sira').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index('product_images_urun_idx').on(t.urunId, t.sira)])
```

- [ ] **Step 5: `src/db/schema/orders.ts` yaz**

```ts
import {
  pgTable, uuid, text, integer, numeric, timestamp, boolean, index, uniqueIndex,
} from 'drizzle-orm/pg-core'
import { products } from './catalog'

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  siparisNo: text('siparis_no').notNull(),
  erisimToken: uuid('erisim_token').notNull().defaultRandom(),
  idempotencyKey: uuid('idempotency_key').notNull(),

  musteriAdi: text('musteri_adi').notNull(),
  telefon: text('telefon').notNull(),
  telefonE164: text('telefon_e164').notNull(),
  email: text('email'),
  il: text('il').notNull(),
  ilce: text('ilce').notNull(),
  adres: text('adres').notNull(),
  not: text('not'),

  araToplam: numeric('ara_toplam', { precision: 10, scale: 2 }).notNull(),
  indirimTutari: numeric('indirim_tutari', { precision: 10, scale: 2 }).notNull().default('0'),
  indirimAciklamasi: text('indirim_aciklamasi'),
  kargoUcreti: numeric('kargo_ucreti', { precision: 10, scale: 2 }).notNull().default('0'),
  kargoKuraliSnapshot: text('kargo_kurali_snapshot'),
  toplamKdv: numeric('toplam_kdv', { precision: 10, scale: 2 }).notNull().default('0'),
  toplam: numeric('toplam', { precision: 10, scale: 2 }).notNull(),

  durum: text('durum').notNull().default('yeni'),
  iptalNedeni: text('iptal_nedeni'),
  odemeDurumu: text('odeme_durumu').notNull().default('bekliyor'),
  odemeYontemi: text('odeme_yontemi'),
  odenenTutar: numeric('odenen_tutar', { precision: 10, scale: 2 }),
  odemeAt: timestamp('odeme_at', { withTimezone: true }),

  kargoFirmasi: text('kargo_firmasi'),
  kargoTakipNo: text('kargo_takip_no'),
  kargoyaVerildiAt: timestamp('kargoya_verildi_at', { withTimezone: true }),

  whatsappTiklama: integer('whatsapp_tiklama').notNull().default(0),
  whatsappSonTiklamaAt: timestamp('whatsapp_son_tiklama_at', { withTimezone: true }),

  mesafeliSozlesmeOnayAt: timestamp('mesafeli_sozlesme_onay_at', { withTimezone: true }),
  kvkkOnayAt: timestamp('kvkk_onay_at', { withTimezone: true }),
  ticariIletiIzni: boolean('ticari_ileti_izni').notNull().default(false),
  ip: text('ip'),
  userAgent: text('user_agent'),
  adminNotu: text('admin_notu'),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('orders_siparis_no_idx').on(t.siparisNo),
  uniqueIndex('orders_idempotency_idx').on(t.idempotencyKey),
  index('orders_telefon_idx').on(t.telefonE164),
  index('orders_durum_idx').on(t.durum, t.createdAt),
])

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  siparisId: uuid('siparis_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  urunId: uuid('urun_id').references(() => products.id, { onDelete: 'set null' }),
  baslikSnapshot: text('baslik_snapshot').notNull(),
  slugSnapshot: text('slug_snapshot').notNull(),
  gorselSnapshot: text('gorsel_snapshot'),
  birimFiyat: numeric('birim_fiyat', { precision: 10, scale: 2 }).notNull(),
  kdvOraniSnapshot: numeric('kdv_orani_snapshot', { precision: 4, scale: 2 }),
  adet: integer('adet').notNull(),
  satirToplam: numeric('satir_toplam', { precision: 10, scale: 2 }).notNull(),
}, (t) => [index('order_items_siparis_idx').on(t.siparisId)])

export const orderEvents = pgTable('order_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  siparisId: uuid('siparis_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  tip: text('tip').notNull(),
  eskiDeger: text('eski_deger'),
  yeniDeger: text('yeni_deger'),
  aktorId: uuid('aktor_id'),
  not: text('not'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index('order_events_siparis_idx').on(t.siparisId, t.createdAt)])
```

- [ ] **Step 6: `src/db/schema/reviews.ts` yaz**

```ts
import { pgTable, uuid, text, integer, boolean, timestamp, index } from 'drizzle-orm/pg-core'
import { products } from './catalog'
import { orders } from './orders'

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  urunId: uuid('urun_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  ad: text('ad').notNull(),
  puan: integer('puan').notNull(),
  yorum: text('yorum').notNull(),
  durum: text('durum').notNull().default('bekliyor'), // bekliyor | onayli | reddedildi
  siparisId: uuid('siparis_id').references(() => orders.id, { onDelete: 'set null' }),
  dogrulanmisAlici: boolean('dogrulanmis_alici').notNull().default(false),
  saticiYaniti: text('satici_yaniti'),
  ip: text('ip'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  onayAt: timestamp('onay_at', { withTimezone: true }),
}, (t) => [
  index('reviews_urun_durum_idx').on(t.urunId, t.durum),
  index('reviews_durum_idx').on(t.durum, t.createdAt),
])
```

- [ ] **Step 7: `src/db/schema/system.ts` yaz**

```ts
import { pgTable, uuid, text, boolean, integer, numeric, timestamp, jsonb } from 'drizzle-orm/pg-core'

export const settings = pgTable('settings', {
  id: integer('id').primaryKey().default(1),
  siteAdi: text('site_adi').notNull().default('Organik Şifa'),
  whatsappNumarasi: text('whatsapp_numarasi'),
  whatsappSablon: text('whatsapp_sablon'),
  kargoBedavaAcik: boolean('kargo_bedava_acik').notNull().default(true),
  kargoBedavaLimit: numeric('kargo_bedava_limit', { precision: 10, scale: 2 }),
  kargoUcreti: numeric('kargo_ucreti', { precision: 10, scale: 2 }),
  varsayilanKdv: numeric('varsayilan_kdv', { precision: 4, scale: 2 }),
  duyuruMetni: text('duyuru_metni'),
  duyuruAcik: boolean('duyuru_acik').notNull().default(false),
  instagramUrl: text('instagram_url'),
  iletisimTelefon: text('iletisim_telefon'),
  iletisimEmail: text('iletisim_email'),
  ticaretUnvani: text('ticaret_unvani'),
  adres: text('adres'),
  mersisNo: text('mersis_no'),
  vergiDairesi: text('vergi_dairesi'),
  vergiNo: text('vergi_no'),
  etbisDogrulamaUrl: text('etbis_dogrulama_url'),
  bildirimKanallari: jsonb('bildirim_kanallari').$type<Record<string, boolean>>().default({}),
  guncellendiAt: timestamp('guncellendi_at', { withTimezone: true }).notNull().defaultNow(),
})

export const rateLimits = pgTable('rate_limits', {
  anahtar: text('anahtar').primaryKey(),
  sayac: integer('sayac').notNull().default(0),
  pencereAt: timestamp('pencere_at', { withTimezone: true }).notNull().defaultNow(),
})

export const adminProfiles = pgTable('admin_profiles', {
  id: uuid('id').primaryKey(),
  ad: text('ad').notNull(),
  rol: text('rol').notNull().default('staff'), // owner | staff
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
```

- [ ] **Step 8: `src/db/schema/index.ts` (barrel) yaz**

```ts
export * from './catalog'
export * from './orders'
export * from './reviews'
export * from './system'
```

- [ ] **Step 9: Migration üret ve uygula**

```bash
npm run db:generate
npm run db:migrate
```

- [ ] **Step 10: Sipariş numarası sequence'ini ekle**

`drizzle/0001_siparis_sequence.sql` dosyasını elle oluştur:

```sql
CREATE SEQUENCE IF NOT EXISTS siparis_no_seq START 1;

CREATE OR REPLACE FUNCTION yeni_siparis_no() RETURNS text AS $$
  SELECT 'ORD-' || lpad(nextval('siparis_no_seq')::text, 6, '0');
$$ LANGUAGE sql VOLATILE;
```

Supabase SQL Editor'da çalıştır. **Neden sequence:** "son siparişi bul, 1 ekle"
mantığı iki eşzamanlı siparişte aynı numarayı üretir.

- [ ] **Step 11: `src/db/seed.ts` yaz ve çalıştır**

```ts
import 'dotenv/config'
import { db } from './index'
import { categories, settings } from './schema'
import { slugify } from '../lib/slug'

const KATEGORILER = [
  'Setler', 'Takviye Ürünler', 'Cilt Bakımı',
  'Bitkisel Yağlar', 'Çay & Detoks', 'Sabun & Temizlik',
]

async function main() {
  await db.insert(settings).values({ id: 1 }).onConflictDoNothing()

  for (const [i, ad] of KATEGORILER.entries()) {
    await db.insert(categories)
      .values({ ad, slug: slugify(ad), sira: i })
      .onConflictDoNothing()
  }
  console.log('Baslangic verisi yuklendi.')
  process.exit(0)
}

main()
```

`package.json`'a ekle: `"db:seed": "npx tsx src/db/seed.ts"` ve `npm i -D tsx`

```bash
npm run db:seed
```

- [ ] **Step 12: Doğrula**

```bash
npm run db:studio
```
Beklenen: Tarayıcıda 11 tablo görünür, `categories` 6 satır, `settings` 1 satır.

- [ ] **Step 13: Commit**

```bash
git add src/db drizzle drizzle.config.ts package.json
git commit -m "feat: veritabani semasi, migration ve baslangic verisi"
```

---

### Task 5: Panel girişi ve yetki koruması

**Files:**
- Create: `src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts`, `src/middleware.ts`
- Create: `src/actions/auth.ts`
- Create: `src/app/panel/giris/page.tsx`, `src/app/panel/layout.tsx`, `src/app/panel/page.tsx`
- Create: `src/components/panel/PanelNav.tsx`

**Interfaces:**
- Consumes: Task 4 `db`, `adminProfiles`
- Produces:
  - `supabaseSunucu(): Promise<SupabaseClient>`
  - `mevcutAdmin(): Promise<{ id: string; ad: string; rol: string } | null>`
  - `girisYap(prevState, formData): Promise<{ hata?: string }>`
  - `cikisYap(): Promise<void>`

- [ ] **Step 1: `src/lib/supabase/server.ts`**

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function supabaseSunucu() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => {
          try { list.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) }
          catch { /* Server Component icinden cagrildiginda yazilamaz — middleware yeniler */ }
        },
      },
    },
  )
}
```

- [ ] **Step 2: `src/lib/supabase/middleware.ts`**

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function oturumYenile(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()

  const panelde = request.nextUrl.pathname.startsWith('/panel')
  const giriste = request.nextUrl.pathname === '/panel/giris'

  if (panelde && !giriste && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/panel/giris'
    return NextResponse.redirect(url)
  }
  if (giriste && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/panel'
    return NextResponse.redirect(url)
  }
  return response
}
```

- [ ] **Step 3: `src/middleware.ts`**

```ts
import { type NextRequest } from 'next/server'
import { oturumYenile } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return oturumYenile(request)
}

export const config = {
  matcher: ['/panel/:path*'],
}
```

- [ ] **Step 4: `src/actions/auth.ts`**

```ts
'use server'

import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { supabaseSunucu } from '@/lib/supabase/server'
import { db } from '@/db'
import { adminProfiles } from '@/db/schema'

const GirisSemasi = z.object({
  email: z.string().email('Geçerli bir e-posta adresi yaz'),
  sifre: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
})

export type GirisDurumu = { hata?: string }

export async function girisYap(_prev: GirisDurumu, formData: FormData): Promise<GirisDurumu> {
  const parsed = GirisSemasi.safeParse({
    email: formData.get('email'),
    sifre: formData.get('sifre'),
  })
  if (!parsed.success) {
    return { hata: parsed.error.issues[0].message }
  }

  const supabase = await supabaseSunucu()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.sifre,
  })

  if (error) return { hata: 'E-posta veya şifre hatalı. Tekrar dene.' }
  redirect('/panel')
}

export async function cikisYap() {
  const supabase = await supabaseSunucu()
  await supabase.auth.signOut()
  redirect('/panel/giris')
}

export async function mevcutAdmin() {
  const supabase = await supabaseSunucu()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [profil] = await db.select().from(adminProfiles).where(eq(adminProfiles.id, user.id))
  if (profil) return profil

  // Ilk giris: profil otomatik olusur
  const [yeni] = await db.insert(adminProfiles)
    .values({ id: user.id, ad: user.email?.split('@')[0] ?? 'Yönetici', rol: 'owner' })
    .returning()
  return yeni
}
```

- [ ] **Step 5: `src/app/panel/giris/page.tsx`**

```tsx
'use client'

import { useActionState } from 'react'
import { girisYap, type GirisDurumu } from '@/actions/auth'

export default function GirisSayfasi() {
  const [durum, action, bekliyor] = useActionState<GirisDurumu, FormData>(girisYap, {})

  return (
    <main className="min-h-dvh grid place-items-center bg-notr-100 p-4">
      <form action={action} className="w-full max-w-sm bg-notr-0 rounded-panel p-6 space-y-5">
        <h1 className="text-2xl text-yesil-700">Organik Şifa</h1>
        <p className="text-notr-600 text-sm">Yönetim paneline giriş yap</p>

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium">E-posta</label>
          <input id="email" name="email" type="email" autoComplete="email" required
            className="w-full h-12 px-3 rounded-kontrol border border-notr-200
                       focus-visible:border-yesil-700" />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="sifre" className="block text-sm font-medium">Şifre</label>
          <input id="sifre" name="sifre" type="password" autoComplete="current-password" required
            className="w-full h-12 px-3 rounded-kontrol border border-notr-200
                       focus-visible:border-yesil-700" />
        </div>

        {durum.hata && (
          <p role="alert" className="text-sm text-hata">{durum.hata}</p>
        )}

        <button type="submit" disabled={bekliyor}
          className="w-full h-12 rounded-kontrol bg-yesil-700 text-notr-0 font-medium
                     disabled:opacity-50 cursor-pointer">
          {bekliyor ? 'Giriş yapılıyor…' : 'Giriş yap'}
        </button>
      </form>
    </main>
  )
}
```

- [ ] **Step 6: `src/components/panel/PanelNav.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, ShoppingBag, Tags, MessageSquare, Settings, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

const BAGLANTILAR = [
  { href: '/panel', etiket: 'Ana Sayfa', Ikon: Home },
  { href: '/panel/urunler', etiket: 'Ürünler', Ikon: Package },
  { href: '/panel/siparisler', etiket: 'Siparişler', Ikon: ShoppingBag },
  { href: '/panel/kategoriler', etiket: 'Kategoriler', Ikon: Tags },
  { href: '/panel/yorumlar', etiket: 'Yorumlar', Ikon: MessageSquare },
  { href: '/panel/ayarlar', etiket: 'Ayarlar', Ikon: Settings },
]

export function PanelNav() {
  const yol = usePathname()

  return (
    <nav aria-label="Panel menüsü"
      className="fixed bottom-0 inset-x-0 z-40 bg-notr-0 border-t border-notr-200
                 md:static md:border-t-0 md:border-r md:h-dvh md:w-56 md:shrink-0">
      <ul className="flex md:flex-col md:p-3 md:gap-1">
        {BAGLANTILAR.map(({ href, etiket, Ikon }) => {
          const aktif = href === '/panel' ? yol === href : yol.startsWith(href)
          return (
            <li key={href} className="flex-1">
              <Link href={href}
                aria-current={aktif ? 'page' : undefined}
                className={cn(
                  'flex flex-col md:flex-row items-center md:gap-3 gap-1',
                  'min-h-[56px] md:min-h-[44px] px-2 md:px-3 justify-center md:justify-start',
                  'rounded-kontrol text-xs md:text-sm',
                  aktif ? 'bg-yesil-100 text-yesil-800 font-medium' : 'text-notr-600',
                )}>
                <Ikon size={20} aria-hidden="true" />
                <span>{etiket}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
```

- [ ] **Step 7: `src/app/panel/layout.tsx`**

```tsx
import { redirect } from 'next/navigation'
import { mevcutAdmin, cikisYap } from '@/actions/auth'
import { PanelNav } from '@/components/panel/PanelNav'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await mevcutAdmin()
  if (!admin) redirect('/panel/giris')

  return (
    <div className="min-h-dvh md:flex bg-notr-100">
      <PanelNav />
      <div className="flex-1 min-w-0 pb-24 md:pb-0">
        <header className="flex items-center justify-between gap-4 px-4 h-14 bg-notr-0
                           border-b border-notr-200">
          <span className="text-sm text-notr-600 truncate">Merhaba, {admin.ad}</span>
          <form action={cikisYap}>
            <button type="submit"
              className="min-h-[44px] px-3 text-sm text-notr-600 cursor-pointer">
              Çıkış
            </button>
          </form>
        </header>
        <main className="p-4 md:p-6 max-w-5xl">{children}</main>
      </div>
    </div>
  )
}
```

`/panel/giris` bu layout'un ALTINDA değildir — kendi `main`'ini render eder ve
middleware zaten girişli kullanıcıyı `/panel`'e yollar.

- [ ] **Step 8: `src/app/panel/page.tsx` (geçici)**

```tsx
export default function PanelAnaSayfa() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl text-yesil-700">Panel</h1>
      <p className="text-notr-600">Sipariş özeti Faz 4'te eklenecek.</p>
    </div>
  )
}
```

- [ ] **Step 9: Yönetici hesabı oluştur ve test et**

Supabase Dashboard → Authentication → Users → **Add user** → e-posta + şifre
(«Auto Confirm User» işaretli).

```bash
npm run dev
```

**Doğrula:**
1. `http://localhost:3000/panel` → `/panel/giris`'e yönlenir
2. Yanlış şifre → "E-posta veya şifre hatalı. Tekrar dene."
3. Doğru şifre → `/panel` açılır, "Merhaba, ..." görünür
4. Tarayıcıyı 375 px'e daralt → menü **alta** taşınır, her öğe ≥ 44 px
5. Çıkış → `/panel/giris`

- [ ] **Step 10: Commit**

```bash
git add src/lib/supabase src/middleware.ts src/actions/auth.ts src/app/panel src/components/panel
git commit -m "feat: panel girisi, oturum korumasi ve responsive panel kabugu"
```

---

### Task 6: Kategoriler ekranı

**Files:**
- Create: `src/actions/categories.ts`
- Create: `src/app/panel/kategoriler/page.tsx`
- Create: `src/components/panel/KategoriSatiri.tsx`

**Interfaces:**
- Consumes: Task 2 `slugify`/`benzersizSlug`, Task 4 `db`/`categories`, Task 5 `mevcutAdmin`
- Produces:
  - `kategorileriGetir(): Promise<Kategori[]>`
  - `kategoriEkle(prev, formData): Promise<{ hata?: string }>`
  - `kategoriGuncelle(id: string, ad: string): Promise<{ hata?: string }>`
  - `kategoriAktiflikDegistir(id: string, aktif: boolean): Promise<void>`

- [ ] **Step 1: `src/actions/categories.ts`**

```ts
'use server'

import { revalidatePath } from 'next/cache'
import { asc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { categories } from '@/db/schema'
import { benzersizSlug } from '@/lib/slug'
import { mevcutAdmin } from './auth'

export type Kategori = typeof categories.$inferSelect

async function yetkiKontrol() {
  const admin = await mevcutAdmin()
  if (!admin) throw new Error('Yetkisiz')
  return admin
}

export async function kategorileriGetir(): Promise<Kategori[]> {
  return db.select().from(categories).orderBy(asc(categories.sira), asc(categories.ad))
}

const AdSemasi = z.string().trim().min(2, 'Kategori adı en az 2 harf olmalı').max(60)

export async function kategoriEkle(_prev: { hata?: string }, formData: FormData) {
  await yetkiKontrol()
  const parsed = AdSemasi.safeParse(formData.get('ad'))
  if (!parsed.success) return { hata: parsed.error.issues[0].message }

  const mevcut = await db.select({ slug: categories.slug }).from(categories)
  const slug = benzersizSlug(parsed.data, mevcut.map((k) => k.slug))
  const [enSon] = await db.select({ sira: categories.sira }).from(categories)
    .orderBy(asc(categories.sira))

  await db.insert(categories).values({
    ad: parsed.data,
    slug,
    sira: (enSon?.sira ?? 0) + 10,
  })

  revalidatePath('/panel/kategoriler')
  return {}
}

export async function kategoriGuncelle(id: string, ad: string) {
  await yetkiKontrol()
  const parsed = AdSemasi.safeParse(ad)
  if (!parsed.success) return { hata: parsed.error.issues[0].message }

  await db.update(categories).set({ ad: parsed.data }).where(eq(categories.id, id))
  revalidatePath('/panel/kategoriler')
  return {}
}

export async function kategoriAktiflikDegistir(id: string, aktif: boolean) {
  await yetkiKontrol()
  await db.update(categories).set({ aktif }).where(eq(categories.id, id))
  revalidatePath('/panel/kategoriler')
}
```

- [ ] **Step 2: `src/components/panel/KategoriSatiri.tsx`**

```tsx
'use client'

import { useState, useTransition } from 'react'
import { Check, Pencil, X } from 'lucide-react'
import { kategoriGuncelle, kategoriAktiflikDegistir, type Kategori } from '@/actions/categories'

export function KategoriSatiri({ kategori }: { kategori: Kategori }) {
  const [duzenle, setDuzenle] = useState(false)
  const [ad, setAd] = useState(kategori.ad)
  const [hata, setHata] = useState<string>()
  const [bekliyor, basla] = useTransition()

  function kaydet() {
    basla(async () => {
      const sonuc = await kategoriGuncelle(kategori.id, ad)
      if (sonuc.hata) { setHata(sonuc.hata); return }
      setHata(undefined)
      setDuzenle(false)
    })
  }

  return (
    <li className="flex items-center gap-3 py-2 border-b border-notr-200 last:border-0">
      {duzenle ? (
        <>
          <input value={ad} onChange={(e) => setAd(e.target.value)} autoFocus
            className="flex-1 h-11 px-3 rounded-kontrol border border-notr-200" />
          <button onClick={kaydet} disabled={bekliyor} aria-label="Kaydet"
            className="size-11 grid place-items-center text-yesil-700 cursor-pointer">
            <Check size={20} />
          </button>
          <button onClick={() => { setDuzenle(false); setAd(kategori.ad) }} aria-label="Vazgeç"
            className="size-11 grid place-items-center text-notr-600 cursor-pointer">
            <X size={20} />
          </button>
        </>
      ) : (
        <>
          <span className="flex-1 truncate">{kategori.ad}</span>
          <label className="flex items-center gap-2 text-sm text-notr-600 cursor-pointer">
            <input type="checkbox" defaultChecked={kategori.aktif} className="size-5"
              onChange={(e) => basla(() =>
                kategoriAktiflikDegistir(kategori.id, e.target.checked).then(() => {}))} />
            Görünür
          </label>
          <button onClick={() => setDuzenle(true)} aria-label={`${kategori.ad} adını değiştir`}
            className="size-11 grid place-items-center text-notr-600 cursor-pointer">
            <Pencil size={18} />
          </button>
        </>
      )}
      {hata && <p role="alert" className="text-sm text-hata w-full">{hata}</p>}
    </li>
  )
}
```

- [ ] **Step 3: `src/app/panel/kategoriler/page.tsx`**

```tsx
import { kategorileriGetir } from '@/actions/categories'
import { KategoriSatiri } from '@/components/panel/KategoriSatiri'
import { KategoriEkleFormu } from '@/components/panel/KategoriEkleFormu'

export default async function KategorilerSayfasi() {
  const kategoriler = await kategorileriGetir()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-yesil-700">Kategoriler</h1>
        <p className="text-notr-600 text-sm mt-1">
          Ürünleri gruplamak için kullanılır. Görünürlüğü kapatılan kategori sitede çıkmaz.
        </p>
      </div>

      <KategoriEkleFormu />

      <ul className="bg-notr-0 rounded-panel px-4">
        {kategoriler.map((k) => <KategoriSatiri key={k.id} kategori={k} />)}
      </ul>
    </div>
  )
}
```

- [ ] **Step 4: `src/components/panel/KategoriEkleFormu.tsx`**

```tsx
'use client'

import { useActionState, useRef, useEffect } from 'react'
import { kategoriEkle } from '@/actions/categories'

export function KategoriEkleFormu() {
  const [durum, action, bekliyor] = useActionState(kategoriEkle, {} as { hata?: string })
  const ref = useRef<HTMLFormElement>(null)

  useEffect(() => { if (!bekliyor && !durum.hata) ref.current?.reset() }, [bekliyor, durum.hata])

  return (
    <form ref={ref} action={action} className="flex gap-2 items-start">
      <div className="flex-1">
        <label htmlFor="ad" className="sr-only">Yeni kategori adı</label>
        <input id="ad" name="ad" required placeholder="Yeni kategori adı"
          className="w-full h-12 px-3 rounded-kontrol border border-notr-200 bg-notr-0" />
        {durum.hata && <p role="alert" className="text-sm text-hata mt-1">{durum.hata}</p>}
      </div>
      <button type="submit" disabled={bekliyor}
        className="h-12 px-5 rounded-kontrol bg-yesil-700 text-notr-0 font-medium
                   disabled:opacity-50 cursor-pointer shrink-0">
        Ekle
      </button>
    </form>
  )
}
```

- [ ] **Step 5: Doğrula**

```bash
npm run dev
```
`/panel/kategoriler`:
1. 6 hazır kategori listelenir
2. "Deneme" ekle → listede çıkar
3. Kalem ikonu → adı "Deneme 2" yap → kaydet → değişir
4. "Görünür" kutusunu kaldır → sayfa yenilendiğinde kapalı kalır
5. Tek harf gir → "Kategori adı en az 2 harf olmalı"
6. 375 px'te satırlar taşmaz, butonlar ≥ 44 px

- [ ] **Step 6: Commit**

```bash
git add src/actions/categories.ts src/app/panel/kategoriler src/components/panel
git commit -m "feat: kategori yonetimi ekrani"
```

---

### Task 7: Görsel yükleme hattı (tarayıcı tarafı)

**Files:**
- Create: `src/lib/image-upload.ts`
- Create: `src/actions/uploads.ts`
- Create: `src/components/panel/ImageUploader.tsx`
- Create: `src/components/panel/ImageCropper.tsx`

**Interfaces:**
- Consumes: Task 3 `tekRenkKenarlariKirp`/`zeminRengi`/`Pikseller`
- Produces:
  - `type HazirGorsel = { blob: Blob; genislik: number; yukseklik: number; zeminRengi: string; onizlemeUrl: string }`
  - `gorseliHazirla(file: File, kirpma?: Kutu): Promise<HazirGorsel>`
  - `imzaliYuklemeUrlAl(dosyaAdi: string): Promise<{ path: string; token: string }>`
  - `<ImageUploader value={...} onChange={...} />`

- [ ] **Step 1: Supabase Storage kovasını oluştur**

Supabase Dashboard → Storage → New bucket:
- Ad: `urunler`
- **Public bucket: AÇIK**

> Kova neden public: Okuma imzalı URL ile yapılsaydı her URL benzersiz olur, CDN
> önbelleğe alamaz ve Supabase'in 5 GB/ay trafik kotası ~10 kat erken dolardı.
> İmzalı URL yalnızca **yükleme** içindir.

- [ ] **Step 2: `src/lib/image-upload.ts`**

```ts
import imageCompression from 'browser-image-compression'
import { tekRenkKenarlariKirp, zeminRengi, type Kutu, type Pikseller } from './image-analysis'

export type HazirGorsel = {
  blob: Blob
  genislik: number
  yukseklik: number
  zeminRengi: string
  onizlemeUrl: string
}

const HEIC = /\.(heic|heif)$/i

/** Dosyayı bir <canvas>'a çizip piksellerine erişilebilir hale getirir. */
async function tuvaleCiz(file: File): Promise<{ canvas: HTMLCanvasElement; px: Pikseller }> {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  return {
    canvas,
    px: { data: imageData.data, width: canvas.width, height: canvas.height },
  }
}

/**
 * Görseli panelde kullanılabilir hale getirir:
 * HEIC kontrolü → (varsa) kullanıcı kırpması → letterbox temizliği →
 * zemin rengi ölçümü → WebP sıkıştırma.
 * Sıkıştırma TARAYICIDA yapılır; sunucuya ~180 KB gider.
 */
export async function gorseliHazirla(file: File, kirpma?: Kutu): Promise<HazirGorsel> {
  if (HEIC.test(file.name) || file.type === 'image/heic' || file.type === 'image/heif') {
    throw new Error(
      'Bu fotoğraf iPhone HEIC biçiminde ve tarayıcı açamıyor. ' +
      'Telefonda Ayarlar > Kamera > Biçimler > "En Uyumlu" seçip tekrar çek, ' +
      'ya da fotoğrafı WhatsApp\'tan kendine gönderip oradan indir.',
    )
  }

  const { canvas, px } = await tuvaleCiz(file)

  const kutu = kirpma ?? tekRenkKenarlariKirp(px)
  const renk = zeminRengi(px, kutu)

  // Kırpılmış alanı yeni bir tuvale aktar
  const hedef = document.createElement('canvas')
  hedef.width = kutu.w
  hedef.height = kutu.h
  hedef.getContext('2d')!.drawImage(canvas, kutu.x, kutu.y, kutu.w, kutu.h, 0, 0, kutu.w, kutu.h)

  const ham: Blob = await new Promise((res, rej) =>
    hedef.toBlob((b) => (b ? res(b) : rej(new Error('Görsel işlenemedi'))), 'image/webp', 0.92),
  )

  const blob = await imageCompression(new File([ham], 'gorsel.webp', { type: 'image/webp' }), {
    maxSizeMB: 0.25,
    maxWidthOrHeight: 1600,
    fileType: 'image/webp',
    useWebWorker: true,
  })

  return {
    blob,
    genislik: kutu.w,
    yukseklik: kutu.h,
    zeminRengi: renk,
    onizlemeUrl: URL.createObjectURL(blob),
  }
}
```

- [ ] **Step 3: `src/actions/uploads.ts`**

```ts
'use server'

import { createClient } from '@supabase/supabase-js'
import { mevcutAdmin } from './auth'

const KOVA = 'urunler'

function servisIstemcisi() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  )
}

/** Tarayıcının doğrudan Storage'a yüklemesi için tek kullanımlık imzalı URL üretir. */
export async function imzaliYuklemeUrlAl(uzanti = 'webp') {
  const admin = await mevcutAdmin()
  if (!admin) throw new Error('Yetkisiz')

  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${uzanti}`
  const { data, error } = await servisIstemcisi()
    .storage.from(KOVA).createSignedUploadUrl(path)

  if (error || !data) throw new Error('Yükleme adresi alınamadı')
  return { path: data.path, token: data.token }
}

export async function depodanSil(paths: string[]) {
  const admin = await mevcutAdmin()
  if (!admin) throw new Error('Yetkisiz')
  if (paths.length === 0) return
  await servisIstemcisi().storage.from(KOVA).remove(paths)
}

export function genelUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${KOVA}/${path}`
}
```

- [ ] **Step 4: `src/components/panel/ImageCropper.tsx`**

Sürüklenebilir tek kutulu, atlanabilir kırpma. Telefon arayüzü (saat, pil,
WhatsApp çubuğu) içeren görseller için gerekli.

```tsx
'use client'

import { useRef, useState } from 'react'
import type { Kutu } from '@/lib/image-analysis'

export function ImageCropper({
  src, genislik, yukseklik, onTamam, onAtla,
}: {
  src: string; genislik: number; yukseklik: number
  onTamam: (kutu: Kutu) => void; onAtla: () => void
}) {
  const [kutu, setKutu] = useState<Kutu>({ x: 0, y: 0, w: genislik, h: yukseklik })
  const [surukle, setSurukle] = useState<{ x: number; y: number } | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  function konum(e: React.PointerEvent) {
    const r = ref.current!.getBoundingClientRect()
    return {
      x: Math.round(((e.clientX - r.left) / r.width) * genislik),
      y: Math.round(((e.clientY - r.top) / r.height) * yukseklik),
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-notr-600">
        Gereksiz kısımları çıkarmak için fotoğrafın üzerinde sürükle. Gerekmiyorsa atla.
      </p>

      <div ref={ref} className="relative select-none touch-none rounded-gorsel overflow-hidden"
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setSurukle(konum(e)) }}
        onPointerMove={(e) => {
          if (!surukle) return
          const p = konum(e)
          setKutu({
            x: Math.min(surukle.x, p.x), y: Math.min(surukle.y, p.y),
            w: Math.abs(p.x - surukle.x), h: Math.abs(p.y - surukle.y),
          })
        }}
        onPointerUp={() => setSurukle(null)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="w-full block" draggable={false} />
        {kutu.w > 8 && kutu.h > 8 && (
          <div className="absolute border-2 border-yesil-700 bg-yesil-700/10 pointer-events-none"
            style={{
              left: `${(kutu.x / genislik) * 100}%`, top: `${(kutu.y / yukseklik) * 100}%`,
              width: `${(kutu.w / genislik) * 100}%`, height: `${(kutu.h / yukseklik) * 100}%`,
            }} />
        )}
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={onAtla}
          className="flex-1 h-12 rounded-kontrol border border-notr-200 cursor-pointer">
          Kırpmadan devam et
        </button>
        <button type="button" disabled={kutu.w < 16 || kutu.h < 16}
          onClick={() => onTamam(kutu)}
          className="flex-1 h-12 rounded-kontrol bg-yesil-700 text-notr-0 font-medium
                     disabled:opacity-40 cursor-pointer">
          Kırp ve kullan
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: `src/components/panel/ImageUploader.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { ImagePlus, Trash2, GripVertical } from 'lucide-react'
import { gorseliHazirla } from '@/lib/image-upload'
import { imzaliYuklemeUrlAl, genelUrl } from '@/actions/uploads'
import { ImageCropper } from './ImageCropper'
import type { Kutu } from '@/lib/image-analysis'

export type GorselKaydi = {
  url: string; storagePath: string; genislik: number; yukseklik: number
  zeminRengi: string; alt: string
}

const anonIstemci = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export function ImageUploader({
  value, onChange,
}: { value: GorselKaydi[]; onChange: (g: GorselKaydi[]) => void }) {
  const [bekleyen, setBekleyen] = useState<{ file: File; src: string; w: number; h: number } | null>(null)
  const [ilerleme, setIlerleme] = useState<string>()
  const [hata, setHata] = useState<string>()

  async function dosyaSecildi(file: File) {
    setHata(undefined)
    const bitmap = await createImageBitmap(file)
    setBekleyen({ file, src: URL.createObjectURL(file), w: bitmap.width, h: bitmap.height })
    bitmap.close()
  }

  async function yukle(file: File, kirpma?: Kutu) {
    setBekleyen(null)
    try {
      setIlerleme('Fotoğraf hazırlanıyor…')
      const hazir = await gorseliHazirla(file, kirpma)

      setIlerleme('Yükleniyor…')
      const { path, token } = await imzaliYuklemeUrlAl()
      const { error } = await anonIstemci.storage
        .from('urunler')
        .uploadToSignedUrl(path, token, hazir.blob, { contentType: 'image/webp' })
      if (error) throw new Error('Yükleme tamamlanamadı. İnternet bağlantını kontrol et.')

      onChange([...value, {
        url: genelUrl(path), storagePath: path,
        genislik: hazir.genislik, yukseklik: hazir.yukseklik,
        zeminRengi: hazir.zeminRengi, alt: '',
      }])
    } catch (e) {
      setHata(e instanceof Error ? e.message : 'Fotoğraf yüklenemedi')
    } finally {
      setIlerleme(undefined)
    }
  }

  if (bekleyen) {
    return <ImageCropper src={bekleyen.src} genislik={bekleyen.w} yukseklik={bekleyen.h}
      onTamam={(k) => yukle(bekleyen.file, k)} onAtla={() => yukle(bekleyen.file)} />
  }

  return (
    <div className="space-y-3">
      <ul className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {value.map((g, i) => (
          <li key={g.storagePath} className="relative">
            <div className="aspect-square rounded-gorsel overflow-hidden grid place-items-center"
              style={{ backgroundColor: g.zeminRengi }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.url} alt="" className="max-w-full max-h-full object-contain" />
            </div>
            {i === 0 && (
              <span className="absolute top-1 left-1 text-[11px] bg-yesil-700 text-notr-0
                               px-1.5 py-0.5 rounded">Kapak</span>
            )}
            <button type="button" aria-label="Fotoğrafı kaldır"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="absolute -top-2 -right-2 size-9 grid place-items-center rounded-full
                         bg-notr-0 border border-notr-200 cursor-pointer">
              <Trash2 size={16} className="text-hata" />
            </button>
            {i > 0 && (
              <button type="button" aria-label="Kapak yap"
                onClick={() => onChange([g, ...value.filter((_, j) => j !== i)])}
                className="absolute bottom-1 left-1 text-[11px] bg-notr-0/90 px-1.5 py-0.5
                           rounded cursor-pointer">
                <GripVertical size={12} className="inline" /> Kapak yap
              </button>
            )}
          </li>
        ))}

        <li>
          <label className="aspect-square rounded-gorsel border-2 border-dashed border-notr-200
                            grid place-items-center gap-1 cursor-pointer text-notr-600 text-xs
                            text-center p-2">
            <ImagePlus size={24} aria-hidden="true" />
            <span>Fotoğraf ekle</span>
            <input type="file" accept="image/*" className="sr-only"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) dosyaSecildi(f); e.target.value = '' }} />
          </label>
        </li>
      </ul>

      {ilerleme && <p className="text-sm text-notr-600" aria-live="polite">{ilerleme}</p>}
      {hata && <p role="alert" className="text-sm text-hata">{hata}</p>}
      <p className="text-xs text-notr-400">
        İlk fotoğraf ürün kartında görünür. Fotoğraflar otomatik küçültülür.
      </p>
    </div>
  )
}
```

- [ ] **Step 6: Doğrula**

Geçici bir test sayfası (`src/app/panel/gorsel-test/page.tsx`) yaz, `ImageUploader`'ı
boş dizi ile render et ve şunları test et:

1. `ürünler/` klasöründeki dikey infografiği yükle → kırpma ekranı açılır
2. "Kırpmadan devam et" → önizleme, zemin rengi **siyah değil**
3. Aynı görseli tekrar yükle, bu sefer bir alan seç → sadece o alan yüklenir
4. Yüklenen dosyanın Supabase Storage'da olduğunu ve **250 KB altında** olduğunu doğrula
5. Kapak rozeti ilk görselde
6. 375 px'te ızgara 3 sütun, butonlar taşmıyor

Test sayfasını sonra sil.

- [ ] **Step 7: Commit**

```bash
git add src/lib/image-upload.ts src/actions/uploads.ts src/components/panel
git commit -m "feat: gorsel yukleme hatti - kirpma, WebP sikistirma, imzali yukleme"
```

---

### Task 8: Ürün formu (ekle / düzenle)

**Files:**
- Create: `src/actions/products.ts`
- Create: `src/app/panel/urunler/yeni/page.tsx`, `src/app/panel/urunler/[id]/page.tsx`
- Create: `src/components/panel/UrunFormu.tsx`

**Interfaces:**
- Consumes: Task 2 `fiyatAyristir`/`benzersizSlug`, Task 6 `kategorileriGetir`, Task 7 `ImageUploader`/`GorselKaydi`
- Produces:
  - `urunKaydet(girdi: UrunGirdisi): Promise<{ hata?: string; id?: string }>`
  - `urunGetir(id: string): Promise<UrunDetay | null>`
  - `type UrunGirdisi` (aşağıda tanımlı)

- [ ] **Step 1: `src/actions/products.ts`**

```ts
'use server'

import { revalidatePath } from 'next/cache'
import { eq, ne, and } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { products, productImages } from '@/db/schema'
import { benzersizSlug } from '@/lib/slug'
import { fiyatAyristir } from '@/lib/price'
import { mevcutAdmin } from './auth'
import { depodanSil } from './uploads'

const GorselSemasi = z.object({
  url: z.string().url(),
  storagePath: z.string().min(1),
  genislik: z.number().int().positive(),
  yukseklik: z.number().int().positive(),
  zeminRengi: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  alt: z.string().default(''),
})

const UrunSemasi = z.object({
  id: z.string().uuid().optional(),
  baslik: z.string().trim().min(3, 'Ürün adı en az 3 harf olmalı').max(160),
  fiyatMetni: z.string().min(1, 'Fiyat girmen gerekiyor — örnek: 450'),
  eskiFiyatMetni: z.string().optional(),
  kategoriId: z.string().uuid('Kategori seçmen gerekiyor'),
  markaId: z.string().uuid().optional().nullable(),
  kisaAciklama: z.string().max(300).optional(),
  aciklama: z.string().optional(),
  setIcerigi: z.array(z.string().trim().min(1)).default([]),
  stokta: z.boolean().default(true),
  yayinda: z.boolean().default(true),
  oneCikan: z.boolean().default(false),
  kargoBedava: z.boolean().default(false),
  gorseller: z.array(GorselSemasi).min(1, 'En az bir fotoğraf eklemen gerekiyor'),
})

export type UrunGirdisi = z.input<typeof UrunSemasi>

export async function urunKaydet(girdi: UrunGirdisi): Promise<{ hata?: string; id?: string }> {
  const admin = await mevcutAdmin()
  if (!admin) return { hata: 'Oturumun kapanmış. Tekrar giriş yap.' }

  const parsed = UrunSemasi.safeParse(girdi)
  if (!parsed.success) return { hata: parsed.error.issues[0].message }
  const v = parsed.data

  const fiyat = fiyatAyristir(v.fiyatMetni)
  if (fiyat === null) return { hata: 'Fiyatı anlayamadım. Örnek: 450 veya 1.250,00' }
  if (fiyat === 0) return { hata: 'Fiyat sıfır olamaz' }

  let eskiFiyat: number | null = null
  if (v.eskiFiyatMetni?.trim()) {
    eskiFiyat = fiyatAyristir(v.eskiFiyatMetni)
    if (eskiFiyat === null) return { hata: 'Eski fiyatı anlayamadım. Boş bırakabilirsin.' }
    if (eskiFiyat <= fiyat) return { hata: 'Eski fiyat, yeni fiyattan büyük olmalı' }
  }

  const mevcutSluglar = await db
    .select({ slug: products.slug })
    .from(products)
    .where(v.id ? ne(products.id, v.id) : undefined)

  const ortak = {
    baslik: v.baslik,
    fiyat: fiyat.toFixed(2),
    eskiFiyat: eskiFiyat?.toFixed(2) ?? null,
    kategoriId: v.kategoriId,
    markaId: v.markaId ?? null,
    kisaAciklama: v.kisaAciklama ?? null,
    aciklama: v.aciklama ?? null,
    setIcerigi: v.setIcerigi.length ? v.setIcerigi : null,
    stokta: v.stokta,
    yayinda: v.yayinda,
    oneCikan: v.oneCikan,
    kargoBedava: v.kargoBedava,
    updatedAt: new Date(),
  }

  let urunId: string

  if (v.id) {
    const [mevcut] = await db.select().from(products).where(eq(products.id, v.id))
    if (!mevcut) return { hata: 'Ürün bulunamadı' }

    const slug = mevcut.baslik === v.baslik
      ? mevcut.slug
      : benzersizSlug(v.baslik, mevcutSluglar.map((s) => s.slug))

    await db.update(products).set({ ...ortak, slug }).where(eq(products.id, v.id))
    urunId = v.id

    const eskiler = await db.select().from(productImages).where(eq(productImages.urunId, v.id))
    const kalanYollar = new Set(v.gorseller.map((g) => g.storagePath))
    const silinecek = eskiler.filter((e) => !kalanYollar.has(e.storagePath))
    await db.delete(productImages).where(eq(productImages.urunId, v.id))
    if (silinecek.length) await depodanSil(silinecek.map((s) => s.storagePath))
  } else {
    const slug = benzersizSlug(v.baslik, mevcutSluglar.map((s) => s.slug))
    const [yeni] = await db.insert(products).values({ ...ortak, slug }).returning({ id: products.id })
    urunId = yeni.id
  }

  await db.insert(productImages).values(
    v.gorseller.map((g, i) => ({
      urunId,
      url: g.url,
      storagePath: g.storagePath,
      alt: g.alt || v.baslik,
      genislik: g.genislik,
      yukseklik: g.yukseklik,
      zeminRengi: g.zeminRengi,
      tur: i === 0 ? 'kapak' : (g.yukseklik > g.genislik * 1.4 ? 'infografik' : 'galeri'),
      sira: i,
    })),
  )

  revalidatePath('/panel/urunler')
  return { id: urunId }
}

export async function urunGetir(id: string) {
  const [urun] = await db.select().from(products).where(eq(products.id, id))
  if (!urun) return null
  const gorseller = await db.select().from(productImages).where(eq(productImages.urunId, id))
  return { urun, gorseller: gorseller.sort((a, b) => a.sira - b.sira) }
}

export async function urunAnahtarDegistir(
  id: string, alan: 'stokta' | 'yayinda', deger: boolean,
) {
  const admin = await mevcutAdmin()
  if (!admin) throw new Error('Yetkisiz')
  await db.update(products).set({ [alan]: deger, updatedAt: new Date() }).where(eq(products.id, id))
  revalidatePath('/panel/urunler')
}
```

- [ ] **Step 2: `src/components/panel/UrunFormu.tsx`**

```tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { urunKaydet } from '@/actions/products'
import { ImageUploader, type GorselKaydi } from './ImageUploader'
import type { Kategori } from '@/actions/categories'

type Baslangic = {
  id?: string; baslik: string; fiyatMetni: string; eskiFiyatMetni: string
  kategoriId: string; kisaAciklama: string; aciklama: string; setIcerigi: string
  stokta: boolean; yayinda: boolean; oneCikan: boolean; kargoBedava: boolean
  gorseller: GorselKaydi[]
}

const BOS: Baslangic = {
  baslik: '', fiyatMetni: '', eskiFiyatMetni: '', kategoriId: '',
  kisaAciklama: '', aciklama: '', setIcerigi: '',
  stokta: true, yayinda: true, oneCikan: false, kargoBedava: false, gorseller: [],
}

export function UrunFormu({
  kategoriler, baslangic = BOS,
}: { kategoriler: Kategori[]; baslangic?: Baslangic }) {
  const [d, setD] = useState(baslangic)
  const [hata, setHata] = useState<string>()
  const [bekliyor, basla] = useTransition()
  const router = useRouter()

  function kaydet() {
    setHata(undefined)
    basla(async () => {
      const sonuc = await urunKaydet({
        id: d.id,
        baslik: d.baslik,
        fiyatMetni: d.fiyatMetni,
        eskiFiyatMetni: d.eskiFiyatMetni,
        kategoriId: d.kategoriId,
        kisaAciklama: d.kisaAciklama,
        aciklama: d.aciklama,
        setIcerigi: d.setIcerigi.split('\n').map((s) => s.trim()).filter(Boolean),
        stokta: d.stokta, yayinda: d.yayinda,
        oneCikan: d.oneCikan, kargoBedava: d.kargoBedava,
        gorseller: d.gorseller,
      })
      if (sonuc.hata) { setHata(sonuc.hata); return }
      router.push('/panel/urunler')
    })
  }

  const alan = 'w-full min-h-[48px] px-3 py-2 rounded-kontrol border border-notr-200 bg-notr-0'
  const etiket = 'block text-sm font-medium mb-1.5'

  return (
    <form onSubmit={(e) => { e.preventDefault(); kaydet() }} className="space-y-8 pb-24">
      <section className="bg-notr-0 rounded-panel p-4 space-y-4">
        <h2 className="text-lg text-yesil-700">Fotoğraflar</h2>
        <ImageUploader value={d.gorseller} onChange={(g) => setD({ ...d, gorseller: g })} />
      </section>

      <section className="bg-notr-0 rounded-panel p-4 space-y-4">
        <h2 className="text-lg text-yesil-700">Ürün bilgisi</h2>

        <div>
          <label htmlFor="baslik" className={etiket}>Ürün adı</label>
          <input id="baslik" className={alan} value={d.baslik} required
            onChange={(e) => setD({ ...d, baslik: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="fiyat" className={etiket}>Fiyat (₺)</label>
            <input id="fiyat" inputMode="decimal" className={`${alan} rakam`} required
              placeholder="450" value={d.fiyatMetni}
              onChange={(e) => setD({ ...d, fiyatMetni: e.target.value })} />
          </div>
          <div>
            <label htmlFor="eski" className={etiket}>
              Eski fiyat <span className="text-notr-400 font-normal">(isteğe bağlı)</span>
            </label>
            <input id="eski" inputMode="decimal" className={`${alan} rakam`}
              placeholder="590" value={d.eskiFiyatMetni}
              onChange={(e) => setD({ ...d, eskiFiyatMetni: e.target.value })} />
          </div>
        </div>

        <div>
          <label htmlFor="kategori" className={etiket}>Kategori</label>
          <select id="kategori" className={alan} required value={d.kategoriId}
            onChange={(e) => setD({ ...d, kategoriId: e.target.value })}>
            <option value="">Seç…</option>
            {kategoriler.filter((k) => k.aktif).map((k) => (
              <option key={k.id} value={k.id}>{k.ad}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="set" className={etiket}>
            Set içeriği <span className="text-notr-400 font-normal">(her satıra bir ürün)</span>
          </label>
          <textarea id="set" rows={4} className={alan} value={d.setIcerigi}
            placeholder={'Uyuz kremi\nUyuz solüsyonu\nKatran sabunu\nKabak lifi'}
            onChange={(e) => setD({ ...d, setIcerigi: e.target.value })} />
        </div>

        <div>
          <label htmlFor="kisa" className={etiket}>
            Kısa açıklama <span className="text-notr-400 font-normal">(listede görünür)</span>
          </label>
          <textarea id="kisa" rows={2} maxLength={300} className={alan} value={d.kisaAciklama}
            onChange={(e) => setD({ ...d, kisaAciklama: e.target.value })} />
        </div>

        <div>
          <label htmlFor="uzun" className={etiket}>Açıklama</label>
          <textarea id="uzun" rows={8} className={alan} value={d.aciklama}
            onChange={(e) => setD({ ...d, aciklama: e.target.value })} />
          <p className="text-xs text-notr-400 mt-1">
            Fotoğraftaki yazıları buraya da yaz — Google ve arama motorları
            görselin içindeki metni okuyamaz.
          </p>
        </div>
      </section>

      <section className="bg-notr-0 rounded-panel p-4 space-y-3">
        <h2 className="text-lg text-yesil-700">Görünürlük</h2>
        {([
          ['yayinda', 'Yayında', 'Kapatırsan ürün sitede görünmez'],
          ['stokta', 'Stokta var', 'Kapatırsan "Tükendi" yazar, sipariş alınmaz'],
          ['oneCikan', 'Öne çıkar', 'Ana sayfada gösterilir'],
          ['kargoBedava', 'Bu üründe kargo bedava', 'Sepet tutarına bakılmaz'],
        ] as const).map(([anahtar, baslik, aciklama]) => (
          <label key={anahtar} className="flex items-start gap-3 min-h-[44px] cursor-pointer">
            <input type="checkbox" className="size-5 mt-0.5" checked={d[anahtar]}
              onChange={(e) => setD({ ...d, [anahtar]: e.target.checked })} />
            <span>
              <span className="block font-medium">{baslik}</span>
              <span className="block text-sm text-notr-600">{aciklama}</span>
            </span>
          </label>
        ))}
      </section>

      {hata && (
        <p role="alert" className="text-sm text-hata bg-notr-0 rounded-kontrol p-3">{hata}</p>
      )}

      <div className="fixed bottom-0 inset-x-0 md:sticky md:bottom-4 p-3 bg-notr-0
                      border-t border-notr-200 md:border md:rounded-panel z-30
                      md:max-w-5xl">
        <button type="submit" disabled={bekliyor}
          className="w-full h-12 rounded-kontrol bg-yesil-700 text-notr-0 font-medium
                     disabled:opacity-50 cursor-pointer">
          {bekliyor ? 'Kaydediliyor…' : 'Kaydet'}
        </button>
      </div>
    </form>
  )
}
```

- [ ] **Step 3: `src/app/panel/urunler/yeni/page.tsx`**

```tsx
import { kategorileriGetir } from '@/actions/categories'
import { UrunFormu } from '@/components/panel/UrunFormu'

export default async function YeniUrunSayfasi() {
  const kategoriler = await kategorileriGetir()
  return (
    <div className="space-y-5">
      <h1 className="text-2xl text-yesil-700">Yeni ürün</h1>
      <UrunFormu kategoriler={kategoriler} />
    </div>
  )
}
```

- [ ] **Step 4: `src/app/panel/urunler/[id]/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import { kategorileriGetir } from '@/actions/categories'
import { urunGetir } from '@/actions/products'
import { UrunFormu } from '@/components/panel/UrunFormu'

export default async function UrunDuzenleSayfasi({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [kategoriler, veri] = await Promise.all([kategorileriGetir(), urunGetir(id)])
  if (!veri) notFound()

  const { urun, gorseller } = veri

  return (
    <div className="space-y-5">
      <h1 className="text-2xl text-yesil-700">{urun.baslik}</h1>
      <UrunFormu
        kategoriler={kategoriler}
        baslangic={{
          id: urun.id,
          baslik: urun.baslik,
          fiyatMetni: String(urun.fiyat).replace('.', ','),
          eskiFiyatMetni: urun.eskiFiyat ? String(urun.eskiFiyat).replace('.', ',') : '',
          kategoriId: urun.kategoriId ?? '',
          kisaAciklama: urun.kisaAciklama ?? '',
          aciklama: urun.aciklama ?? '',
          setIcerigi: (urun.setIcerigi ?? []).join('\n'),
          stokta: urun.stokta, yayinda: urun.yayinda,
          oneCikan: urun.oneCikan, kargoBedava: urun.kargoBedava,
          gorseller: gorseller.map((g) => ({
            url: g.url, storagePath: g.storagePath, genislik: g.genislik,
            yukseklik: g.yukseklik, zeminRengi: g.zeminRengi, alt: g.alt,
          })),
        }}
      />
    </div>
  )
}
```

- [ ] **Step 5: Doğrula**

`/panel/urunler/yeni`:
1. Hiçbir şey doldurmadan Kaydet → "Ürün adı en az 3 harf olmalı"
2. Ad gir, fiyat boş → "Fiyat girmen gerekiyor — örnek: 450"
3. Fiyata `1.250,00` yaz, fotoğraf ekleme → "En az bir fotoğraf eklemen gerekiyor"
4. Fotoğraf ekle, kategori seç → Kaydet → `/panel/urunler`'e döner
5. Drizzle Studio'da `products` tablosunda `fiyat = 1250.00`, `slug` doğru
6. Eski fiyatı yeni fiyattan küçük gir → "Eski fiyat, yeni fiyattan büyük olmalı"
7. 375 px'te Kaydet butonu **altta sabit** duruyor

- [ ] **Step 6: Commit**

```bash
git add src/actions/products.ts src/app/panel/urunler src/components/panel/UrunFormu.tsx
git commit -m "feat: urun ekleme ve duzenleme formu"
```

---

### Task 9: Ürün listesi ve satır içi anahtarlar

Panelin en sık kullanılacak ekranı. Gerçek hayatta en sık yapılan işlem ürün
eklemek değil, "bu bitti, kapat" demektir — bu iş formu açmayı gerektirirse
yapılmaz ve site tükenmiş ürün satmaya devam eder.

**Files:**
- Create: `src/app/panel/urunler/page.tsx`
- Create: `src/components/panel/UrunSatiri.tsx`
- Modify: `src/actions/products.ts` (`urunleriGetir` eklenir)

**Interfaces:**
- Consumes: Task 8 `urunAnahtarDegistir`
- Produces: `urunleriGetir(): Promise<UrunSatirVerisi[]>`

- [ ] **Step 1: `urunleriGetir`'i `src/actions/products.ts` sonuna ekle**

```ts
export type UrunSatirVerisi = {
  id: string; baslik: string; fiyat: string; stokta: boolean; yayinda: boolean
  kapakUrl: string | null; zeminRengi: string | null; kategoriAdi: string | null
}

export async function urunleriGetir(): Promise<UrunSatirVerisi[]> {
  const satirlar = await db
    .select({
      id: products.id, baslik: products.baslik, fiyat: products.fiyat,
      stokta: products.stokta, yayinda: products.yayinda,
      kategoriAdi: categories.ad,
      kapakUrl: productImages.url, zeminRengi: productImages.zeminRengi,
      sira: productImages.sira,
    })
    .from(products)
    .leftJoin(categories, eq(products.kategoriId, categories.id))
    .leftJoin(productImages, and(
      eq(productImages.urunId, products.id),
      eq(productImages.sira, 0),
    ))
    .orderBy(products.sira, products.baslik)

  return satirlar.map(({ sira: _sira, ...r }) => r)
}
```

`categories` importunu dosyanın başına ekle:
`import { products, productImages, categories } from '@/db/schema'`

- [ ] **Step 2: `src/components/panel/UrunSatiri.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { useOptimistic, useTransition } from 'react'
import { urunAnahtarDegistir, type UrunSatirVerisi } from '@/actions/products'
import { fiyatBicimle } from '@/lib/price'

export function UrunSatiri({ urun }: { urun: UrunSatirVerisi }) {
  const [gorunum, setGorunum] = useOptimistic(urun)
  const [, basla] = useTransition()

  function degistir(alan: 'stokta' | 'yayinda', deger: boolean) {
    basla(async () => {
      setGorunum({ ...gorunum, [alan]: deger })
      await urunAnahtarDegistir(urun.id, alan, deger)
    })
  }

  return (
    <li className="flex items-center gap-3 py-3 border-b border-notr-200 last:border-0">
      <Link href={`/panel/urunler/${urun.id}`}
        className="flex items-center gap-3 flex-1 min-w-0">
        <span className="size-14 shrink-0 rounded-gorsel overflow-hidden grid place-items-center"
          style={{ backgroundColor: urun.zeminRengi ?? '#EDF1E8' }}>
          {urun.kapakUrl
            /* eslint-disable-next-line @next/next/no-img-element */
            ? <img src={urun.kapakUrl} alt="" className="max-w-full max-h-full object-contain" />
            : <span className="text-xs text-notr-400">yok</span>}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-medium">{urun.baslik}</span>
          <span className="block text-sm text-notr-600">
            <span className="rakam">{fiyatBicimle(Number(urun.fiyat))}</span>
            {urun.kategoriAdi && <> · {urun.kategoriAdi}</>}
          </span>
        </span>
      </Link>

      <div className="flex flex-col gap-1 shrink-0 text-sm">
        <label className="flex items-center gap-2 min-h-[22px] cursor-pointer">
          <input type="checkbox" className="size-5" checked={gorunum.stokta}
            onChange={(e) => degistir('stokta', e.target.checked)} />
          <span className="w-14">Stokta</span>
        </label>
        <label className="flex items-center gap-2 min-h-[22px] cursor-pointer">
          <input type="checkbox" className="size-5" checked={gorunum.yayinda}
            onChange={(e) => degistir('yayinda', e.target.checked)} />
          <span className="w-14">Yayında</span>
        </label>
      </div>
    </li>
  )
}
```

- [ ] **Step 3: `src/app/panel/urunler/page.tsx`**

```tsx
import Link from 'next/link'
import { Plus, PackageOpen } from 'lucide-react'
import { urunleriGetir } from '@/actions/products'
import { UrunSatiri } from '@/components/panel/UrunSatiri'

export default async function UrunlerSayfasi() {
  const urunler = await urunleriGetir()

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl text-yesil-700">Ürünler</h1>
        <Link href="/panel/urunler/yeni"
          className="inline-flex items-center gap-2 h-12 px-4 rounded-kontrol
                     bg-yesil-700 text-notr-0 font-medium">
          <Plus size={18} aria-hidden="true" /> Yeni ürün
        </Link>
      </div>

      {urunler.length === 0 ? (
        <div className="bg-notr-0 rounded-panel p-10 text-center space-y-3">
          <PackageOpen size={40} className="mx-auto text-notr-400" aria-hidden="true" />
          <p className="text-notr-600">Henüz ürün yok.</p>
          <Link href="/panel/urunler/yeni" className="inline-block text-yesil-700 underline">
            İlk ürününü ekle
          </Link>
        </div>
      ) : (
        <ul className="bg-notr-0 rounded-panel px-4">
          {urunler.map((u) => <UrunSatiri key={u.id} urun={u} />)}
        </ul>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Doğrula**

1. Ürün yokken boş durum mesajı ve "İlk ürününü ekle" bağlantısı
2. Task 8'de eklenen ürün listede, kapak görseli **kendi zemin renginde**
3. "Stokta" kutusunu kaldır → **anında** görsel tepki (optimistic), sayfa yenilenince kalıcı
4. Satıra tıkla → düzenleme formu dolu açılır
5. 375 px'te başlık taşmıyor, kutular ≥ 44 px erişilebilir alanda

- [ ] **Step 5: Commit**

```bash
git add src/app/panel/urunler/page.tsx src/components/panel/UrunSatiri.tsx src/actions/products.ts
git commit -m "feat: urun listesi ve satir ici stok/yayin anahtarlari"
```

---

### Task 10: Vercel'e ilk yayın

**Files:**
- Create: `.github/workflows/db-yedek.yml`
- Create: `.github/workflows/db-uyanik-tut.yml`
- Modify: `next.config.ts`

**Interfaces:**
- Consumes: Tümü
- Produces: Canlı URL (`https://<proje>.vercel.app`)

- [ ] **Step 1: `next.config.ts` — Supabase görsellerine izin ver**

```ts
import type { NextConfig } from 'next'

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : ''

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: supabaseHost
      ? [{ protocol: 'https', hostname: supabaseHost, pathname: '/storage/v1/object/public/**' }]
      : [],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
```

- [ ] **Step 2: Üretim derlemesini yerel olarak doğrula**

```bash
npm run build
```
Beklenen: hatasız. `cacheComponents` açık değil, segment export'ları yok.

- [ ] **Step 3: Vercel'e bağla**

```bash
npm i -g vercel
vercel login
vercel link
```

Vercel Dashboard → Project → Settings → Environment Variables: `.env.local`'daki
**altı değişkeni de** Production ve Preview için ekle. `NEXT_PUBLIC_SITE_URL`
değerini yayınlanan adresle güncelle.

```bash
vercel --prod
```

- [ ] **Step 4: Canlı duman testi**

1. `https://<proje>.vercel.app/panel` → giriş sayfası açılır
2. Giriş yap → panel açılır
3. Telefondan gerçek bir ürün ekle (fotoğrafla)
4. Ürün listede görünür, fotoğraf yüklenmiş
5. Chrome DevTools → Lighthouse → **Mobil** → `/panel/urunler`
   Beklenen: Erişilebilirlik ≥ 95

- [ ] **Step 5: `.github/workflows/db-uyanik-tut.yml`**

Supabase ücretsiz planda 7 gün trafiksiz kalan proje **duraklatılır** ve panel de
erişilemez hale gelir.

```yaml
name: Veritabanini uyanik tut

on:
  schedule:
    - cron: '0 6 */3 * *'   # 3 gunde bir 06:00 UTC
  workflow_dispatch:

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Supabase REST ucuna istek at
        run: |
          curl -sS -o /dev/null -w "%{http_code}\n" \
            "${{ secrets.SUPABASE_URL }}/rest/v1/settings?select=id&limit=1" \
            -H "apikey: ${{ secrets.SUPABASE_ANON_KEY }}"
```

GitHub → Settings → Secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`

- [ ] **Step 6: `.github/workflows/db-yedek.yml`**

Supabase ücretsiz planda **yedekleme yoktur.** Tek hatalı komut tüm sipariş
geçmişini siler.

```yaml
name: Gunluk veritabani yedegi

on:
  schedule:
    - cron: '0 2 * * *'   # her gun 02:00 UTC
  workflow_dispatch:

jobs:
  yedek:
    runs-on: ubuntu-latest
    steps:
      - name: PostgreSQL istemcisini kur
        run: |
          sudo apt-get update
          sudo apt-get install -y postgresql-client

      - name: Yedek al
        run: |
          pg_dump "${{ secrets.DIRECT_URL }}" \
            --no-owner --no-privileges \
            -f "yedek-$(date +%Y-%m-%d).sql"
          gzip "yedek-$(date +%Y-%m-%d).sql"

      - name: Yedegi sakla
        uses: actions/upload-artifact@v4
        with:
          name: db-yedek-${{ github.run_id }}
          path: '*.sql.gz'
          retention-days: 30
```

GitHub Secret: `DIRECT_URL`

> Bu iki workflow ancak depo kurulduktan sonra çalışır. Depo yoksa dosyalar
> yerinde bekler; `YAYIN-ONCESI-KONTROL.md` bunu hatırlatır.

- [ ] **Step 7: Commit**

```bash
git add next.config.ts .github
git commit -m "chore: Vercel yapilandirmasi, gunluk yedek ve uyanik tutma is akislari"
```

---

### Task 11: Yayın öncesi kontrol listesi

**Files:**
- Create: `YAYIN-ONCESI-KONTROL.md`

**Interfaces:**
- Consumes: Tüm önceki tasklar
- Produces: Kullanıcının tik atarak ilerleyeceği kontrol listesi

- [ ] **Step 1: `YAYIN-ONCESI-KONTROL.md` yaz**

```markdown
# Yayın Öncesi Kontrol Listesi

Site gerçek müşteriye açılmadan önce bu listenin tamamı tamamlanmalı.

## Altyapı
- [ ] Alan adı alındı ve Vercel'e bağlandı
- [ ] `NEXT_PUBLIC_SITE_URL` gerçek alan adıyla güncellendi
- [ ] Git deposu kuruldu, `.env.local` depoda DEĞİL
- [ ] Günlük yedekleme iş akışı çalıştı ve bir yedek indirildi
- [ ] Uyanık tutma iş akışı çalıştı

## Panel
- [ ] Ablan kendi hesabıyla giriş yapabiliyor
- [ ] Ablan yardımsız bir ürün ekledi (asıl başarı ölçütü)
- [ ] WhatsApp numarası girildi ve "Test Et" butonu çalıştı
- [ ] Kargo kuralı (limit ve ücret) girildi
- [ ] Telegram bildirimi test siparişinde telefona düştü

## İçerik
- [ ] En az 10 ürün fotoğrafıyla girildi
- [ ] Her ürünün açıklaması dolu (görseldeki yazılar metne aktarıldı)
- [ ] Her fotoğrafın "alt" açıklaması dolu
- [ ] Kategoriler düzenlendi, boş kategori yok

## Yasal
- [ ] Firma bilgileri (ticaret unvanı, adres, vergi no) panelden girildi
- [ ] ETBİS kaydı yapıldı, doğrulama bandı siteye eklendi
- [ ] Mesafeli Satış Sözleşmesi metni dolduruldu
- [ ] Ön Bilgilendirme Formu dolduruldu
- [ ] KVKK Aydınlatma Metni dolduruldu
- [ ] İptal ve İade Koşulları dolduruldu (cayma hakkı 14 gün + hijyen/gıda istisnası)
- [ ] Teslimat ve Kargo sayfası dolduruldu
- [ ] Gizlilik ve Çerez Politikası dolduruldu

## Teknik doğrulama
- [ ] Lighthouse mobil: Performans ≥ 90, Erişilebilirlik ≥ 95
- [ ] Gerçek telefonda uçtan uca sipariş verildi ve WhatsApp açıldı
- [ ] Instagram uygulaması içinden site açıldı, WhatsApp butonu test edildi
- [ ] `npm test` tamamen geçiyor
- [ ] Google Search Console'a site eklendi ve sitemap gönderildi
```

- [ ] **Step 2: Commit**

```bash
git add YAYIN-ONCESI-KONTROL.md
git commit -m "docs: yayin oncesi kontrol listesi"
```

---

## Öz Denetim

**Spec kapsamı:** Faz 0 (§3, §4, §11, §12) → Task 1, 4, 10. Faz 1 (§9 panel
ekranlarından ürün ve kategori, §6 görsel akışı) → Task 5-9. Saf fonksiyonlar
(§9 TR ondalık, §7 telefon normalize) → Task 2. `zemin_rengi` algoritması (§4.5,
§10 ürün kartı) → Task 3. Yedekleme ve uyanık tutma (§12) → Task 10. Kontrol
listesi (§13) → Task 11.

**Bu planın kapsamı dışında (sonraki planlar):** Mağaza ön yüzü (Faz 2),
sepet/checkout/WhatsApp (Faz 3), siparişler ekranı ve Telegram bildirimi (Faz 4),
yorumlar ve SEO (Faz 5), testler ve a11y denetimi (Faz 6).

**Tip tutarlılığı:** `Kutu` ve `Pikseller` tipleri Task 3'te tanımlanır, Task 7'de
aynı adla kullanılır. `GorselKaydi` Task 7'de tanımlanır, Task 8'de aynı alanlarla
tüketilir. `Kategori` Task 6'da export edilir, Task 8'de kullanılır.
`UrunSatirVerisi` Task 9'da tanımlanır ve aynı dosyada kullanılır.

**Bilinen risk:** `Newsreader` fontunun Türkçe karakter desteği Task 1 Step 9'da
doğrulanır; yetersizse `Literata`'ya düşülür ve spec §10 güncellenir.
