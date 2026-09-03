# Ham ürün fotoğrafları

Ablamın gönderdiği **işlenmemiş** ürün fotoğrafları buraya konur.
Siteye giden hâlleri değil — kaynak malzeme.

## Nasıl atılır

Fotoğrafları olduğu gibi at. Tek kural: **aynı ürünün birden fazla fotoğrafı
varsa dosya adlarının başına aynı numarayı koy.**

```
01-zeytinyagi-a.jpg
01-zeytinyagi-b.jpg     ← ikisi de aynı ürün
02-katran-sabunu.jpg
03-ada-cayi.jpg
```

Ad tam olmasa da olur; etiketten okunur. Numara, hangi fotoğrafların aynı
ürüne ait olduğunu belirtmek için gerekli.

## Fiyatlar

Biliniyorsa `fiyatlar.txt` dosyasına satır satır yazılır:

```
01  Zeytinyağı 500ml      450
02  Katran Sabunu         120
```

Bilinmiyorsa boş bırakılır.

**Fiyatı bilinmeyen ürünler siteye "yayında değil" olarak girilir.** Böylece
yanlış fiyatla kimse sipariş veremez. Fiyat panelden düzeltildikten sonra
"Yayında" anahtarı açılır.

## Sonraki adım

Fotoğraflar 10'arlı gruplar hâlinde incelenir; her ürün için ad, kategori,
açıklama metni ve tek bir showroom görseli promptu üretilir.

Her ürün siteye **2 görselle** girer: ablamın çektiği gerçek fotoğraf ve
AI ile üretilen showroom görseli.

Üretilen görsellerin nereye kaydedileceği o adımda belirtilir.
