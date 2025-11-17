"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  href?: string;
  action?: string; // data-action padrão
  route?: string; // fallback de rota
};

/**
 * why: garante onClick/rota mesmo quando não fornecidos.
 * - se href: renderiza <Link>
 * - senão: <button> com onClick que navega para route (se existir) ou loga action
 */
const WiredButton = forwardRef<HTMLButtonElement, Props>(
  (
    {
      children,
      href,
      onClick,
      action,
      route,
      className,
      disabled,
      type = "button",
      ...rest
    },
    ref
  ) => {
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
        ref={ref}
        type={type}
        onClick={fallback}
        className={className}
        data-action={action}
        data-route={route}
        disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

WiredButton.displayName = "WiredButton";

export default WiredButton;