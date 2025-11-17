"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  action?: string;       // data-action padrão
  route?: string;        // fallback de rota
  className?: string;
  disabled?: boolean;
};

/**
 * why: garante onClick/rota mesmo quando não fornecidos.
 * - se href: renderiza <Link>
 * - senão: <button> com onClick que navega para route (se existir) ou loga action
 */
export default function WiredButton({
  children, href, onClick, action, route, className, disabled
}: Props) {
  const router = useRouter();

  function fallback(e: any) {
    if (disabled) return;
    if (onClick) return onClick(e);
    if (route) return router.push(route);
    if (href) return; // Link cuida
    // por quê: marcação para o GlobalActionBus
    console.info("[wire] click:", action ?? "(no-action)");
  }

  if (href) {
    return (
      <Link
        href={href}
        className={className}
        data-action={action}
        data-route={route}
        aria-disabled={disabled}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={fallback}
      className={className}
      data-action={action}
      data-route={route}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
