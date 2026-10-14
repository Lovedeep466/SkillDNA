import Card from "./Card";

const tones = {
  ink: "text-ink",
  primary: "text-primary-600",
  success: "text-success-600",
  warning: "text-warning-600",
  danger: "text-danger-600",
};

export default function StatCard({ label, value, tone = "ink", hint }) {
  return (
    <Card padding="p-5">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${tones[tone]}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-subtle">{hint}</p>}
    </Card>
  );
}
