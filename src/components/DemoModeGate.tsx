"use client";

import { useEffect } from "react";

/**
 * Gate invisível para DEMO MODE:
 * - ?demo=1  → sessionStorage.setItem('demoMode','1')
 * - ?demo=0  → sessionStorage.removeItem('demoMode')
 */
export default function DemoModeGate(): null {
  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const demo = sp.get("demo");
      if (demo === "1") {
        sessionStorage.setItem("demoMode", "1");
      } else if (demo === "0") {
        sessionStorage.removeItem("demoMode");
      }
    } catch {
      // no-op
    }
  }, []);
  return null;
}
