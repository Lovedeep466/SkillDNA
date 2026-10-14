export default function Card({ children, className = "", padding = "p-6" }) {
  return (
    <div className={`rounded-2xl border border-line bg-surface shadow-sm ${padding} ${className}`}>
      {children}
    </div>
  );
}
