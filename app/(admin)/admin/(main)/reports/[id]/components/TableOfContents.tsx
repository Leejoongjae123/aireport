"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";

// Custom Icons as SVG components
const CheckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[18px] h-[18px] flex-shrink-0"
  >
    <g clipPath="url(#clip0_920_1621)">
      <mask
        id="mask0_920_1621"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="18"
        height="18"
      >
        <path
          d="M9.00001 16.5C9.9851 16.5012 10.9607 16.3078 11.8708 15.9308C12.7809 15.5538 13.6076 15.0007 14.3033 14.3033C15.0007 13.6076 15.5538 12.7809 15.9308 11.8708C16.3078 10.9607 16.5012 9.9851 16.5 9.00001C16.5012 8.01491 16.3078 7.03929 15.9308 6.12919C15.5538 5.21909 15.0007 4.39245 14.3033 3.69676C13.6076 2.99932 12.7809 2.44621 11.8708 2.06922C10.9607 1.69223 9.9851 1.49879 9.00001 1.50001C8.01491 1.49879 7.03929 1.69223 6.12919 2.06922C5.21909 2.44621 4.39245 2.99932 3.69676 3.69676C2.99932 4.39245 2.44621 5.21909 2.06922 6.12919C1.69223 7.03929 1.49879 8.01491 1.50001 9.00001C1.49879 9.9851 1.69223 10.9607 2.06922 11.8708C2.44621 12.7809 2.99932 13.6076 3.69676 14.3033C4.39245 15.0007 5.21909 15.5538 6.12919 15.9308C7.03929 16.3078 8.01491 16.5012 9.00001 16.5Z"
          fill="white"
          stroke="white"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M6 9L8.25 11.25L12.75 6.75"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </mask>
      <g mask="url(#mask0_920_1621)">
        <path d="M0 0H18V18H0V0Z" fill="#0077FF" />
      </g>
    </g>
    <defs>
      <clipPath id="clip0_920_1621">
        <rect width="18" height="18" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const CaretRightIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.4137 10.6632L8.16374 16.9132C7.98761 17.0894 7.74874 17.1883 7.49967 17.1883C7.2506 17.1883 7.01173 17.0894 6.83561 16.9132C6.65949 16.7371 6.56055 16.4983 6.56055 16.2492C6.56055 16.0001 6.65949 15.7612 6.83561 15.5851L12.4223 9.99997L6.83717 4.41325C6.74997 4.32604 6.68079 4.22251 6.6336 4.10857C6.5864 3.99463 6.56211 3.87251 6.56211 3.74918C6.56211 3.62586 6.5864 3.50374 6.6336 3.3898C6.68079 3.27586 6.74997 3.17233 6.83717 3.08512C6.92438 2.99792 7.02791 2.92874 7.14185 2.88155C7.25579 2.83435 7.37791 2.81006 7.50124 2.81006C7.62456 2.81006 7.74668 2.83435 7.86062 2.88155C7.97456 2.92874 8.07809 2.99792 8.1653 3.08512L14.4153 9.33512C14.5026 9.42232 14.5718 9.5259 14.619 9.63991C14.6662 9.75392 14.6904 9.87612 14.6903 9.99951C14.6901 10.1229 14.6656 10.245 14.6182 10.3589C14.5707 10.4728 14.5012 10.5763 14.4137 10.6632Z"
      fill="#878A8F"
    />
  </svg>
);

interface TableOfContentsItem {
  id: string;
  title: string;
  completed: boolean;
  score: string;
  children?: TableOfContentsItem[];
}

interface GeneratedReportSection {
  query: string;
  content: string;
  section_id: string;
  section_name: string;
  subsection_id: string;
  subsection_name: string;
  is_completed?: boolean;
  character_count?: number;
}

interface ProcedureModifySection {
  id: string;
  name: string;
  enabled: boolean;
  subsections?: {
    id: string;
    name: string;
    enabled: boolean;
  }[];
}

interface ProcedureModifyData {
  sections: ProcedureModifySection[];
}

