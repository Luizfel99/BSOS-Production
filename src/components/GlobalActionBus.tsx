"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * why: "liga" automaticamente qualquer elemento com [data-action] / [data-route]
 * sem alterar componentes legados. Coloque este componente no layout.
 */
export default function GlobalActionBus(): null {
  const router = useRouter();

  useEffect(() => {
    function handler(e: MouseEvent) {
      const el = (e.target as HTMLElement)?.closest?.("[data-action]") as HTMLElement | null;
      if (!el) return;
      const route = el.getAttribute("data-route");
      if (route) {
        e.preventDefault();
        router.push(route);
      }
      // caso não tenha rota, apenas registra o wire
      const action = el.getAttribute("data-action") ?? "(no-action)";
      // eslint-disable-next-line no-console
      console.debug("[wire:action]", action, route ?? "");
    }
    document.addEventListener("click", handler as any);
    return () => document.removeEventListener("click", handler as any);
  }, [router]);

  return null;
}
