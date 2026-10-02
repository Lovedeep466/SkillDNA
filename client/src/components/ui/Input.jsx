function Input(props) {
  return (
    <input
      {...props}
      className="rounded-xl px-4 py-3 border outline-none transition focus:ring-2"
      style={{
        backgroundColor: "var(--color-bg)",
        borderColor: "var(--color-border)",
        color: "var(--color-text)",
      }}
    />
  );
}

export default Input;