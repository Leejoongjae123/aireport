"use client";

import { CustomModal } from "@/components/ui/CustomModal";
import { Button } from "@/components/ui/Button";

interface RegenerateConfirmModalProps {
  isOpen: boolean;
  originalContent: string;
  newContent: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function RegenerateConfirmModal({
  isOpen,
  originalContent,
  newContent,
  onCancel,
  onConfirm,
}: RegenerateConfirmModalProps) {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onCancel}
      width="900px"
      height="auto"
      padding="24px"
      headerClassName="justify-between items-center"
      closeButtonClassName="ml-auto"
      contentClassName="flex flex-col gap-4"
    >
      <div className="flex gap-3 w-full pb-6">
        <div className="flex justify-start items-center">
          <h3 className="text-2xl font-semibold text-[#222222]">
            AI 재작성 결과 확인
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2 max-h-[400px] overflow-y-auto">
        <div className="flex flex-col">
          <div className="text-xs font-semibold text-[#555555] mb-2">
            기존 내용
          </div>
          <div className="border border-[#E5E7EB] rounded-md bg-[#FAFAFA] p-3 text-sm [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            <div
              className="prose prose-sm max-w-none text-[#333333]"
              dangerouslySetInnerHTML={{
                __html: originalContent || "<p>(내용 없음)</p>",
              }}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="text-xs font-semibold text-[#555555] mb-2">
            새로 생성된 내용
          </div>
          <div className="border border-[#E5E7EB] rounded-md bg-white p-3 text-sm [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            <div
              className="prose prose-sm max-w-none text-[#333333]"
              dangerouslySetInnerHTML={{
                __html: newContent || "<p>(내용 없음)</p>",
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button
          variant="outline"
          className="w-20 h-10 text-sm"
          onClick={onCancel}
        >
          취소
        </Button>
        <Button className="w-20 h-10 text-sm" onClick={onConfirm}>
          적용
        </Button>
      </div>
    </CustomModal>
  );
}
