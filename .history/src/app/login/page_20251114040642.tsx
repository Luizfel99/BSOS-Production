"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("pt");

  const texts = {
    pt: {
      title: "Bem-vindo de volta",
      subtitle: "Acesse seu painel administrativo",
      email: "E-mail",
      password: "Senha",
      login: "Entrar",
      forgot: "Esqueci a senha",
    },
    en: {
      title: "Welcome back",
      subtitle: "Access your admin dashboard",
      email: "Email",
      password: "Password",
      login: "Sign In",
      forgot: "Forgot password?",
    },
    es: {
      title: "Bienvenido de nuevo",
      subtitle: "Accede a tu panel administrativo",
      email: "Correo",
      password: "Contraseña",
      login: "Iniciar sesión",
      forgot: "¿Olvidaste la contraseña?",
    },
  };

  const t = texts[lang as keyof typeof texts];

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {
      alert("Credenciais inválidas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">

      {/* LEFT SIDE - GRADIENT PANEL */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-blue-900 items-center justify-center p-10">
        <div className="text-white space-y-4 max-w-md animate-fadeIn">
          <h1 className="text-4xl font-bold leading-tight">
            Sistema inteligente de gestão, tarefas e propriedades.
          </h1>
          <p className="opacity-90 text-lg">
            Organize sua operação de limpeza, escalas, pagamentos e clientes em
            um único lugar.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE — FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <div className="w-full max-w-md space-y-6 animate-fadeIn">

          {/* LANGUAGE SWITCH */}
          <div className="flex justify-end">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="border p-2 rounded bg-white text-gray-700 shadow-sm"
            >
              <option value="pt">🇧🇷 PT</option>
              <option value="en">🇺🇸 EN</option>
              <option value="es">🇪🇸 ES</option>
            </select>
          </div>

          {/* TITLES */}
          <h2 className="text-3xl font-bold">{t.title}</h2>
          <p className="text-gray-500">{t.subtitle}</p>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* EMAIL FIELD */}
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                required
                className="w-full pl-12 pr-3 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                placeholder={t.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD FIELD */}
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                required
                className="w-full pl-12 pr-3 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                placeholder={t.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-lg shadow-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "..." : t.login}
            </button>
          </form>

          {/* FORGOT PASSWORD */}
          <div className="text-right">
            <button className="text-blue-600 hover:underline">
              {t.forgot}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}