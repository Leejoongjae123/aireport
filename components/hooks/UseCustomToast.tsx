"use client";

import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";
import { BsCheckCircleFill } from "react-icons/bs";
import { HiMiniXCircle } from "react-icons/hi2";

export const useCustomToast = () => {
  const showSuccess = (message: string) => {
    toast.custom(
      () => (
        <div className="flex items-center gap-3 bg-green-100 border border-green-300 rounded-lg px-4 py-3 shadow-lg">
          <BsCheckCircleFill className="w-4 h-4 text-green-600 flex-shrink-0" />
          <p className="text-sm font-bold text-green-600">{message}</p>
        </div>
      ),
      {
        duration: 3000,
      }
    );
  };

  const showError = (message: string) => {
    toast.custom(
      () => (
        <div className="flex items-center gap-3 bg-red-100 border border-red-300 rounded-lg px-4 py-3 shadow-lg">
          <HiMiniXCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-sm font-bold text-red-600">{message}</p>
        </div>
      ),
      {
        duration: 3000,
      }
    );
  };

  return {
    showSuccess,
    showError,
  };
};
