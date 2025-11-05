import { useState } from "react";
import LightIndicator from "@/components/LightIndicator";
import { useNodeRedAPI } from "@/hooks/useNodeRedAPI";
import { Wifi, WifiOff, Activity } from "lucide-react";

const Index = () => {
  const { lights, isConnected } = useNodeRedAPI();
  const [acknowledgedLights, setAcknowledgedLights] = useState<Record<number, boolean>>({});

  const handleAcknowledgeAll = () => {
    const newAcknowledged: Record<number, boolean> = {};
    lights.forEach(light => {
      if (light.isActive) {
        newAcknowledged[light.id] = true;
      }
    });
    setAcknowledgedLights(prev => ({ ...prev, ...newAcknowledged }));
  };

  const hasBlinkingLights = lights.some(light => light.isActive && !acknowledgedLights[light.id]);

  const lightColors = ["#22c55e", "#3b82f6", "#f59e0b"];


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[hsl(var(--panel-header))] border-b-2 border-[hsl(var(--panel-border))] shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[hsl(var(--status-active))] flex items-center justify-center shadow-lg">
                <Activity className="w-7 h-7 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">HMI Control SCADA</h1>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  Sistema de Control Industrial
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Connection Status */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--panel-bg))] border border-[hsl(var(--panel-border))]">
                {isConnected ? (
                  <>
                    <Wifi className="w-4 h-4 text-[hsl(var(--status-active))]" />
                    <span className="text-sm font-semibold text-[hsl(var(--status-active))] uppercase">
                      Conectado
                    </span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-[hsl(var(--status-warning))]" />
                    <span className="text-sm font-semibold text-[hsl(var(--status-warning))] uppercase">
                      Desconectado
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Info Banner */}
        {!isConnected && (
          <div className="mb-6 p-4 bg-[hsl(var(--status-warning)/0.1)] border border-[hsl(var(--status-warning)/0.3)] rounded-lg">
            <p className="text-sm text-[hsl(var(--status-warning))] font-medium">
              ⚠️ Desconectado. Configure la URL de FastAPI en ajustes para conectar
              con el backend.
            </p>
          </div>
        )}

        {/* Global Acknowledgment Button */}
        {hasBlinkingLights && (
          <div className="mb-8 flex justify-center">
            <button
              onClick={handleAcknowledgeAll}
              className="px-8 py-4 bg-[hsl(var(--status-info))] text-white text-lg font-bold uppercase tracking-wide rounded-lg hover:bg-[hsl(var(--status-info))]/80 transition-colors shadow-xl animate-pulse"
            >
              Reconocer Todas las Alarmas
            </button>
          </div>
        )}

        {/* Light Indicators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lights.map((light, index) => (
            <LightIndicator
              key={light.id}
              lightId={light.id}
              lightName={light.name}
              isActive={light.isActive}
              isAcknowledged={acknowledgedLights[light.id] || false}
              color={lightColors[index % lightColors.length]}
            />
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 p-6 bg-[hsl(var(--card))] border border-[hsl(var(--panel-border))] rounded-lg">
          <h3 className="text-lg font-bold mb-4">Información de API REST</h3>
          <div className="space-y-2 text-sm font-mono text-muted-foreground">
            <p>
              <span className="text-[hsl(var(--status-active))]">GET</span> /api/lights - Obtener
              estado de todas las luces
            </p>
            <p>
              <span className="text-[hsl(var(--status-info))]">POST</span> /api/lights/:id/toggle -
              Encender/Apagar luz
            </p>
            <p>
              <span className="text-[hsl(var(--status-warning))]">GET</span> /health -
              Verificar conectividad
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
