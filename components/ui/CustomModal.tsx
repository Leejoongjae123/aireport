"use client";

import React, { ReactNode } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  VisuallyHidden,
} from "@/components/ui/Dialog";
import { cn } from "@/lib/utils";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
  width?: string;
  height?: string;
  padding?: string;
  showCloseButton?: boolean;
  headerClassName?: string;
  titleClassName?: string;
  closeButtonClassName?: string;
}

export const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
  contentClassName,
  width = "500px",
  height,
  padding = "40px",
  showCloseButton = true,
  headerClassName,
  titleClassName,
  closeButtonClassName,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
        <DialogContent
          className={cn(
            "fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50",
            "inline-flex flex-col items-start rounded-[12px] bg-white ",
            "border-none",
            className
          )}
          style={{
            padding,
            width,
            height,
          }}
          showCloseButton={false}
        >
          {/* DialogTitle for accessibility */}
          {title ? (
            <DialogTitle className="sr-only">{title}</DialogTitle>
          ) : (
            <VisuallyHidden>
              <DialogTitle>Dialog</DialogTitle>
            </VisuallyHidden>
          )}

          <div
            className={cn(
              "flex flex-col items-start gap-6 relative w-full",
              contentClassName
            )}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div
                className={cn(
                  "flex justify-between items-center self-stretch relative",
                  headerClassName
                )}
              >
                {title && (
                  <h2
                    className={cn(
                      "text-black font-pretendard text-[24px] font-bold leading-normal",
                      titleClassName
                    )}
                  >
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center",
                      closeButtonClassName
                    )}
                  >
                    <X className="w-8 h-8 text-[#767676]" strokeWidth={1.6} />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex flex-col items-center self-stretch relative flex-1">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex flex-col items-start self-stretch relative">
                {footer}
              </div>
            )}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
