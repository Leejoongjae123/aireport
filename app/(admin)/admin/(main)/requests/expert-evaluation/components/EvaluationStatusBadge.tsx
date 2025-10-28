import { Badge } from "@/components/ui/Badge";
import { StatusBadgeType } from "../types";

interface EvaluationStatusBadgeProps {
  status: StatusBadgeType;
}

export default function EvaluationStatusBadge({ status }: EvaluationStatusBadgeProps) {
  if (status === "완료") {
    return (
      <Badge className="px-2.5 py-1.5 text-xs font-normal rounded-full bg-[rgba(207,247,211,1)] text-[rgba(2,84,45,1)] border-none">
        완료
      </Badge>
    );
  }
  if (status === "대기") {
    return (
      <Badge className="px-2.5 py-1.5 text-xs font-normal rounded-full bg-[rgba(255,241,194,1)] text-[rgba(151,81,2,1)] border-none">
        대기
      </Badge>
    );
  }
  return (
    <Badge className="px-2.5 py-1.5 text-xs font-normal rounded-full bg-[rgba(253,211,208,1)] text-[rgba(144,11,9,1)] border-none">
      지연
    </Badge>
  );
}
