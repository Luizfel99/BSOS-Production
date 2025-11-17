"use client";

import { useState, useEffect } from "react";

export default function RegisterPage(): JSX.Element {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed((process.env.NEXT_PUBLIC_ALLOW_SELF_REGISTER ?? "false").toLowerCase() === "true");
  }, []);

  if (!allowed) {
    return (
      <main className="min-h-screen grid place-items-center p-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Registration disabled</h1>
          <p className="text-gray-600">Please contact an administrator.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen grid place-items-center p-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-xl font-semibold">Create your account</h1>
        <p className="text-sm text-gray-600">
          This is a placeholder. Hook it to <code>/api/auth/register</code> if you allow public signups.
        </p>
      </div>
    </main>
  );
}
