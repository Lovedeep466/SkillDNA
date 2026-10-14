const tones = {
  error: "border-danger-100 bg-danger-50 text-danger-600",
  success: "border-success-100 bg-success-50 text-success-600",
  info: "border-primary-100 bg-primary-50 text-primary-700",
};

export default function Alert({ tone = "info", className = "", children }) {
  if (!children) return null;
  return (
    <div role="alert" className={`rounded-xl border px-4 py-3 text-sm ${tones[tone]} ${className}`}>
      {children}
    </div>
  );
}
