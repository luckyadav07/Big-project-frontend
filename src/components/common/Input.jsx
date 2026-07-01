function Input({
  label,
  type = "text",
  placeholder,
  error,
  className = "",
  id,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, "-");

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--text-primary)" }}
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        {...props}
        className={`w-full rounded-lg px-4 py-2.5 transition focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 ${
          error
            ? "border-danger focus:ring-danger"
            : "focus:border-accent"
        }`}
        style={{
          background: "var(--glass-bg)",
          color: "var(--text-primary)",
          border: error
            ? "1px solid var(--color-danger)"
            : "1px solid var(--glass-border)",
        }}
      />

      {error && (
        <p className="mt-1 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;