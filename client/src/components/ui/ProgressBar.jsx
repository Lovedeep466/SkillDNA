const fills = {
  primary: "bg-primary-600",
  success: "bg-success-600",
  warning: "bg-warning-600",
  danger: "bg-danger-600",
};

const clamp = (n) => Math.max(0, Math.min(100, n));

// "marker" draws a tick at the score a target role requires.
export default function ProgressBar({ value = 0, tone = "primary", marker, className = "" }) {
  return (
    <div className={`relative h-2 w-full rounded-full bg-page ${className}`}>
      <div
        className={`h-2 rounded-full transition-all ${fills[tone]}`}
        style={{ width: `${clamp(value)}%` }}
      />
      {marker !== undefined && (
        <div
          className="absolute -top-1 h-4 w-0.5 rounded bg-ink"
          style={{ left: `${clamp(marker)}%` }}
          title={`Required: ${marker}`}
        />
      )}
    </div>
  );
}
