"use client";

import { Toast } from "./hooks/UseToast";
import { CheckCircle2, XCircle, X } from "lucide-react";

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  return (
    <div className="fixed top-10 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
            min-w-[300px] max-w-[500px]
            animate-in slide-in-from-top-5 duration-300
            ${
              toast.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }
          `}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => onRemove(toast.id)}
            className={`
              p-1 rounded-md transition-colors flex-shrink-0
              ${
                toast.type === "success"
                  ? "hover:bg-green-100"
                  : "hover:bg-red-100"
              }
            `}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
