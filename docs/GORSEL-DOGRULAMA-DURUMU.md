# Görsel Doğrulama Durumu

Bu dosya, hangi ürünün görselini **gözle açıp** doğruladığımı kaydeder.
Kod ile taranamayan tek şey kalite; onun için görseli açmak gerekiyor.

Son güncelleme: 4 Eylül 2026

---

## Kapsam

| | Adet |
|---|---|
| Toplam ürün tanımı | **105** |
| Kapağı AI showroom görseli olan | 24 |
| Kapağı ham infografik olan | 81 |
| Havuzdaki ham görsel | 138 |
| Ürüne bağlanmayan ham görsel | 33 (mükerrer + listelenmeyen) |

---

## 1. Mükerrer ilan kontrolü — TAMAM

`scripts/katalog-denetle.ts` ile tarandı:

```
slug tekrarı           yok
başlık tekrarı         yok
aynı görsel 2 üründe   yok
görselsiz ürün         yok
```

Elle bakılması gereken **iki yakın ad** (ayrı ürün mü, aynı mı — ablama sorulacak):

- `Ayak Bakım Seti` (6 parça) ↔ `Ayak Bakım Seti — 8 Parça`
- `Bağırsak Temizlik Destek Seti` (parazit) ↔ `Bağırsak Temizleme Destek Seti`

---

## 2. Görsel ↔ ürün eşleşmesi

Parti hâlinde bakarken **sıra kaydırdığım için 5 üründe yanlış görsel** vardı.
Tek tek açıp doğrulayınca yakalandı ve düzeltildi:

| Ürün | Bağlıydı | Aslında o dosya | Düzeltildi |
|---|---|---|---|
| Hassas Cilt Bakım Seti | `16.47.01 (2)` | **Eklem Seti** | `02.08.50 (10)` |
| Dide-i Nur Damla | `16.47.01 (4)` | **Propolisli Göz/Kulak Damlası** | `16.47.03 (10)` |
| Misk Amber Sidr Mum | `16.47.04 (1)` | **Saç Onarım Seti** | `16.47.03 (11)` |
| Saç Onarım ve Bakım Seti | `16.47.04 (2)` | **Enfeksiyon Seti** | `16.47.04 (1)` |
| Direnç Destek Seti | `16.47.04 (3)` | **Varis Seti** | `16.47.04 (2)` |

### Gözle doğrulanan dosyalar (65)

**02.0x partisi (15):**
`02.05.25 (1)` · `02.05.26 (1)` · `02.05.27` · `02.05.27 (1)` · `02.08.46` ·
`02.08.47 (3)` · `02.08.48 (3)` · `02.08.48 (5)` · `02.08.48 (6)` · `02.08.49` ·
`02.08.49 (1)` · `02.08.49 (3)` · `02.08.49 (4)` · `02.08.49 (8)` · `02.08.49 (9)` ·
`02.08.49 (10)` · `02.08.50 (7)` · `02.08.50 (10)` · `02.08.51 (5)`

**16.4x partisi (50):**
`16.46.59` · `(1)` · `(2)` · `(3)` ·
`16.47.00` · `(1)` · `(2)` · `(3)` · `(4)` · `(5)` · `(6)` · `(7)` ·
`16.47.01` · `(1)` · `(2)` · `(3)` · `(4)` · `(5)` · `(8)` · `(10)` ·
`16.47.02` · `(1)` · `(2)` · `(3)` · `(4)` · `(7)` · `(8)` · `(9)` ·
`16.47.03` · `(1)` · `(2)` · `(3)` · `(4)` · `(8)` · `(10)` · `(11)` ·
`16.47.04` · `(1)` · `(2)` · `(3)` · `(4)` · `(5)` · `(6)` · `(7)` · `(8)` · `(10)` ·
`16.47.05` · `(5)` · `(6)` · `(7)` · `(8)` · `(9)` · `(10)`

