import { useState } from "react";
import LightControlPanel from "@/components/LightControlPanel";
import { useNodeRedAPI } from "@/hooks/useNodeRedAPI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Wifi, WifiOff, Activity } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Index = () => {
  const { lights, isConnected, toggleLight, updateTimer, setApiUrl } = useNodeRedAPI();
  const [showSettings, setShowSettings] = useState(false);
  const [tempApiUrl, setTempApiUrl] = useState("http://localhost:1880/api");

  const handleSaveApiUrl = () => {
    setApiUrl(tempApiUrl);
    setShowSettings(false);
  };

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
                      Modo Demo
                    </span>
                  </>
                )}
              </div>

              {/* Settings Dialog */}
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-[hsl(var(--panel-border))] hover:bg-[hsl(var(--accent))]"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[hsl(var(--card))] border-[hsl(var(--panel-border))]">
                  <DialogHeader>
                    <DialogTitle>Configuración de Conexión</DialogTitle>
                    <DialogDescription>
                      Configure la URL de la API REST de Node-Red
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-url">URL de Node-Red API</Label>
                      <Input
                        id="api-url"
                        placeholder="http://localhost:1880/api"
                        value={tempApiUrl}
                        onChange={(e) => setTempApiUrl(e.target.value)}
                        className="bg-[hsl(var(--panel-bg))] border-[hsl(var(--panel-border))]"
                      />
                      <p className="text-xs text-muted-foreground">
                        Ejemplo: http://192.168.1.100:1880/api
                      </p>
                    </div>
                    <Button
                      onClick={handleSaveApiUrl}
                      className="w-full bg-[hsl(var(--status-active))] hover:bg-[hsl(var(--status-active)/0.8)] text-black font-semibold"
                    >
                      Guardar Configuración
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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
              ⚠️ Ejecutando en modo demo. Configure la URL de Node-Red en ajustes para conectar
              con el PLC real.
            </p>
          </div>
        )}

        {/* Light Control Panels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lights.map((light) => (
            <LightControlPanel
              key={light.id}
              lightId={light.id}
              lightName={light.name}
              isActive={light.isActive}
              timerValue={light.timerValue}
              timerRemaining={light.timerRemaining}
              onToggle={toggleLight}
              onTimerChange={updateTimer}
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
              <span className="text-[hsl(var(--status-warning))]">PUT</span> /api/lights/:id/timer
              - Actualizar temporizador
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
