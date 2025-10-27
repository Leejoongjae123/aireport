"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { CustomModal } from "@/components/ui/CustomModal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Upload } from "lucide-react";

interface ImageInsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (src: string, alt?: string) => void;
}

type InsertMode = "url" | "file";

export function ImageInsertModal({
  isOpen,
  onClose,
  onInsert,
}: ImageInsertModalProps) {
  const [mode, setMode] = useState<InsertMode>("url");
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [filePreview, setFilePreview] = useState<string>("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드 가능합니다.");
        return;
      }

      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsert = () => {
    if (mode === "url") {
      if (!url.trim()) {
        return;
      }
      onInsert(url.trim(), alt.trim() || undefined);
    } else {
      if (!filePreview) {
        return;
      }
      onInsert(filePreview, alt.trim() || fileName);
    }
    handleClose();
  };

  const handleClose = () => {
    setMode("url");
    setUrl("");
    setAlt("");
    setFilePreview("");
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const isValid = mode === "url" ? url.trim() : filePreview;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      title="이미지 삽입"
      width="550px"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="outline" onClick={handleClose} className="px-6 py-2">
            취소
          </Button>
          <Button
            onClick={handleInsert}
            disabled={!isValid}
            className="px-6 py-2 bg-[#0077FF] hover:bg-[#0066DD] text-white"
          >
            삽입
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 w-full">
        {/* 탭 선택 */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setMode("url")}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${
              mode === "url"
                ? "text-[#0077FF] border-b-2 border-[#0077FF]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            URL로 삽입
          </button>
          <button
            onClick={() => setMode("file")}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${
              mode === "file"
                ? "text-[#0077FF] border-b-2 border-[#0077FF]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            파일 업로드
          </button>
        </div>

        {/* URL 입력 모드 */}
        {mode === "url" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="image-url" className="text-sm font-semibold">
                이미지 URL *
              </Label>
              <Input
                id="image-url"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full"
                autoFocus
              />
            </div>
            {url && (
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold">미리보기</Label>
                <div className="border border-gray-200 rounded-md p-4 flex justify-center items-center bg-gray-50 relative h-48">
                  <Image
                    src={url}
                    alt="Preview"
                    fill
                    className="object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 파일 업로드 모드 */}
        {mode === "file" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold">이미지 파일 *</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-[#0077FF] hover:bg-blue-50 transition-colors"
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {fileName || "클릭하여 이미지 선택"}
                  </span>
                </div>
              </Button>
            </div>
            {filePreview && (
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold">미리보기</Label>
                <div className="border border-gray-200 rounded-md p-4 flex justify-center items-center bg-gray-50 relative h-48">
                  <Image
                    src={filePreview}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 대체 텍스트 (공통) */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="image-alt" className="text-sm font-semibold">
            대체 텍스트 (선택사항)
          </Label>
          <Input
            id="image-alt"
            type="text"
            placeholder="이미지 설명"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
    </CustomModal>
  );
}
