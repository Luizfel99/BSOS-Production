"use client";

import React, { useEffect, useState } from "react";

export default function AuthLoadingScreen(): JSX.Element {
  const [msg, setMsg] = useState("Checando sua sessão…");

  useEffect(() => {
    const t = setTimeout(
      () => setMsg("Ainda carregando… verifique sua rede"),
      4000,
    );
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <div className="animate-pulse">{msg}</div>
    </main>
  );
}
