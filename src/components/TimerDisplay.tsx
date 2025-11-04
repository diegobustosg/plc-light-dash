interface TimerDisplayProps {
  value: number;
  label?: string;
}

const TimerDisplay = ({ value, label = "Timer" }: TimerDisplayProps) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
        {label}
      </span>
      <div className="bg-[hsl(var(--panel-bg))] border border-[hsl(var(--panel-border))] rounded px-4 py-2 min-w-[100px]">
        <div className="font-mono text-2xl font-bold text-center tabular-nums tracking-wider text-foreground">
          {formatTime(value)}
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;
