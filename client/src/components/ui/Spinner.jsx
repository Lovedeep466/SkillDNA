export default function Spinner({ label = "Loading..." }) {
  return (
    <div className="flex items-center gap-3 py-8 text-sm text-muted">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-primary-600" />
      {label}
    </div>
  );
}
