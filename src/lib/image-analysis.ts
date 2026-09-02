export type Pikseller = {
  data: Uint8ClampedArray;
  width: number;
  height: number;
};

export type Kutu = { x: number; y: number; w: number; h: number };

function pikselOku(px: Pikseller, x: number, y: number): [number, number, number] {
  const i = (y * px.width + x) * 4;
  return [px.data[i], px.data[i + 1], px.data[i + 2]];
}

function yakinMi(
  a: [number, number, number],
  b: [number, number, number],
  tol: number,
): boolean {
  return (
    Math.abs(a[0] - b[0]) <= tol &&
    Math.abs(a[1] - b[1]) <= tol &&
    Math.abs(a[2] - b[2]) <= tol
  );
}

/**
 * Görselin kenarındaki tek renk şeritleri (letterbox, beyaz boşluk) kırpar.
 *
 * Neden gerekli: WhatsApp'tan gelen ekran görüntülerinin çoğunda siyah şerit
 * olur. Zemin rengi bu şeritten ölçülürse ürün kartı simsiyah olur.
 *
 * Kritik ayrıntı: kırpma ölçütü "bu satır kendi içinde tek renk mi" DEĞİL,
 * "bu satır köşedeki referans renkle aynı mı"dır. İlki, düz zeminli bir
 * ürün fotoğrafında iç bölgeyi de tek renk sayıp görseli tamamen yer.
 * Görselin tamamı tek renkse hiç kırpmaz.
 */
export function tekRenkKenarlariKirp(px: Pikseller, tolerans = 8): Kutu {
  const tam: Kutu = { x: 0, y: 0, w: px.width, h: px.height };
  if (px.width < 4 || px.height < 4) return tam;

  const referans = pikselOku(px, 0, 0);

  let ust = 0;
  let alt = px.height - 1;
  let sol = 0;
  let sag = px.width - 1;

  const satirReferansMi = (y: number) => {
    for (let x = sol; x <= sag; x++) {
      if (!yakinMi(pikselOku(px, x, y), referans, tolerans)) return false;
    }
    return true;
  };

  const sutunReferansMi = (x: number) => {
    for (let y = ust; y <= alt; y++) {
      if (!yakinMi(pikselOku(px, x, y), referans, tolerans)) return false;
    }
    return true;
  };

  while (ust < alt && satirReferansMi(ust)) ust++;
  while (alt > ust && satirReferansMi(alt)) alt--;
  while (sol < sag && sutunReferansMi(sol)) sol++;
  while (sag > sol && sutunReferansMi(sag)) sag--;

  const w = sag - sol + 1;
  const h = alt - ust + 1;
  if (w < 2 || h < 2) return tam;
  return { x: sol, y: ust, w, h };
}

function ortanca(degerler: number[]): number {
  const s = [...degerler].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)] ?? 0;
}

function ikili(n: number): string {
  return Math.max(0, Math.min(255, Math.round(n)))
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();
}

/**
 * Kırpılmış alanın kenar piksellerinden ortanca rengi çıkarır.
 *
 * Ürün kartı bu rengi zemin olarak kullanır; görsel KIRPILMADAN
 * (object-fit: contain) bu zeminin ortasına yerleştirilir. Böylece hangi
 * oranda görsel yüklenirse yüklensin katalog ızgarası bozulmaz ve
 * dikey infografiğin ortasından şerit alınmaz.
 *
 * Çok koyu renkler okunabilirlik için açılır.
 */
export function zeminRengi(px: Pikseller, kutu: Kutu): string {
  const r: number[] = [];
  const g: number[] = [];
  const b: number[] = [];
  const adim = Math.max(1, Math.floor(Math.max(kutu.w, kutu.h) / 64));

  for (let x = kutu.x; x < kutu.x + kutu.w; x += adim) {
    for (const y of [kutu.y, kutu.y + kutu.h - 1]) {
      const p = pikselOku(px, x, y);
      r.push(p[0]);
      g.push(p[1]);
      b.push(p[2]);
    }
  }
  for (let y = kutu.y; y < kutu.y + kutu.h; y += adim) {
    for (const x of [kutu.x, kutu.x + kutu.w - 1]) {
      const p = pikselOku(px, x, y);
      r.push(p[0]);
      g.push(p[1]);
      b.push(p[2]);
    }
  }

  let rr = ortanca(r);
  let gg = ortanca(g);
  let bb = ortanca(b);

  // Çok koyu zemin üstünde ürün seçilmez — parlaklığı tabana çek.
  const parlaklik = 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
  if (parlaklik < 40) {
    const kat = 40 / Math.max(parlaklik, 1);
    rr = Math.min(255, rr * kat + 24);
    gg = Math.min(255, gg * kat + 24);
    bb = Math.min(255, bb * kat + 24);
  }

  return `#${ikili(rr)}${ikili(gg)}${ikili(bb)}`;
}
