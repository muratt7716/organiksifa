import { describe, it, expect } from "vitest";
import { oturumCereziVarMi } from "@/lib/supabase/oturum-cerezi";

/**
 * Bu testin koruduğu hata (canlıda yaşandı):
 *
 * Ablam sipariş detayında kargo bilgisini kaydederken panelden atıldı.
 * Sebep: Supabase yenileme jetonu tek kullanımlıktır ve döner; aynı anda
 * giden isteklerden biri yarışı kaybedince getUser() bir kerelik "oturum yok"
 * dedi, Server Action bunu "çıkış yaptı" sayıp hata fırlattı.
 *
 * Çözüm, oturum çerezi duruyorsa bir kez daha denemek. Bu testler o kararın
 * dayandığı çerez tanımasını kilitliyor — desen bozulursa hata sessizce döner.
 */
describe("oturumCereziVarMi", () => {
  it("Supabase oturum çerezini tanır", () => {
    expect(
      oturumCereziVarMi([{ name: "sb-pqgjqfguzttoyxnconst-auth-token" }]),
    ).toBe(true);
  });

  it("parçalara bölünmüş çerezi de tanır", () => {
    // Supabase jeton 4 KB'ı aşınca çerezi .0 / .1 diye böler.
    expect(
      oturumCereziVarMi([
        { name: "sb-abc-auth-token.0" },
        { name: "sb-abc-auth-token.1" },
      ]),
    ).toBe(true);
  });

  it("proje kimliği ne olursa olsun tanır", () => {
    expect(oturumCereziVarMi([{ name: "sb-baska-proje-auth-token" }])).toBe(
      true,
    );
  });

  it("alakasız çerezleri oturum sanmaz", () => {
    expect(
      oturumCereziVarMi([
        { name: "_ga" },
        { name: "sepet" },
        { name: "sb-provider-token" },
      ]),
    ).toBe(false);
  });

  it("çerez yokken false döner", () => {
    expect(oturumCereziVarMi([])).toBe(false);
  });
});
