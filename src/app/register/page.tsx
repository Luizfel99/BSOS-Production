"use client";import WiredButton from "@/components/ui/WiredButton";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "cleaner"
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      await axios.post("/api/auth/register", form);
      setMsg("✅ Usuário criado com sucesso!");

      // Limpar formulário
      setForm({
        name: "",
        email: "",
        password: "",
        role: "cleaner"
      });

      // Opcional: redirecionar após 2 segundos
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Erro ao criar usuário.";
      setMsg(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-4">

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Criar Usuário</h1>
          <p className="text-gray-500 mt-2">Somente administradores</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo
          </label>
          <input
            required
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="João Silva"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />

        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-mail
          </label>
          <input
            required
            type="email"
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="joao@exemplo.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />

        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <input
            required
            type="password"
            minLength={6}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Mínimo 6 caracteres"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />

        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Função
          </label>
          <select
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}>

            <option value="admin">Administrador</option>
            <option value="owner">Proprietário</option>
            <option value="manager">Gerente</option>
            <option value="supervisor">Supervisor</option>
            <option value="cleaner">Faxineiro(a)</option>
            <option value="client">Cliente</option>
          </select>
        </div>

        <WiredButton
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-3 rounded-lg w-full font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed" data-action="wire.auto">

          {loading ? "Criando..." : "Criar Usuário"}
        </WiredButton>

        {msg &&
        <div
          className={`p-3 rounded-lg text-center text-sm ${
          msg.includes("✅") ?
          "bg-green-50 text-green-700 border border-green-200" :
          "bg-red-50 text-red-700 border border-red-200"}`
          }>

            {msg}
          </div>
        }

        <div className="text-center pt-4">
          <WiredButton
            type="button"
            onClick={() => router.push("/login")}
            className="text-blue-600 hover:underline text-sm">

            ← Voltar para login
          </WiredButton>
        </div>
      </form>
    </div>);

}