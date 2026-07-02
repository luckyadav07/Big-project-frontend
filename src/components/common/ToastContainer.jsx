import useUIStore from "../../store/uiStore.js";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: "border-success/50 bg-success/10 text-success",
  error: "border-danger/50 bg-danger/10 text-danger",
  warning: "border-warning/50 bg-warning/10 text-warning",
  info: "border-accent/50 bg-accent/10 text-accent"
};

function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  if (!toasts.length) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3"
    >
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || CheckCircle;

        const styles = {
          success: {
            background: "#1f2937",
            border: "1px solid #22c55e",
            icon: "#22c55e",
          },
          error: {
            background: "#1f2937",
            border: "1px solid #ef4444",
            icon: "#ef4444",
          },
          warning: {
            background: "#1f2937",
            border: "1px solid #f59e0b",
            icon: "#f59e0b",
          },
          info: {
            background: "#1f2937",
            border: "1px solid #3b82f6",
            icon: "#3b82f6",
          },
        };

        const style = styles[toast.type] || styles.success;

        return (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className="flex items-center gap-3 px-5 py-4 rounded-xl cursor-pointer shadow-2xl transition-all duration-300 hover:scale-105"
            style={{
              background: style.background,
              border: style.border,
              minWidth: "320px",
            }}
          >
            <Icon
              size={22}
              color={style.icon}
            />

            <div className="flex-1">
              <p
                style={{
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                {toast.message}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ToastContainer;
