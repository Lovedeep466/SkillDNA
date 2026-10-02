function Button({ children, loading, ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className="w-full rounded-xl py-3 font-medium text-white transition disabled:opacity-60"
      style={{ backgroundColor: "var(--color-primary)" }}
      onMouseEnter={(e) => (e.target.style.backgroundColor = "var(--color-primary-hover)")}
      onMouseLeave={(e) => (e.target.style.backgroundColor = "var(--color-primary)")}
    >
      {children}
    </button>
  );
}

export default Button;