### Doğrulanmayı bekleyen (40)

02.0x partisinin geri kalanı. İlk katalog turunda hepsini gördüm ama
**eşleşmelerini tek tek teyit etmedim** — hata da orada değil bu partide
çıkmadı, yine de sayıyor sayılmaz.

`02.05.25` · `02.05.26` · `02.05.26 (2)` · `02.05.26 (3)` · `02.05.27 (2)` ·
`02.05.27 (3)` · `02.05.27 (4)` · `02.05.27 (5)` · `02.05.28` ·
`02.08.46 (1)` … `(7)` · `02.08.47` · `(1)` · `(2)` · `(4)` ·
`02.08.48` · `(1)` · `(2)` · `(4)` · `(7)` ·
`02.08.49 (2)` · `(5)` · `(6)` · `(7)` · `(11)` ·
`02.08.50` · `(1)` … `(6)` · `(8)` · `(9)` ·
`02.08.51` · `(1)` · `(2)` · `(3)` · `(4)`

---

## 3. Görsel kalitesi

### Yeniden üretildi ve onaylandı (10)

`21`–`30` numaralı showroom görselleri üretildi, gözle denetlendi:
kap referansla uyuşuyor, etiket boş, telefon arayüzü yok. **Hepsi geçti.**

### Ambalaj uyuşmazlığı — yeniden üretilecek (10)

Çeşitlilik için kabı değiştirmişim; gerçek ürün amber cam + siyah kapak.
Ayrıntı: `docs/ANTIGRAVITY-DUZELTME-AMBALAJ.md`

`06` · `07` · `08` · `09` · `10` · `11` · `12` · `13` · `14` · `15`

### Ambalajı doğru (4)

`01` zeytinyağı bidonu · `02` pekmez kavanozu · `03` damlalıklı amber şişe ·
`04` şeffaf çay şişesi

### Ham infografik kapaklar

Ölçümle taranan (siyah bant, telefon oranı, çözünürlük) + gözle doğrulanan:

**Gerçek ekran görüntüsü — düzeltilmeli (4)**

| Ürün | Dosya | Sorun |
|---|---|---|
| Hint Yağı | `16.47.01` | %36 siyah bant, telefon oranı |
| Sidr Kil Diş Macunu | `16.47.03` | %38 siyah bant, gezinti tuşları |
| Anti-Aging Serum | `16.47.05 (4)` | %29 siyah bant |
| İştah ve Kilo Destek Seti | `02.05.26 (1)` | %22 siyah bant |

**Emoji/çıkartma — düzeltilmeli (1)**

| Ürün | Dosya | Sorun |
|---|---|---|
| Zihin Yağı (roll-on) | `16.47.03 (3)` | Ürünün üstünde emoji çıkartması |

**Yanlış alarm — dokunulmayacak (6)**

Tarayıcı koyu tasarımlı infografikleri "siyah bant" sandı; gözle bakınca
profesyonel çıktılar: İsmid Sürmesi, Mumiyo Bakım Kremi, Erkek Özel Krem,
Direnç Destek Seti, Mide Rahatlatıcı Set, İğde Çekirdeği Tozu (showroom).

---

## Özet sayılar

| Durum | Adet |
|---|---|
| Eşleşmesi gözle doğrulanmış | **65** |
| Eşleşmesi doğrulanmayı bekleyen | **40** |
| Görsel kalitesi onaylanmış (showroom) | 14 |
| Yeniden üretilecek — ambalaj yanlış | 10 |
| Yeniden üretilecek — ekran görüntüsü/emoji | 5 |
| **Toplam yeniden üretilecek** | **15** |

---

## Sıradaki adımlar

1. Kalan 40 eşleşmeyi gözle doğrula
2. 15 görsel için prompt hazırla (10 ambalaj + 5 kalite)
3. Görseller üretilince **tek seferde** yükle ve pushla
