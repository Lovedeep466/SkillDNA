function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl shadow-sm border p-8 ${className}`}
      style={{
        backgroundColor: "var(--color-card)",
        borderColor: "var(--color-border)",
      }}
    >
      {children}
    </div>
  );
}

export default Card;