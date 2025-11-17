"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  // Always redirect to login
  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return null;
}
