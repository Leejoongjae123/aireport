"use client";

import React, { useState } from "react";
import { CustomModal } from "@/components/ui/CustomModal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

interface LinkInsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string, text?: string) => void;
  defaultText?: string;
}

export function LinkInsertModal({
  isOpen,
  onClose,
  onInsert,
  defaultText = "",
}: LinkInsertModalProps) {
  const [url, setUrl] = useState("");
  const [text, setText] = useState(defaultText);

  const handleInsert = () => {
    if (!url.trim()) {
      return;
    }
    onInsert(url.trim(), text.trim() || undefined);
    handleClose();
  };

  const handleClose = () => {
    setUrl("");
    setText(defaultText);
    onClose();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      title="링크 삽입"
      width="500px"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="outline" onClick={handleClose} className="px-6 py-2">
            취소
          </Button>
          <Button
            onClick={handleInsert}
            disabled={!url.trim()}
            className="px-6 py-2 bg-[#0077FF] hover:bg-[#0066DD] text-white"
          >
            삽입
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-2">
          <Label htmlFor="link-url" className="text-sm font-semibold">
            URL *
          </Label>
          <Input
            id="link-url"
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full"
            autoFocus
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="link-text" className="text-sm font-semibold">
            표시 텍스트 (선택사항)
          </Label>
          <Input
            id="link-text"
            type="text"
            placeholder="링크 텍스트"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
    </CustomModal>
  );
}
