"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type ToastType = "success" | "error" | "info" | "warning" | "destructive";

export interface Toast {
  id: number;
  title: string;
  description?: string;
  variant?: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function toast(toast: Omit<Toast, "id">) {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => removeToast(id), 4000);
  }

  function removeToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
      <div className="fixed top-6 right-6 z-[9999] space-y-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-6 py-4 rounded-xl shadow-lg text-white font-semibold transition-all duration-300 animate-fade-in ${
              t.variant === "success"
                ? "bg-green-600"
                : t.variant === "error" || t.variant === "destructive"
                ? "bg-red-600"
                : t.variant === "warning"
                ? "bg-yellow-500"
                : "bg-blue-600"
            }`}
            onClick={() => removeToast(t.id)}
            style={{ cursor: "pointer" }}
          >
            <div className="text-lg font-bold">{t.title}</div>
            {t.description && <div className="text-sm mt-1">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
