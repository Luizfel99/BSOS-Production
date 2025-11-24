// Componente para Comunicação Profissional com Clientes
"use client";import WiredButton from "@/components/ui/WiredButton";

import { useState } from "react";

interface TemplateMessage {
  id: string;
  categoria: string;
  titulo: string;
  portugues: string;
  ingles: string;
  plataforma: string[];
}

export default function ComunicacaoProfissional() {
  const [idiomaAtivo, setIdiomaAtivo] = useState<"pt" | "en">("pt");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [plataformaFiltro, setPlataformaFiltro] = useState("todas");

  const templates: TemplateMessage[] = [
  {
    id: "1",
    categoria: "confirmacao",
    titulo: "Confirmação de Agendamento",
    portugues:
    "Olá {nome}! Confirmamos seu agendamento para {data} às {hora}. Nossa equipe chegará pontualmente. Caso precise alterar, nos avise com 24h de antecedência. Bright & Shine - Limpeza Profissional ✨",
    ingles:
    "Hello {name}! We confirm your appointment for {date} at {time}. Our team will arrive punctually. If you need to reschedule, please notify us 24h in advance. Bright & Shine - Professional Cleaning ✨",
    plataforma: ["WhatsApp", "SMS", "Email"]
  },
  {
    id: "2",
    categoria: "follow-up",
    titulo: "Follow-up Pós-Limpeza",
    portugues:
    "Olá {nome}! Esperamos que tenha ficado satisfeito(a) com nosso serviço hoje. Sua opinião é muito importante para nós. Poderia avaliar nosso trabalho? Link: {link_avaliacao}. Obrigado! Bright & Shine",
    ingles:
    "Hello {name}! We hope you were satisfied with our service today. Your feedback is very important to us. Could you please rate our work? Link: {evaluation_link}. Thank you! Bright & Shine",
    plataforma: ["WhatsApp", "Email", "SMS"]
  },
  {
    id: "3",
    categoria: "reclamacao",
    titulo: "Resposta a Reclamações",
    portugues:
    "Olá {nome}, lamentamos profundamente pelo inconveniente. Sua satisfação é nossa prioridade. Vamos enviar nossa equipe de supervisão para resolver a situação em até 24h, sem custo adicional. Att, Bright & Shine",
    ingles:
    "Hello {name}, we deeply regret the inconvenience. Your satisfaction is our priority. We will send our supervision team to resolve the situation within 24h, at no additional cost. Best regards, Bright & Shine",
    plataforma: ["WhatsApp", "Email", "Telefone"]
  },
  {
    id: "4",
    categoria: "reagendamento",
    titulo: "Reagendamento de Serviço",
    portugues:
    "Olá {nome}! Precisamos reagendar seu serviço de {data_original}. Temos disponibilidade em: {opcoes_datas}. Pedimos desculpas pelo inconveniente. Qual horário funciona melhor? Bright & Shine",
    ingles:
    "Hello {name}! We need to reschedule your service from {original_date}. We have availability on: {date_options}. We apologize for the inconvenience. Which time works best for you? Bright & Shine",
    plataforma: ["WhatsApp", "Email", "Telefone"]
  },
  {
    id: "5",
    categoria: "airbnb",
    titulo: "Limpeza Airbnb - Check-out",
    portugues:
    "Propriedade limpa e pronta! Check-out concluído às {hora}. Todos os ambientes higienizados conforme protocolo Airbnb. Roupa de cama trocada, banheiros sanitizados. Próximo check-in: {proximo_checkin}. Bright & Shine",
    ingles:
    "Property cleaned and ready! Check-out completed at {time}. All areas sanitized according to Airbnb protocol. Bed linens changed, bathrooms sanitized. Next check-in: {next_checkin}. Bright & Shine",
    plataforma: ["Hostaway", "Email", "WhatsApp"]
  },
  {
    id: "6",
    categoria: "elogio",
    titulo: "Resposta a Elogios",
    portugues:
    "Olá {nome}! Muito obrigado pelo elogio! 😊 Ficamos felizes em saber que superamos suas expectativas. Continuaremos mantendo essa qualidade em todos os nossos serviços. Bright & Shine - Sempre brilhando! ✨",
    ingles:
    "Hello {name}! Thank you so much for the compliment! 😊 We are happy to know we exceeded your expectations. We will continue maintaining this quality in all our services. Bright & Shine - Always shining! ✨",
    plataforma: ["WhatsApp", "Email", "Google Reviews"]
  },
  {
    id: "7",
    categoria: "promocao",
    titulo: "Oferta Especial",
    portugues:
    "Olá {nome}! Oferta especial para você: 20% de desconto na próxima limpeza! Válido até {data_limite}. Use o código: BRILHO20. Agende já: {link_agendamento}. Bright & Shine ✨",
    ingles:
    "Hello {name}! Special offer for you: 20% discount on your next cleaning! Valid until {deadline}. Use code: SHINE20. Book now: {booking_link}. Bright & Shine ✨",
    plataforma: ["WhatsApp", "Email", "SMS"]
  },
  {
    id: "8",
    categoria: "lembrete",
    titulo: "Lembrete de Agendamento",
    portugues:
    "Olá {nome}! Lembrando: sua limpeza está agendada para AMANHÃ, {data} às {hora}. Nossa equipe: {equipe}. Certifique-se de que o local esteja acessível. Bright & Shine",
    ingles:
    "Hello {name}! Reminder: your cleaning is scheduled for TOMORROW, {date} at {time}. Our team: {team}. Please ensure the location is accessible. Bright & Shine",
    plataforma: ["WhatsApp", "SMS", "Email"]
  }];


  const categorias = [
  "todas",
  "confirmacao",
  "follow-up",
  "reclamacao",
  "reagendamento",
  "airbnb",
  "elogio",
  "promocao",
  "lembrete"];


  const plataformas = [
  "todas",
  "WhatsApp",
  "Email",
  "SMS",
  "Hostaway",
  "Telefone",
  "Google Reviews"];


  const templatesFiltrados = templates.filter((template) => {
    const categoriaMatch =
    categoriaFiltro === "todas" || template.categoria === categoriaFiltro;
    const plataformaMatch =
    plataformaFiltro === "todas" ||
    template.plataforma.includes(plataformaFiltro);
    return categoriaMatch && plataformaMatch;
  });

  const copiarTexto = (texto: string) => {
    navigator.clipboard.writeText(texto);
    // Aqui você poderia adicionar uma notificação de sucesso
  };

  const exportarTemplates = () => {
    let content = "Categoria,Título,Português,Inglês,Plataformas\n";

    templates.forEach((template) => {
      content += `"${template.categoria}","${template.titulo}","${template.portugues}","${template.ingles}","${template.plataforma.join(", ")}"\n`;
    });

    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `templates_comunicacao_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Comunicação Profissional com Clientes
        </h2>
        <div className="flex space-x-2">
          <WiredButton
            onClick={() => setIdiomaAtivo(idiomaAtivo === "pt" ? "en" : "pt")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">

            {idiomaAtivo === "pt" ? "🇧🇷 Português" : "🇺🇸 English"}
          </WiredButton>
          <WiredButton
            onClick={exportarTemplates}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">

            Exportar Templates
          </WiredButton>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2">

              {categorias.map((cat) =>
              <option key={cat} value={cat}>
                  {cat === "todas" ?
                "Todas as Categorias" :
                cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plataforma
            </label>
            <select
              value={plataformaFiltro}
              onChange={(e) => setPlataformaFiltro(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2">

              {plataformas.map((plat) =>
              <option key={plat} value={plat}>
                  {plat === "todas" ? "Todas as Plataformas" : plat}
                </option>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templatesFiltrados.map((template) =>
        <div
          key={template.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {template.titulo}
                </h3>
                <div className="flex items-center space-x-2 mt-2">
                  <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                  template.categoria === "confirmacao" ?
                  "bg-blue-100 text-blue-700" :
                  template.categoria === "follow-up" ?
                  "bg-green-100 text-green-700" :
                  template.categoria === "reclamacao" ?
                  "bg-red-100 text-red-700" :
                  template.categoria === "reagendamento" ?
                  "bg-yellow-100 text-yellow-700" :
                  template.categoria === "airbnb" ?
                  "bg-purple-100 text-purple-700" :
                  template.categoria === "elogio" ?
                  "bg-pink-100 text-pink-700" :
                  template.categoria === "promocao" ?
                  "bg-orange-100 text-orange-700" :
                  "bg-gray-100 text-gray-700"}`
                  }>

                    {template.categoria}
                  </span>
                  {template.plataforma.map((plat) =>
                <span
                  key={plat}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">

                      {plat}
                    </span>
                )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    {idiomaAtivo === "pt" ? "Português" : "English"}
                  </label>
                  <WiredButton
                  onClick={() =>
                  copiarTexto(
                    idiomaAtivo === "pt" ?
                    template.portugues :
                    template.ingles
                  )
                  }
                  className="text-sm text-primary-600 hover:text-primary-700">

                    Copiar
                  </WiredButton>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
                  {idiomaAtivo === "pt" ? template.portugues : template.ingles}
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              <p>Tip: Replace variables in braces with real client data</p>
              <p>
                Exemplo: {"{nome}"} → João Silva, {"{data}"} → 15/10/2024
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Guia de Variáveis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Guia de Variáveis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Dados do Cliente</h4>
            <ul className="space-y-1 text-gray-600">
              <li>
                <code className="bg-gray-100 px-1 rounded">{"{nome}"}</code> -
                Nome do cliente
              </li>
              <li>
                <code className="bg-gray-100 px-1 rounded">{"{empresa}"}</code>{" "}
                - Nome da empresa
              </li>
              <li>
                <code className="bg-gray-100 px-1 rounded">{"{endereco}"}</code>{" "}
                - Endereço
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">Data e Hora</h4>
            <ul className="space-y-1 text-gray-600">
              <li>
                <code className="bg-gray-100 px-1 rounded">{"{data}"}</code> -
                Data do agendamento
              </li>
              <li>
                <code className="bg-gray-100 px-1 rounded">{"{hora}"}</code> -
                Horário
              </li>
              <li>
                <code className="bg-gray-100 px-1 rounded">
                  {"{data_limite}"}
                </code>{" "}
                - Data limite
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">Equipe e Serviço</h4>
            <ul className="space-y-1 text-gray-600">
              <li>
                <code className="bg-gray-100 px-1 rounded">{"{equipe}"}</code> -
                Nome da equipe
              </li>
              <li>
                <code className="bg-gray-100 px-1 rounded">{"{servico}"}</code>{" "}
                - Tipo de serviço
              </li>
              <li>
                <code className="bg-gray-100 px-1 rounded">{"{valor}"}</code> -
                Valor do serviço
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>);

}