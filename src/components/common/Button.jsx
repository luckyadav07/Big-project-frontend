const variants = {
  primary: "accent-gradient text-white hover:opacity-90 shadow-md",
  secondary: "border transition",
  outline:
    "border border-accent text-accent hover:bg-accent/10 bg-transparent",
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
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${className}
        ${
          disabled
            ? "opacity-60 cursor-not-allowed"
            : ""
        }
      `}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

export default Button;