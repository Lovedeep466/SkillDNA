const variants = {
  primary: "bg-primary-600 text-white shadow-sm hover:bg-primary-700",
  secondary: "border border-line bg-surface text-ink hover:bg-page",
  danger: "border border-danger-100 bg-surface text-danger-600 hover:bg-danger-50",
};

const sizes = {
  md: "px-4 py-2.5 text-sm",
  sm: "px-3 py-1.5 text-xs",
};

// Use as <Button>, or <Button as={Link} to="/somewhere"> to get a link that looks like a button.
export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  loading = false,
  loadingText,
  className = "",
  disabled,
  type,
  children,
  ...props
}) {
  const isButton = Component === "button";
  const buttonProps = isButton ? { type: type || "button", disabled: disabled || loading } : {};

  return (
    <Component
      {...buttonProps}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {loading && loadingText ? loadingText : children}
    </Component>
  );
}
