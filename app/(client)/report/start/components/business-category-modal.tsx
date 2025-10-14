"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface BusinessCategoryModalProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  reportTitle?: string;
  mode?: "create" | "update";
  reportId?: string;
  onBusinessFieldChange?: (businessField: string) => void;
}

const GlobalIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.3574 12C20.3574 14.2164 19.4769 16.3421 17.9096 17.9094C16.3423 19.4766 14.2167 20.3571 12.0002 20.3571C9.78376 20.3571 7.65809 19.4766 6.09082 17.9094C4.52355 16.3421 3.64307 14.2164 3.64307 12M20.3574 12C20.3574 9.78351 19.4769 7.65784 17.9096 6.09057C16.3423 4.5233 14.2167 3.64282 12.0002 3.64282C9.78376 3.64282 7.65809 4.5233 6.09082 6.09057C4.52355 7.65784 3.64307 9.78351 3.64307 12M20.3574 12H3.64307"
      stroke="#439BFF"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.2147 12C15.0568 15.0561 13.9311 17.9828 12.0004 20.3571C10.0697 17.9828 8.94402 15.0561 8.78613 12C8.94402 8.94383 10.0697 6.01709 12.0004 3.64282C13.9311 6.01709 15.0568 8.94383 15.2147 12Z"
      stroke="#439BFF"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ToolsIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13 11L18 6" stroke="#439BFF" strokeWidth="1.5" />
    <path
      d="M18.9998 6.99996L16.9998 4.99996L19.4998 3.49996L20.4998 4.49996L18.9998 6.99996ZM4.02476 8.97496C3.54465 8.49528 3.21436 7.88636 3.0741 7.22233C2.93384 6.55831 2.98966 5.86783 3.23476 5.23496L4.65676 6.65696H6.65676V4.65696L5.23476 3.23496C5.86767 2.9893 6.55837 2.93302 7.22271 3.07298C7.88704 3.21293 8.49633 3.54308 8.97635 4.0232C9.45636 4.50332 9.78637 5.11269 9.92618 5.77705C10.066 6.44142 10.0096 7.1321 9.76376 7.76496L16.2338 14.236C16.8666 13.9902 17.5573 13.9337 18.2217 14.0735C18.886 14.2133 19.4954 14.5434 19.9755 15.0234C20.4556 15.5034 20.7858 16.1127 20.9257 16.777C21.0657 17.4413 21.0094 18.132 20.7638 18.765L19.3428 17.343H17.3428V19.343L18.7648 20.765C18.132 21.0106 17.4415 21.067 16.7773 20.9272C16.113 20.7874 15.5038 20.4575 15.0237 19.9776C14.5437 19.4978 14.2135 18.8887 14.0734 18.2245C13.9333 17.5604 13.9894 16.8698 14.2348 16.237L7.76276 9.76496C7.13015 10.0096 6.44008 10.0652 5.77646 9.92499C5.11284 9.78474 4.50427 9.45468 4.02476 8.97496Z"
      stroke="#439BFF"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M12.2028 14.4999L6.59882 20.1039C6.47343 20.2295 6.3245 20.3292 6.16054 20.3972C5.99658 20.4652 5.82082 20.5002 5.64332 20.5002C5.46582 20.5002 5.29007 20.4652 5.12611 20.3972C4.96215 20.3292 4.81322 20.2295 4.68782 20.1039L3.89582 19.3119C3.77019 19.1865 3.67052 19.0375 3.60252 18.8736C3.53452 18.7096 3.49951 18.5339 3.49951 18.3564C3.49951 18.1789 3.53452 18.0031 3.60252 17.8392C3.67052 17.6752 3.77019 17.5263 3.89582 17.4009L9.49982 11.7969"
      stroke="#439BFF"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const TheaterMaskIcon = () => (
  <svg
    width="24"
    height="26"
    viewBox="0 0 24 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.44502 15.275C5.52104 15.124 5.63056 14.9923 5.76522 14.8901C5.89988 14.7878 6.05612 14.7177 6.22202 14.685C6.56102 14.624 6.89402 14.738 7.15002 14.967M11.236 18.277C10.909 18.887 10.358 19.334 9.68102 19.457C9.00402 19.579 8.33702 19.352 7.82602 18.892M10.559 14.352C10.723 14.047 10.998 13.823 11.336 13.762C11.676 13.702 12.008 13.815 12.264 14.045M13.07 8.14203C11.92 9.22803 10.171 10.092 8.13002 10.46C6.09002 10.828 4.16002 10.628 2.71502 10.01C2.62429 9.96996 2.52369 9.95777 2.42602 9.97503C2.14202 10.025 1.95602 10.323 2.00902 10.638L2.94702 16.081C3.64702 20.139 7.04702 22.088 8.62402 22.785C9.14602 23.017 9.72202 23.046 10.282 22.945C10.842 22.844 11.374 22.615 11.788 22.215C13.037 21.007 15.58 17.986 14.88 13.928L13.943 8.48503C13.888 8.17003 13.613 7.95603 13.329 8.00803C13.2309 8.02578 13.1414 8.07245 13.07 8.14203Z"
      stroke="#439BFF"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.316 18C14.679 18 15.039 17.935 15.376 17.785C16.953 17.088 20.353 15.139 21.053 11.081L21.991 5.63803C22.045 5.32303 21.858 5.02603 21.574 4.97503C21.4763 4.95777 21.3757 4.96996 21.285 5.01003C19.841 5.62803 17.91 5.82803 15.869 5.46003C13.829 5.09203 12.081 4.22803 10.93 3.14203C10.8589 3.07262 10.7687 3.02597 10.671 3.00803C10.387 2.95603 10.111 3.17003 10.057 3.48503L9.12 8.92803C9.037 9.40503 9 9.86803 9 10.314"
      stroke="#439BFF"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const CityIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 21H22"
      stroke="#439BFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 13H5C4.44772 13 4 13.4477 4 14V20C4 20.5523 4.44772 21 5 21H7C7.55228 21 8 20.5523 8 20V14C8 13.4477 7.55228 13 7 13Z"
      stroke="#439BFF"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M6 17H6.5"
      stroke="#439BFF"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
    <path
      d="M19 2H9C8.44772 2 8 2.44772 8 3V20C8 20.5523 8.44772 21 9 21H19C19.5523 21 20 20.5523 20 20V3C20 2.44772 19.5523 2 19 2Z"
      stroke="#439BFF"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M11 5H13V7H11V5ZM15 5H17V7H15V5ZM11 8.5H13V10.5H11V8.5ZM15 8.5H17V10.5H15V8.5ZM15 12H17V14H15V12ZM15 15.5H17V17.5H15V15.5Z"
      fill="#439BFF"
    />
  </svg>
);

const PlantIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M23.2155 4.48974C23.2047 4.30626 23.127 4.1331 22.9971 4.00314C22.8671 3.87318 22.6939 3.79546 22.5105 3.78474C17.658 3.50349 13.7617 4.97912 12.0873 7.74287C10.9811 9.57006 10.983 11.7891 12.0723 13.906C11.4522 14.6441 10.999 15.5076 10.7439 16.4372L9.21859 14.9063C9.95171 13.3754 9.92359 11.7797 9.12484 10.4541C7.88734 8.41131 5.03078 7.31631 1.48421 7.52443C1.30073 7.53515 1.12757 7.61286 0.997607 7.74283C0.867644 7.87279 0.789928 8.04595 0.779212 8.22943C0.57015 11.776 1.66609 14.6326 3.7089 15.8701C4.38298 16.282 5.15765 16.5 5.94765 16.5001C6.71442 16.4906 7.46926 16.3089 8.1564 15.9685L10.5002 18.3122V21.0001C10.5002 21.199 10.5792 21.3897 10.7198 21.5304C10.8605 21.671 11.0512 21.7501 11.2502 21.7501C11.4491 21.7501 11.6398 21.671 11.7805 21.5304C11.9211 21.3897 12.0002 21.199 12.0002 21.0001V18.2354C11.9967 17.0422 12.4028 15.884 13.1505 14.9541C14.1151 15.4583 15.1849 15.7281 16.2733 15.7416C17.3255 15.745 18.3582 15.4576 19.2573 14.911C22.0211 13.2385 23.5005 9.34224 23.2155 4.48974ZM4.48234 14.5876C3.04421 13.7166 2.23046 11.6551 2.25015 9.00006C4.90515 8.97756 6.96671 9.79412 7.83765 11.2322C8.29234 11.9822 8.3664 12.8569 8.06828 13.7579L5.77984 11.4694C5.63804 11.3347 5.44923 11.2607 5.25366 11.2632C5.05809 11.2657 4.87123 11.3445 4.73293 11.4828C4.59463 11.6211 4.51582 11.808 4.51332 12.0036C4.51082 12.1991 4.58481 12.3879 4.71953 12.5297L7.00796 14.8182C6.10703 15.1163 5.23328 15.0422 4.48234 14.5876ZM18.4802 13.6294C17.2239 14.3897 15.7473 14.4479 14.2473 13.8169L19.2808 8.78256C19.4155 8.64076 19.4895 8.45195 19.487 8.25638C19.4845 8.06081 19.4057 7.87395 19.2674 7.73565C19.1291 7.59735 18.9422 7.51854 18.7466 7.51604C18.5511 7.51354 18.3623 7.58753 18.2205 7.72224L13.1861 12.7501C12.5523 11.2501 12.6095 9.77256 13.3736 8.51724C14.6805 6.36099 17.7798 5.15912 21.7483 5.25193C21.8383 9.21943 20.6383 12.3226 18.4802 13.6294Z"
      fill="#439BFF"
    />
  </svg>
);

