const variants = {
  primary: "accent-gradient text-white hover:opacity-90 shadow-md",
  secondary:  "border transition",
  outline: "border border-accent text-accent hover:bg-accent/10 bg-transparent",
  ghost: "transition",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-lg",
  lg: "px-6 py-3 text-base rounded-xl",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
        style={
          variant === "secondary"
            ? {
                background: "var(--glass-bg)",
                color: "var(--text-primary)",
                border: "1px solid var(--glass-border)",
              }
            : variant === "ghost"
            ? {
                color: "var(--text-secondary)",
              }
            : {}
        }
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}
      {children}
    </button>
  );
}

export default Button;
