import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StatusIndicator from "./StatusIndicator";
import TimerDisplay from "./TimerDisplay";
import { Power, Clock, Settings } from "lucide-react";

interface LightControlPanelProps {
  lightId: number;
  lightName: string;
  isActive: boolean;
  timerValue: number;
  timerRemaining: number;
  onToggle: (id: number) => void;
  onTimerChange: (id: number, value: number) => void;
}

const LightControlPanel = ({
  lightId,
  lightName,
  isActive,
  timerValue,
  timerRemaining,
  onToggle,
  onTimerChange,
}: LightControlPanelProps) => {
  const [editMode, setEditMode] = useState(false);
  const [tempValue, setTempValue] = useState(timerValue.toString());

  const handleSaveTimer = () => {
    const value = parseInt(tempValue) || 0;
    if (value >= 0 && value <= 999) {
      onTimerChange(lightId, value);
      setEditMode(false);
    }
  };

  return (
    <div className="bg-[hsl(var(--card))] border-2 border-[hsl(var(--panel-border))] rounded-lg p-6 shadow-xl hover:border-[hsl(var(--ring))] transition-all duration-300 animate-[fade-in-up_0.5s_ease-out]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[hsl(var(--panel-border))]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[hsl(var(--panel-header))] flex items-center justify-center border border-[hsl(var(--panel-border))]">
            <Power
              className={`w-5 h-5 ${
                isActive ? "text-[hsl(var(--status-active))]" : "text-[hsl(var(--status-inactive))]"
              }`}
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
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Estado Actual
          </span>
          <span
            className={`text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
              isActive
                ? "bg-[hsl(var(--status-active)/0.2)] text-[hsl(var(--status-active))]"
                : "bg-[hsl(var(--status-inactive)/0.2)] text-[hsl(var(--status-inactive))]"
            }`}
          >
            {isActive ? "ENCENDIDA" : "APAGADA"}
          </span>
        </div>
      </div>

      {/* Timer Section */}
      <div className="bg-[hsl(var(--panel-header))] rounded-lg p-4 mb-6 border border-[hsl(var(--panel-border))]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[hsl(var(--status-info))]" />
            <span className="text-sm font-semibold uppercase tracking-wide">Temporizador</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditMode(!editMode)}
            className="h-8 px-3 border-[hsl(var(--panel-border))] hover:bg-[hsl(var(--accent))]"
          >
            <Settings className="w-3 h-3" />
          </Button>
        </div>

        <div className="flex items-center justify-around gap-4">
          <div className="flex-1">
            <TimerDisplay value={timerRemaining} label="Restante" />
          </div>

          <div className="flex-1">
            {editMode ? (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">Config. (seg)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="bg-[hsl(var(--panel-bg))] border-[hsl(var(--panel-border))] text-center font-mono"
                    min="0"
                    max="999"
                  />
                  <Button
                    size="sm"
                    onClick={handleSaveTimer}
                    className="bg-[hsl(var(--status-active))] hover:bg-[hsl(var(--status-active)/0.8)] text-black font-semibold"
                  >
                    OK
                  </Button>
                </div>
              </div>
            ) : (
              <TimerDisplay value={timerValue} label="Configurado" />
            )}
          </div>
        </div>
      </div>

      {/* Control Button */}
      <Button
        onClick={() => onToggle(lightId)}
        className={`w-full h-14 text-lg font-bold uppercase tracking-wider transition-all duration-300 ${
          isActive
            ? "bg-[hsl(var(--status-inactive))] hover:bg-[hsl(var(--status-inactive)/0.8)] text-white"
            : "bg-[hsl(var(--status-active))] hover:bg-[hsl(var(--status-active)/0.8)] text-black"
        }`}
      >
        <Power className="w-5 h-5 mr-2" />
        {isActive ? "APAGAR" : "ENCENDER"}
      </Button>
    </div>
  );
};

export default LightControlPanel;
