"use client";

import { useSyncExternalStore } from "react";
import { useSepet } from "./sepet";

/**
 * Sepet localStorage'dan okunana kadar `false`, okunduktan sonra `true` döner.
 *
 * Neden gerekli: sunucuda localStorage yoktur. Sunucu "sepet boş" diye render
 * eder, tarayıcı "3 ürün var" der ve React hidrasyon uyuşmazlığı verir.
 *
 * Neden useEffect + setState değil: efekt gövdesinde senkron setState çağırmak
 * zincirleme render tetikler ve React 19 lint kuralı bunu hata sayar.
 * useSyncExternalStore, sunucu ve istemci anlık görüntülerini ayrı ayrı
 * tanımlamanın doğru yoludur.
 */
export function useSepetHidrasyonu(): boolean {
  return useSyncExternalStore(
    (bildir) => useSepet.persist.onFinishHydration(bildir),
    () => useSepet.persist.hasHydrated(),
    () => false,
  );
}
