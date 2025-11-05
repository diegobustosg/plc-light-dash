import StatusIndicator from "./StatusIndicator";
import { Power } from "lucide-react";

interface LightIndicatorProps {
  lightId: number;
  lightName: string;
  isActive: boolean;
  isAcknowledged: boolean;
  color: string;
}

const LightIndicator = ({
  lightId,
  lightName,
  isActive,
  isAcknowledged,
  color,
}: LightIndicatorProps) => {
  const shouldBlink = isActive && !isAcknowledged;
  return (
    <div className="bg-[hsl(var(--card))] border-4 border-[hsl(var(--panel-border))] rounded-2xl p-10 shadow-2xl transition-all duration-300 animate-[fade-in-up_0.5s_ease-out]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-[hsl(var(--panel-border))]">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-xl bg-[hsl(var(--panel-header))] flex items-center justify-center border-2 border-[hsl(var(--panel-border))]">
            <Power
              className={`w-10 h-10 ${
                isActive ? "" : "text-[hsl(var(--status-inactive))]"
              }`}
              style={isActive ? { color } : undefined}
            />
          </div>
          <div>
            <h3 className="text-4xl font-bold tracking-tight">{lightName}</h3>
            <p className="text-base text-muted-foreground uppercase tracking-wide">ID: {lightId}</p>
          </div>
        </div>
        <StatusIndicator isActive={isActive} size="lg" />
      </div>

      {/* Status Display */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          <span
            className={`text-5xl font-bold uppercase tracking-wider px-12 py-6 rounded-2xl transition-all ${
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
    </div>
  );
};

export default LightIndicator;
