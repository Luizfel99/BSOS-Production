"use client";import WiredButton from "@/components/ui/WiredButton";

import { useState, useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";

interface ApiConnection {
  id: string;
  name: string;
  platform: string;
  status: "connected" | "disconnected" | "error" | "syncing";
  lastSync: string;
  apiKey?: string;
  webhookUrl?: string;
  authToken?: string;
  config: Record<string, any>;
}

interface SyncLog {
  id: number;
  platform: string;
  action: string;
  status: "success" | "error" | "warning";
  timestamp: string;
  details: string;
}

export default function IntegracaoAPIs() {
  const { success, error, warning, info } = useNotifications();
  const [connections, setConnections] = useState<ApiConnection[]>([
  {
    id: "airbnb-1",
    name: "Airbnb - Conta Principal",
    platform: "airbnb",
    status: "connected",
    lastSync: "2024-01-20 14:30",
    config: {
      propertyCount: 8,
      autoSync: true,
      syncInterval: 15,
      notifications: true
    }
  },
  {
    id: "hostaway-1",
    name: "Hostaway - PMS",
    platform: "hostaway",
    status: "connected",
    lastSync: "2024-01-20 14:25",
    config: {
      propertyCount: 12,
      autoSync: true,
      syncInterval: 10,
      notifications: true
    }
  },
  {
    id: "taskbird-1",
    name: "Taskbird - Gestão de Tarefas",
    platform: "taskbird",
    status: "disconnected",
    lastSync: "Nunca",
    config: {
      autoCreateTasks: true,
      assignCleaner: true,
      notifications: false
    }
  },
  {
    id: "turno-1",
    name: "Turno - Agenda Funcionários",
    platform: "turno",
    status: "error",
    lastSync: "2024-01-20 10:15",
    config: {
      autoSchedule: false,
      syncShifts: true,
      notifications: true
    }
  }]
  );

  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([
  {
    id: 1,
    platform: "Airbnb",
    action: "Nova reserva importada",
    status: "success",
    timestamp: "14:30",
    details: "Checkout John Smith - Apto Centro às 11:00"
  },
  {
    id: 2,
    platform: "Hostaway",
    action: "Status atualizado",
    status: "success",
    timestamp: "14:25",
    details: "Casa Ipanema - Status: Pronto para checkin"
  },
  {
    id: 3,
    platform: "Turno",
    action: "Erro de sincronização",
    status: "error",
    timestamp: "10:15",
    details: "Token de acesso expirado"
  },
  {
    id: 4,
    platform: "Taskbird",
    action: "Tarefa criada automaticamente",
    status: "warning",
    timestamp: "09:45",
    details: "Limpeza Studio Copacabana - Cleaner não atribuído"
  }]
  );

  const [showApiForm, setShowApiForm] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [newConnection, setNewConnection] = useState<Partial<ApiConnection>>(
    {}
  );

  const platforms = [
  {
    id: "airbnb",
    name: "Airbnb",
    description: "Importar reservas, checkout/checkin automático",
    icon: "ABB",
    authType: "OAuth 2.0",
    features: [
    "Importação de reservas",
    "Status automático",
    "Calendário sincronizado"]

  },
  {
    id: "hostaway",
    name: "Hostaway",
    description: "Sistema de gestão de propriedades completo",
    icon: "HST",
    authType: "API Key",
    features: [
    "Gestão de propriedades",
    "Reservas",
    "Check-in/out",
    "Relatórios"]

  },
  {
    id: "taskbird",
    name: "Taskbird",
    description: "Criação automática de tarefas de limpeza",
    icon: "TSK",
    authType: "API Key",
    features: [
    "Criação de tarefas",
    "Atribuição automática",
    "Status tracking"]

  },
  {
    id: "turno",
    name: "Turno",
    description: "Gestão de agenda e turnos dos funcionários",
    icon: "⏰",
    authType: "API Key",
    features: ["Agenda funcionários", "Turnos", "Disponibilidade", "Folgas"]
  },
  {
    id: "booking",
    name: "Booking.com",
    description: "Integração com reservas do Booking",
    icon: "🌐",
    authType: "XML API",
    features: ["Importação reservas", "Status sync", "Avaliações"]
  },
  {
    id: "vrbo",
    name: "VRBO/Expedia",
    description: "Gestão de propriedades VRBO",
    icon: "🏖️",
    authType: "API Key",
    features: ["Reservas", "Calendário", "Pricing", "Availability"]
  }];


  const handleConnect = (platformId: string) => {
    setSelectedPlatform(platformId);
    setShowApiForm(true);
    setNewConnection({ platform: platformId });
  };

  const handleSaveConnection = async () => {
    if (newConnection.name && newConnection.platform) {
      try {
        // Testar conexão primeiro
        const testResponse = await fetch("/api/integrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "test_connection",
            platform: newConnection.platform,
            credentials: {
              apiKey: newConnection.apiKey,
              webhookUrl: newConnection.webhookUrl,
              authToken: newConnection.authToken
            }
          })
        });

        if (!testResponse.ok) {
          throw new Error("Falha ao testar conexão");
        }

        // Configurar integração
        const configResponse = await fetch("/api/integrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "configure",
            platform: newConnection.platform,
            credentials: {
              apiKey: newConnection.apiKey,
              webhookUrl: newConnection.webhookUrl,
              authToken: newConnection.authToken
            }
          })
        });

        if (!configResponse.ok) {
          throw new Error("Falha ao configurar integração");
        }

        const connection: ApiConnection = {
          id: `${newConnection.platform}-${Date.now()}`,
          name: newConnection.name,
          platform: newConnection.platform,
          status: "connected",
          lastSync: new Date().toLocaleString("pt-BR"),
          apiKey: newConnection.apiKey,
          webhookUrl: newConnection.webhookUrl,
          authToken: newConnection.authToken,
          config: {}
        };

        setConnections([...connections, connection]);
        setShowApiForm(false);
        setNewConnection({});

        // Show success notification
        success(`Integração ${newConnection.name} conectada com sucesso!`);

        // Log de sucesso
        const newLog: SyncLog = {
          id: syncLogs.length + 1,
          platform: newConnection.name || "",
          action: "Conexão estabelecida",
          status: "success",
          timestamp: new Date().toLocaleTimeString("pt-BR"),
          details: `Integração configurada com sucesso. Webhook: ${newConnection.webhookUrl || "N/A"}`
        };
        setSyncLogs([newLog, ...syncLogs]);
      } catch (err) {
        console.error("Erro ao salvar conexão:", err);

        // Show error notification
        const errorMessage =
        err instanceof Error ? err.message : "Erro ao conectar integração";
        error(`Falha ao conectar ${newConnection.name}: ${errorMessage}`);

        // Log de erro
        const errorLog: SyncLog = {
          id: syncLogs.length + 1,
          platform: newConnection.name || "",
          action: "Erro de conexão",
          status: "error",
          timestamp: new Date().toLocaleTimeString("pt-BR"),
          details: `Falha ao estabelecer conexão: ${err}`
        };
        setSyncLogs([errorLog, ...syncLogs]);
      }
    }
  };

  const handleSync = async (connectionId: string) => {
    setConnections(
      connections.map((conn) =>
      conn.id === connectionId ? { ...conn, status: "syncing" } : conn
      )
    );

    try {
      // Fazer sincronização via API
      const response = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sync",
          connectionId
        })
      });

      if (!response.ok) {
        throw new Error("Falha na sincronização");
      }

      const syncResult = await response.json();

      // Atualizar status para conectado
      setConnections((prevConnections) =>
      prevConnections.map((conn) =>
      conn.id === connectionId ?
      {
        ...conn,
        status: "connected",
        lastSync: new Date().toLocaleString("pt-BR")
      } :
      conn
      )
      );

      const connection = connections.find((c) => c.id === connectionId);
      if (connection) {
        // Show success notification
        success(`Sincronização de ${connection.name} concluída com sucesso!`);

        const newLog: SyncLog = {
          id: syncLogs.length + 1,
          platform: connection.name,
          action: "Sincronização manual",
          status: "success",
          timestamp: new Date().toLocaleTimeString("pt-BR"),
          details: `${syncResult.properties?.length || 0} propriedades e ${syncResult.reservations?.length || 0} reservas sincronizadas`
        };
        setSyncLogs([newLog, ...syncLogs]);
      }
    } catch (err) {
      // Marcar como erro
      setConnections((prevConnections) =>
      prevConnections.map((conn) =>
      conn.id === connectionId ? { ...conn, status: "error" } : conn
      )
      );

      const connection = connections.find((c) => c.id === connectionId);
      if (connection) {
        // Show error notification
        const errorMessage =
        err instanceof Error ? err.message : "Erro na sincronização";
        error(`Falha na sincronização de ${connection.name}: ${errorMessage}`);

        const errorLog: SyncLog = {
          id: syncLogs.length + 1,
          platform: connection.name,
          action: "Erro de sincronização",
          status: "error",
          timestamp: new Date().toLocaleTimeString("pt-BR"),
          details: `Falha na sincronização: ${err}`
        };
        setSyncLogs([errorLog, ...syncLogs]);
      }
    }
  };

  const handleDisconnect = (connectionId: string) => {
    const connection = connections.find((c) => c.id === connectionId);
    setConnections(
      connections.map((conn) =>
      conn.id === connectionId ? { ...conn, status: "disconnected" } : conn
      )
    );

    // Show disconnect notification
    if (connection) {
      warning(`Integração ${connection.name} foi desconectada`);
    }
  };

  const handleConfigure = (connectionId: string) => {
    console.log("⚙️ Configurando conexão ID:", connectionId);
    alert(`Abrindo configurações da conexão ID: ${connectionId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800";
      case "syncing":
        return "bg-blue-100 text-blue-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "disconnected":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLogStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Integrações com APIs
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Conexões Ativas</h3>
          <p className="text-2xl font-bold text-green-600">
            {connections.filter((c) => c.status === "connected").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">
            Propriedades Sincronizadas
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            {connections.reduce(
              (total, conn) => total + (conn.config.propertyCount || 0),
              0
            )}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">
            Última Sincronização
          </h3>
          <p className="text-2xl font-bold text-purple-600">14:30</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Erros Hoje</h3>
          <p className="text-2xl font-bold text-red-600">
            {syncLogs.filter((log) => log.status === "error").length}
          </p>
        </div>
      </div>

      {/* Conexões Existentes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Conexões Configuradas
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {connections.map((connection) =>
            <div
              key={connection.id}
              className="border border-gray-200 rounded-lg p-4">

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {platforms.find((p) => p.id === connection.platform)?.
                    icon || "🔗"}
                    </span>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {connection.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Última sync: {connection.lastSync}
                      </p>
                    </div>
                  </div>
                  <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(connection.status)}`}>

                    {connection.status === "connected" ?
                  "Conectado" :
                  connection.status === "syncing" ?
                  "Sincronizando..." :
                  connection.status === "error" ?
                  "Erro" :
                  "Desconectado"}
                  </span>
                </div>

                {connection.config.propertyCount &&
              <p className="text-sm text-gray-600 mb-3">
                    {connection.config.propertyCount} propriedades sincronizadas
                  </p>
              }

                <div className="flex gap-2">
                  {(connection.status === "connected" ||
                connection.status === "syncing") &&
                <WiredButton
                  onClick={() => handleSync(connection.id)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  disabled={connection.status === "syncing"}>

                      {connection.status === "syncing" ?
                  "Sincronizando..." :
                  "Sincronizar"}
                    </WiredButton>
                }
                  <WiredButton
                  onClick={() => handleDisconnect(connection.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium">

                    Desconectar
                  </WiredButton>
                  <WiredButton
                  className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                  onClick={() => handleConfigure(connection.id)}>

                    Configurar
                  </WiredButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Plataformas Disponíveis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Plataformas Disponíveis
          </h3>
          <p className="text-sm text-gray-600">
            Conecte com as principais plataformas de gestão de propriedades
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map((platform) => {
              const isConnected = connections.some(
                (c) => c.platform === platform.id && c.status === "connected"
              );
              return (
                <div
                  key={platform.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">

                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{platform.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {platform.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {platform.authType}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {platform.description}
                  </p>

                  <div className="mb-4">
                    <h5 className="text-xs font-medium text-gray-700 mb-1">
                      Recursos:
                    </h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {platform.features.map((feature, index) =>
                      <li key={index} className="flex items-center gap-1">
                          <span className="text-green-500">✓</span>
                          {feature}
                        </li>
                      )}
                    </ul>
                  </div>

                  <WiredButton
                    onClick={() => handleConnect(platform.id)}
                    disabled={isConnected}
                    className={`w-full py-2 px-4 rounded text-sm font-medium ${
                    isConnected ?
                    "bg-gray-100 text-gray-400 cursor-not-allowed" :
                    "bg-blue-600 text-white hover:bg-blue-700"}`
                    }>

                    {isConnected ? "Já Conectado" : "Conectar"}
                  </WiredButton>
                </div>);

            })}
          </div>
        </div>
      </div>

      {/* Log de Sincronização */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Log de Sincronização
          </h3>
          <p className="text-sm text-gray-600">
            Histórico de atividades das integrações
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {syncLogs.map((log) =>
            <div
              key={log.id}
              className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-b-0">

                <span
                className={`text-sm font-medium ${getLogStatusColor(log.status)}`}>

                  {log.status === "success" ?
                "✓" :
                log.status === "error" ?
                "✗" :
                "⚠"}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      {log.platform}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {log.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{log.action}</p>
                  <p className="text-xs text-gray-500">{log.details}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Configuração de API */}
      {showApiForm &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Conectar com{" "}
              {platforms.find((p) => p.id === selectedPlatform)?.name}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Conexão
                </label>
                <input
                type="text"
                value={newConnection.name || ""}
                onChange={(e) =>
                setNewConnection({ ...newConnection, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Ex: Airbnb - Conta Principal" />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key / Token
                </label>
                <input
                type="password"
                value={newConnection.apiKey || ""}
                onChange={(e) =>
                setNewConnection({
                  ...newConnection,
                  apiKey: e.target.value
                })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Cole sua API key aqui" />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Webhook URL (Gerada Automaticamente)
                </label>
                <div className="relative">
                  <input
                  type="url"
                  value={`${window.location.origin}/api/webhooks?platform=${selectedPlatform}`}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-600" />

                  <WiredButton
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/api/webhooks?platform=${selectedPlatform}`
                    );
                    alert("URL copiada para a área de transferência!");
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 text-sm">

                    Copiar
                  </WiredButton>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Use esta URL para configurar webhooks na plataforma{" "}
                  {platforms.find((p) => p.id === selectedPlatform)?.name}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <WiredButton
              onClick={handleSaveConnection}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">

                Conectar
              </WiredButton>
              <WiredButton
              onClick={() => {
                setShowApiForm(false);
                setNewConnection({});
              }}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">

                Cancelar
              </WiredButton>
            </div>
          </div>
        </div>
      }
    </div>);

}