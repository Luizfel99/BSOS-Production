"use client";

import React from "react";

export default function DebugOverlay(): JSX.Element {
  const stamp = `BUILD@${process.env.NEXT_PUBLIC_BUILD_ID ?? "dev"}`;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 8,
        right: 8,
        padding: "4px 8px",
        fontSize: 12,
        background: "rgba(0,0,0,0.6)",
        color: "#fff",
        borderRadius: 6,
        zIndex: 99999,
        pointerEvents: "none",
      }}
    >
      {stamp}
    </div>
  );
}
