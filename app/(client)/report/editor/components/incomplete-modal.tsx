import { CustomModal } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";

interface IncompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IncompleteModal({ isOpen, onClose }: IncompleteModalProps) {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="진단 불가"
      width="400px"
      padding="32px"
      
    >
      <div className="flex flex-col gap-4 w-full">
        <p className="text-[#1E1E1E] text-base leading-relaxed">
          보고서가 모두 생성되어야 진단이 가능합니다.
        </p>
        <Button
          onClick={onClose}
          className="w-full h-12 rounded-[10px] bg-[#0077FF] text-white hover:bg-[#0066DD]"
        >
          확인
        </Button>
      </div>
    </CustomModal>
  );
}
