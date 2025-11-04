interface StatusIndicatorProps {
  isActive: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
}

const StatusIndicator = ({ isActive, label, size = "md" }: StatusIndicatorProps) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };

  const glowClass = isActive
    ? "bg-[hsl(var(--status-active))] animate-[pulse-glow-active_2s_ease-in-out_infinite]"
    : "bg-[hsl(var(--status-inactive))] animate-[pulse-glow-inactive_2s_ease-in-out_infinite]";

  return (
    <div className="flex items-center gap-2">
      <div
        className={`rounded-full ${sizeClasses[size]} ${glowClass} transition-all duration-300`}
        aria-label={`Status: ${isActive ? "Active" : "Inactive"}`}
      />
      {label && (
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;