interface TableOfContentsProps {
  procedureModify: ProcedureModifyData | null;
  selectedItemId: string | null;
  onItemSelect: (id: string) => void;
  generatedReport: GeneratedReportSection[] | null;
}

export function TableOfContents({
  procedureModify,
  selectedItemId,
  onItemSelect,
  generatedReport,
}: TableOfContentsProps) {
  const tableOfContents: TableOfContentsItem[] = useMemo(() => {
    if (!procedureModify?.sections) {
      return [];
    }

    const removeNumbering = (text: string): string => {
      return text.replace(/^\d+(\.\d+)?\s*/, "").trim();
    };

    const getSectionDetails = (
      subsectionId: string,
      subsectionName: string
    ): { hasContent: boolean; charCount: number } => {
      if (!generatedReport) {
        return { hasContent: false, charCount: 0 };
      }

      const cleanedSubsectionName = removeNumbering(subsectionName);

      let matchingSection = generatedReport.find((section) => {
        return section.subsection_id === subsectionId;
      });

      if (!matchingSection) {
        matchingSection = generatedReport.find((section) => {
          const cleanedApiSubsectionName = removeNumbering(section.subsection_name || "");
          const cleanedApiQuery = removeNumbering(section.query || "");
          
          return (
            cleanedApiSubsectionName.includes(cleanedSubsectionName) ||
            cleanedSubsectionName.includes(cleanedApiSubsectionName) ||
            cleanedApiQuery.includes(cleanedSubsectionName) ||
            cleanedSubsectionName.includes(cleanedApiQuery)
          );
        });
      }

      const contentExists = !!(
        matchingSection &&
        matchingSection.is_completed &&
        matchingSection.content &&
        matchingSection.content.trim()
      );
      const charCount = matchingSection?.character_count || 0;

      return { hasContent: contentExists, charCount };
    };

    return procedureModify.sections
      .filter((section) => section.enabled)
      .map((section) => {
        const enabledSubsections =
          section.subsections?.filter((sub) => sub.enabled) || [];

        return {
          id: section.id,
          title: section.name,
          completed: true,
          score: "",
          children: enabledSubsections.map((subsection) => {
            const { hasContent, charCount } = getSectionDetails(
              subsection.id,
              subsection.name
            );
            return {
              id: subsection.id,
              title: subsection.name,
              completed: hasContent,
              score: `${charCount}자`,
            };
          }),
        };
      });
  }, [procedureModify, generatedReport]);

  const renderTableOfContentsItem = (
    item: TableOfContentsItem,
    level: number = 0
  ) => {
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="flex flex-col">
        {level === 0 ? (
          <div className="flex flex-col pt-5 border-b border-[#D9D9D9] pb-3">
            <div className="text-[#202224] font-semibold text-base opacity-80 mb-3">
              {item.title}
            </div>
            {hasChildren && (
              <div className="flex flex-col gap-2.5">
                {item.children!.map((child) => (
                  <div
                    key={child.id}
                    onClick={() => onItemSelect(child.id)}
                    className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                      selectedItemId === child.id
                        ? "bg-[#E8F3FF]"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex flex-col justify-center items-start gap-0.5 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#1E1E1E] font-semibold text-sm">
                          {child.title}
                        </span>
                        {/* {child.completed && <CheckIcon />} */}
                      </div>
                      <div className="text-[#757575] text-xs">
                        {child.score}
                      </div>
                    </div>
                    <CaretRightIcon />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <Card className="w-[248px] flex-shrink-0 border-[#EEF1F7] shadow-[0_0_10px_0_rgba(60,123,194,0.12)] h-full flex flex-col">
      <div className="p-6 flex-shrink-0">
        <div className="flex flex-col gap-1">
          <h2 className="text-[#303030] font-bold text-xl leading-8 tracking-[-0.4px]">
            목차
          </h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
        <div className="flex flex-col">
          {tableOfContents.map((item) => renderTableOfContentsItem(item))}
        </div>
      </div>
    </Card>
  );
}
