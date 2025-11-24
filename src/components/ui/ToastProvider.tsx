// ============================================================================
// FILE: src/components/ui/ToastProvider.tsx
// PURPOSE: Global toast system (no external deps)
// ============================================================================
"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ToastKind = "success" | "error" | "info";
type ToastItem = { id: string; kind: ToastKind; title?: string; message: string; ttl: number };

type ToastContextType = {
  success: (message: string, opts?: Partial<Omit<ToastItem, "id" | "kind" | "message">>) => void;
  error: (message: string, opts?: Partial<Omit<ToastItem, "id" | "kind" | "message">>) => void;
  info: (message: string, opts?: Partial<Omit<ToastItem, "id" | "kind" | "message">>) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, any>>(new Map());

  const enqueue = useCallback((kind: ToastKind, message: string, opts?: Partial<Omit<ToastItem,"id"|"kind"|"message">>) => {
    const id = crypto.randomUUID?.() ?? String(Date.now() + Math.random());
    const ttl = opts?.ttl ?? 3200;
    const title = opts?.title ?? (kind === "success" ? "Success" : kind === "error" ? "Error" : "Notice");
    setToasts((prev) => [...prev, { id, kind, message, ttl, title }]);
    const t = setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
      timers.current.delete(id);
    }, ttl);
    timers.current.set(id, t);
  }, []);

  const api = useMemo<ToastContextType>(() => ({
    success: (m, o) => enqueue("success", m, o),
    error:   (m, o) => enqueue("error",   m, o),
    info:    (m, o) => enqueue("info",    m, o),
  }), [enqueue]);

  useEffect(() => () => { timers.current.forEach(clearTimeout); timers.current.clear(); }, []);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <div className="fixed z-[9999] right-3 top-16 flex flex-col gap-2 max-w-sm pointer-events-none">
            {toasts.map((t) => (
              <div
                key={t.id}
                className={[
                  "rounded-lg shadow-md border px-3 py-2 text-sm animate-in fade-in slide-in-from-top-2 pointer-events-auto",
                  t.kind === "success" ? "border-green-300 bg-green-50 text-green-900" :
                  t.kind === "error"   ? "border-red-300 bg-red-50 text-red-900" :
                                         "border-blue-300 bg-blue-50 text-blue-900"
                ].join(" ")}
                role="status"
                aria-live="polite"
              >
                <div className="font-medium">{t.title}</div>
                <div className="opacity-90">{t.message}</div>
              </div>
            ))}
          </div>,
          document.body
        )
      }
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider />");
  return ctx;
}
