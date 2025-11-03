"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import AgreementContent from "./AgreementContent";

export default function AgreementModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-base font-normal leading-[160%] text-[#A6A6A6] hover:text-white transition-colors cursor-pointer">
          이용약관
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>이용약관</DialogTitle>
        </DialogHeader>
        <AgreementContent />
      </DialogContent>
    </Dialog>
  );
}
