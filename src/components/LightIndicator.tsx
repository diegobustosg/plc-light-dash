import StatusIndicator from "./StatusIndicator";
import TimerDisplay from "./TimerDisplay";
import { Power, Clock } from "lucide-react";

interface LightIndicatorProps {
  lightId: number;
  lightName: string;
  isActive: boolean;
  timerRemaining: number;
  timerValue: number;
  isAcknowledged: boolean;
  color: string;
}

const LightIndicator = ({
  lightId,
  lightName,
  isActive,
  timerRemaining,
  timerValue,
  isAcknowledged,
  color,
}: LightIndicatorProps) => {
  const shouldBlink = isActive && !isAcknowledged;
  return (
    <div className="bg-[hsl(var(--card))] border-2 border-[hsl(var(--panel-border))] rounded-lg p-6 shadow-xl transition-all duration-300 animate-[fade-in-up_0.5s_ease-out]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[hsl(var(--panel-border))]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[hsl(var(--panel-header))] flex items-center justify-center border border-[hsl(var(--panel-border))]">
            <Power
              className={`w-5 h-5 ${
                isActive ? "" : "text-[hsl(var(--status-inactive))]"
              }`}
              style={isActive ? { color } : undefined}
            />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">{lightName}</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">ID: {lightId}</p>
          </div>
        </div>
        <StatusIndicator isActive={isActive} size="lg" />
      </div>

      {/* Status Display */}
      <div className="mb-6">
        <div className="flex items-center justify-center">
          <span
            className={`text-2xl font-bold uppercase tracking-wider px-6 py-3 rounded-lg transition-all ${
              !isActive && "bg-[hsl(var(--status-inactive)/0.2)] text-[hsl(var(--status-inactive))]"
            } ${shouldBlink ? "animate-pulse" : ""}`}
            style={isActive ? { 
              backgroundColor: `${color}33`, 
              color: color 
            } : undefined}
          >
            {isActive ? "ENCENDIDA" : "APAGADA"}
          </span>
        </div>
      </div>

      {/* Timer Section */}
      <div className="bg-[hsl(var(--panel-header))] rounded-lg p-4 border border-[hsl(var(--panel-border))]">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-[hsl(var(--status-info))]" />
          <span className="text-sm font-semibold uppercase tracking-wide">Temporizador</span>
        </div>

        <div className="flex items-center justify-around gap-4">
          <div className="flex-1">
            <TimerDisplay value={timerRemaining} label="Restante" />
          </div>
          <div className="flex-1">
            <TimerDisplay value={timerValue} label="Configurado" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightIndicator;
