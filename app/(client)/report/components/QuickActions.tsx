"use client";

import { Button } from "@/components/ui/button";
import { useReportStore } from "./store/report-store";

const QUICK_ACTIONS = [
  { label: "자세히 쓰기", value: "자세히" },
  { label: "간결하게 쓰기", value: "간결하게" },
  { label: "윤문하기", value: "윤문" },
  { label: "논문검색", value: "논문" },
  { label: "뉴스검색", value: "뉴스" },
  { label: "특허검색", value: "특허" },
];

interface QuickActionsProps {
  handleQuickAction: (options: { action: string; subject?: string }) => void;
  isLoading: boolean;
}

export function QuickActions({
  handleQuickAction,
  isLoading,
}: QuickActionsProps) {
  const { title } = useReportStore();

  const handleClick = (actionValue: string) => {
    const options: { action: string; subject?: string } = { action: actionValue };
    if (["논문", "뉴스", "특허"].includes(actionValue)) {
      options.subject = title || undefined;
    }
    handleQuickAction(options);
  };

  return (
    <div className="flex items-center gap-2 p-4 flex-wrap">
      {QUICK_ACTIONS.map((action) => (
        <Button
          key={action.value}
          variant="outline"
          size="sm"
          onClick={() => handleClick(action.value)}
          disabled={isLoading}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
