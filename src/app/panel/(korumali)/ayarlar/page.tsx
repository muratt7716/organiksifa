import { ayarlariGetir } from "@/lib/settings";
import { AyarFormu } from "@/components/panel/AyarFormu";
import { telefonGoster } from "@/lib/phone";

export const metadata = { title: "Ayarlar" };

export default async function AyarlarSayfasi() {
  const a = await ayarlariGetir();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl text-yesil-700">Ayarlar</h1>
      <AyarFormu
        baslangic={{
          siteAdi: a.siteAdi,
          siteSlogan: a.siteSlogan ?? "",
          whatsappNumarasi: a.whatsappNumarasi
            ? telefonGoster(a.whatsappNumarasi)
            : "",
          kargoBedavaAcik: a.kargoBedavaAcik,
          kargoBedavaLimitMetni: a.kargoBedavaLimit
            ? String(Number(a.kargoBedavaLimit))
            : "",
          kargoUcretiMetni: a.kargoUcreti ? String(Number(a.kargoUcreti)) : "",
          duyuruMetni: a.duyuruMetni ?? "",
          duyuruAcik: a.duyuruAcik,
          instagramUrl: a.instagramUrl ?? "",
          iletisimTelefon: a.iletisimTelefon ?? "",
          iletisimEmail: a.iletisimEmail ?? "",
          ticaretUnvani: a.ticaretUnvani ?? "",
          adres: a.adres ?? "",
          mersisNo: a.mersisNo ?? "",
          vergiDairesi: a.vergiDairesi ?? "",
          vergiNo: a.vergiNo ?? "",
          etbisDogrulamaUrl: a.etbisDogrulamaUrl ?? "",
          telegramAcik: a.bildirimKanallari?.telegram ?? true,
          epostaAcik: a.bildirimKanallari?.email ?? false,
        }}
      />
    </div>
  );
}
