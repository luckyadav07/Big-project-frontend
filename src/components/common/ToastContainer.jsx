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
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || CheckCircle;
        return (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`flex items-center gap-2 rounded-lg border px-4 py-3 shadow-lg cursor-pointer animate-in slide-in-from-right ${colors[toast.type] || colors.success}`}
          >
            <Icon size={18} />
            <span className="text-sm font-medium text-white">{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}

export default ToastContainer;
