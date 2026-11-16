import { create } from "zustand";

export type ToastVariant = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastState {
  toasts: ToastMessage[];
  addToast: (title: string, variant?: ToastVariant, description?: string) => void;
  removeToast: (id: string) => void;
}

const activeTimers = new Map<string, ReturnType<typeof setTimeout>>();

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (title, variant = "success", description) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    set((state) => ({
      toasts: [...state.toasts.slice(-3), { id, title, variant, description }],
    }));

    const handle = setTimeout(() => {
      activeTimers.delete(id);
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3800);
    activeTimers.set(id, handle);
  },
  removeToast: (id) => {
    const handle = activeTimers.get(id);
    if (handle) {
      clearTimeout(handle);
      activeTimers.delete(id);
    }
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));
