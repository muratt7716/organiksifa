"use client";

import { useActionState } from "react";
import { girisYap, type GirisDurumu } from "@/actions/auth";
import { Leaf } from "lucide-react";

export default function GirisSayfasi() {
  const [durum, action, bekliyor] = useActionState<GirisDurumu, FormData>(
    girisYap,
    {},
  );

  return (
    <main className="min-h-dvh grid place-items-center bg-notr-100 p-4">
      <form
        action={action}
        className="w-full max-w-sm bg-notr-0 rounded-panel p-6 space-y-5 border border-notr-200"
      >
        <div className="space-y-1">
          <Leaf className="text-yesil-700" size={28} aria-hidden="true" />
          <h1 className="text-2xl text-yesil-700">Organik Şifa</h1>
          <p className="text-notr-600 text-sm">Yönetim paneline giriş yap</p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium">
            E-posta
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full h-12 px-3 rounded-kontrol border border-notr-200 bg-notr-0"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="sifre" className="block text-sm font-medium">
            Şifre
          </label>
          <input
            id="sifre"
            name="sifre"
            type="password"
            autoComplete="current-password"
            required
            className="w-full h-12 px-3 rounded-kontrol border border-notr-200 bg-notr-0"
          />
        </div>

        {durum.hata && (
          <p
            role="alert"
            className="text-sm text-hata bg-hata-zemin rounded-kontrol px-3 py-2"
          >
            {durum.hata}
          </p>
        )}

        <button
          type="submit"
          disabled={bekliyor}
          className="w-full h-12 rounded-kontrol bg-yesil-700 text-notr-0 font-medium
                     disabled:opacity-50 cursor-pointer transition-colors hover:bg-yesil-800"
        >
          {bekliyor ? "Giriş yapılıyor…" : "Giriş yap"}
        </button>
      </form>
    </main>
  );
}