const businessCategories = [
  {
    id: "digital-ict-ai",
    title: "디지털·ICT·AI 산업",
    description: "디지털 기술과 AI 혁신을 기반으로 한 사업 전략을 설계합니다.",
    icon: GlobalIcon,
  },
  {
    id: "manufacturing-tech",
    title: "제조·산업기술·혁신",
    description: "신기술과 제조 혁신을 통해 산업 경쟁력을 강화합니다.",
    icon: ToolsIcon,
  },
  {
    id: "culture-content-tourism",
    title: "문화·콘텐츠·관광",
    description: "창의적 콘텐츠와 관광 자원을 활용한 성장 전략을 기록합니다.",
    icon: TheaterMaskIcon,
  },
  {
    id: "public-urban-infrastructure",
    title: "공공·도시·인프라",
    description:
      "도시 발전과 사회 인프라 개선을 위한 분석과 대안을 제시합니다.",
    icon: CityIcon,
  },
  {
    id: "energy-environment",
    title: "에너지·환경",
    description:
      "친환경 에너지와 지속가능한 환경 솔루션을 체계적으로 정리합니다.",
    icon: PlantIcon,
  },
];

export function BusinessCategoryModal({
  children,
  open,
  onOpenChange,
  reportTitle,
  mode = "create",
  reportId,
  onBusinessFieldChange,
}: BusinessCategoryModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCategoryClick = async (categoryTitle: string) => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "create") {
        // 새 리포트 생성 모드
        if (!reportTitle) {
          alert("보고서 제목을 입력해주세요.");
          setIsLoading(false);
          return;
        }

        const response = await fetch("/api/reports/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: reportTitle,
            businessField: categoryTitle,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          alert(result.error || "보고서 생성에 실패했습니다.");
          return;
        }

        onOpenChange?.(false);
        router.push(`/report/inputs?reportId=${result.reportId}`);
      } else {
        // 기존 리포트 업데이트 모드
        const response = await fetch("/api/reports/update-business-field", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reportId: reportId,
            businessField: categoryTitle,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          alert(result.error || "사업분야 업데이트에 실패했습니다.");
          return;
        }

        // 콜백으로 선택된 business field 전달
        onBusinessFieldChange?.(categoryTitle);
        onOpenChange?.(false);
      }
    } catch (error) {
      alert(
        mode === "create"
          ? "보고서 생성 중 오류가 발생했습니다."
          : "사업분야 업데이트 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="max-w-[689px] w-[689px] p-10 bg-white rounded-xl shadow-[0_0_10px_rgba(0,119,255,0.20)]"
        showCloseButton={false}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-11">
          <DialogTitle className="text-2xl font-bold text-black font-['Pretendard']">
            사업분야 선택
          </DialogTitle>
          <button
            onClick={() => onOpenChange?.(false)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
          >
            <X className="w-8 h-8 text-[#767676] stroke-[1.6]" />
          </button>
        </div>

        {/* Business Categories Grid */}
        <div className="grid grid-cols-2 gap-x-[17px] gap-y-4 w-[609px] h-[536px]">
          {businessCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className={`w-[296px] h-[168px] p-5 flex flex-col gap-2 bg-[#F9FAFC] rounded-[10px] cursor-pointer hover:bg-[#F0F6FF] transition-colors ${
                  isLoading ? "opacity-50 pointer-events-none" : ""
                }`}
                onClick={() => handleCategoryClick(category.title)}
              >
                {/* Icon */}
                <div className="w-[38px] h-[38px] p-[7px] flex items-center justify-center bg-[#DBE7FF] rounded-full mb-2">
                  <IconComponent />
                </div>

                {/* Text Content */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold text-[#303030] leading-8 tracking-[-0.4px] font-['Pretendard']">
                    {category.title}
                  </h3>
                  <p className="text-sm font-medium text-[#5A5A5A] leading-[18px] font-['Pretendard']">
                    {category.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Empty cell for the 2x3 grid (5 items in 2x3 layout) */}
          <div></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
