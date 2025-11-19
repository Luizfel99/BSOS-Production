"use client";

/**
 * why: banner de contas demo só quando explicitamente habilitado.
 * Por padrão, não renderiza nada. Mostra apenas NEXT_PUBLIC_SHOW_DEMO_BANNER=1 e NODE_ENV!=='production'.
 */
export default function DemoInfoBanner(): JSX.Element | null {
  const enabled =
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_SHOW_DEMO_BANNER === "1" &&
    process.env.NODE_ENV !== "production";

  if (!enabled) return null;

  return (
    <div
      data-testid="demo-info-banner"
      className="fixed top-0 left-0 right-0 z-[9999] bg-amber-100 border-b border-amber-300 text-amber-900"
    >
      <div className="mx-auto max-w-5xl px-3 py-2 text-xs sm:text-sm">
        <b>Demo:</b>&nbsp;
        admin: admin@demo.local · manager: manager@demo.local · supervisor: supervisor@demo.local · cleaner: cleaner@demo.local · client: client@demo.local ·
        <b>&nbsp;pwd:</b>&nbsp;demo123
        <span className="ml-2 opacity-70">Re-Seed via CLI</span>
      </div>
    </div>
  );
}
