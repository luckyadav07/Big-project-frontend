import { create } from "zustand";

const useUIStore = create((set, get) => ({
  toasts: [],

 showToast: ({
  message,
  type = "success",
  duration = 3000,
}) => {
  console.log("SHOW TOAST:", message, type);

  if (!message) return;

  const exists = get().toasts.some(
    (toast) => toast.message === message && toast.type === type
  );

  if (exists) {
    console.log("Duplicate toast prevented");
    return;
  }

  const id = Date.now();

  set((state) => ({
    toasts: [
      ...state.toasts,
      {
        id,
        message,
        type,
      },
    ],
  }));

  console.log("Current toasts:", get().toasts);

  setTimeout(() => {
    get().removeToast(id);
  }, duration);
},

  success: (message, duration = 3000) =>
    get().showToast({
      message,
      type: "success",
      duration,
    }),

  error: (message, duration = 4000) =>
    get().showToast({
      message,
      type: "error",
      duration,
    }),

  warning: (message, duration = 3500) =>
    get().showToast({
      message,
      type: "warning",
      duration,
    }),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),

  clearToasts: () =>
    set({
      toasts: [],
    }),
}));

export default useUIStore;