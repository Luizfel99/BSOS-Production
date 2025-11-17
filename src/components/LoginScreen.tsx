"use client";

import React from "react";

export default function LoginScreen(): JSX.Element {
  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <div className="max-w-sm w-full space-y-4 border rounded-xl p-4">
        <h1 className="text-2xl font-semibold">Login (NOVO)</h1>
        <p className="text-sm opacity-80">
          Se você vê "(NOVO)", está no bundle atualizado.
        </p>
        <form action="/api/auth/signin" method="post" className="space-y-2">
          <input
            name="email"
            placeholder="email"
            className="w-full border rounded p-2"
          />
          <button className="w-full border rounded p-2">Entrar</button>
        </form>
      </div>
    </main>
  );
}
