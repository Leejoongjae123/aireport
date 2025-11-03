"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import PrivacyConsentsContent from "./PrivacyConsentsContent";

export default function PrivacyPolicyModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-base font-normal leading-[160%] text-[#A6A6A6] hover:text-white transition-colors cursor-pointer">
          개인정보처리방침
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>개인정보처리방침</DialogTitle>
        </DialogHeader>
        <PrivacyConsentsContent />
      </DialogContent>
    </Dialog>
  );
}
