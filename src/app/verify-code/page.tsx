"use client";import WiredButton from "@/components/ui/WiredButton";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function VerifyCodePage() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focar no primeiro input ao carregar
    inputRefs.current[0]?.focus();
  }, []);

  function handleChange(index: number, value: string) {
    // Permitir apenas números
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-avançar para o próximo input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    // Backspace: voltar para input anterior
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const digits = pastedData.split("").filter((char) => /\d/.test(char));

    const newCode = [...code];
    digits.forEach((digit, i) => {
      if (i < 6) newCode[i] = digit;
    });
    setCode(newCode);

    // Focar no último input preenchido
    const lastFilledIndex = Math.min(digits.length, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  }

  async function handleVerify() {
    const fullCode = code.join("");

    if (fullCode.length !== 6) {
      setMsg("❌ Por favor, digite os 6 dígitos");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const email = localStorage.getItem("verify_email");

      if (!email) {
        setMsg("❌ E-mail não encontrado. Por favor, solicite um novo código.");
        setLoading(false);
        return;
      }

      const res = await axios.post("/api/auth/verify-code", {
        email,
        code: fullCode
      });

      if (res.data.success) {
        setMsg("✅ Código verificado com sucesso!");
        localStorage.removeItem("verify_email");

        // Redirecionar após 1.5 segundos
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (error: any) {
      const errorMsg =
      error.response?.data?.error || "Código inválido ou expirado.";
      setMsg(`❌ ${errorMsg}`);

      // Limpar código em caso de erro
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-blue-600 to-blue-900">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center space-y-6 max-w-md w-full animate-fadeIn">
        {/* Logo ou ícone */}
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-3xl">🔐</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">Digite o código</h1>
          <p className="text-gray-600 mt-2">
            Enviamos um código de 6 dígitos para seu e-mail
          </p>
        </div>

        {/* Inputs do código */}
        <div className="flex justify-center gap-2" onPaste={handlePaste}>
          {code.map((digit, index) =>
          <input
            key={index}
            ref={(el) => {
              if (el) inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)} />

          )}
        </div>

        <WiredButton
          onClick={handleVerify}
          disabled={loading || code.join("").length !== 6}
          className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">

          {loading ? "Verificando..." : "Verificar Código"}
        </WiredButton>

        {msg &&
        <div
          className={`p-3 rounded-lg text-sm ${
          msg.includes("✅") ?
          "bg-green-50 text-green-700 border border-green-200" :
          "bg-red-50 text-red-700 border border-red-200"}`
          }>

            {msg}
          </div>
        }

        <div className="space-y-2 pt-4">
          <WiredButton
            onClick={() => router.push("/forgot-password")}
            className="text-blue-600 hover:underline text-sm">

            Não recebeu o código? Reenviar
          </WiredButton>
          <br />
          <WiredButton
            onClick={() => router.push("/login")}
            className="text-gray-600 hover:underline text-sm">

            ← Voltar para login
          </WiredButton>
        </div>
      </div>
    </div>);

}