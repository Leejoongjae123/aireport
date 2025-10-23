"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useReportStore } from "../components/store/ReportStore";
import { useProcedureStore } from "./components/store/ProcedureStore";
import { BusinessCategoryModal } from "../start/components/BusinessCategoryModal";
import { ReportGenerationModal } from "../components/ReportGenerationModal";
import { SectionList } from "./components/SectionList";
import { TableOfContentsList } from "./components/TableOfContentsList";
import { ItemSettings } from "./components/ItemSettings";
import { useLoader } from "@/components/hooks/UseLoader";
import {
  SectionItem,
  TableOfContentItem,
  ProcedureData,
  FlatSubsectionItem,
  ProcedureModifyData,
  ProcedureModifySection,
  ProcedureModifySubsection,
} from "./types";
function ReportProcedureContent() {
  const searchParams = useSearchParams();
  const {
    reportId,
    setReportType,
    setReportId,
    businessField,
    setBusinessField,
    isGenerationModalOpen,
    setGenerationModalOpen,
  } = useReportStore();

  const {
    procedureData,
    setProcedureData,
    updateSection,
    updateSubsection,
    reorderSubsections,
  } = useProcedureStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [flatSubsections, setFlatSubsections] = useState<FlatSubsectionItem[]>(
    []
  );
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  );
  const [selectedSubsectionId, setSelectedSubsectionId] = useState<
    string | null
  >(null);
  const [selectedItemName, setSelectedItemName] = useState<string>("");
  const [minCharCount, setMinCharCount] = useState("1000");
  const [maxCharCount, setMaxCharCount] = useState("2000");

  const loader = useLoader({ isLoading });

  // URL에서 reportType과 reportId 가져와서 store에 저장
  useEffect(() => {
    const reportType = searchParams.get("reportType");
    const reportId = searchParams.get("reportId");
    if (reportType) {
      setReportType(reportType);
    }
    if (reportId) {
      setReportId(reportId);
    }
    // procedure 페이지 진입 시 모달 상태 초기화
    setGenerationModalOpen(false);
  }, [searchParams, setReportType, setReportId, setGenerationModalOpen]);

  // TableOfContents를 FlatSubsections로 변환
  const convertToFlatSubsections = (
    toc: TableOfContentItem[]
  ): FlatSubsectionItem[] => {
    const flat: FlatSubsectionItem[] = [];
    toc.forEach((mainItem) => {
      mainItem.소목차.forEach((subItem) => {
        flat.push({
          id: `${mainItem.id}-${subItem.id}`,
          mainId: mainItem.id,
          subId: subItem.id,
          name: subItem.소목차명,
          enabled: subItem.enabled ?? true,
        });
      });
    });
    return flat;
  };

  // ProcedureData를 ProcedureModifyData로 변환
  const convertToProcedureModifyData = (
    toc: TableOfContentItem[],
    sectionsData: SectionItem[],
    flatSubs: FlatSubsectionItem[]
  ): ProcedureModifyData => {
    const sections: ProcedureModifySection[] = toc.map((mainItem) => {
      const sectionData = sectionsData.find(
        (s) => s.id === mainItem.id.toString()
      );
      const subsectionsForSection = flatSubs.filter(
        (sub) => sub.mainId === mainItem.id
      );

      const subsections: ProcedureModifySubsection[] =
        subsectionsForSection.map((sub, index) => ({
          id: sub.id,
          name: sub.name,
          enabled: sub.enabled,
          order: index,
          minChar: 1000,
          maxChar: 2000,
        }));

      return {
        id: mainItem.id.toString(),
        name: mainItem.대목차,
        enabled: sectionData?.enabled ?? true,
        subsections,
      };
    });

    return { sections };
  };

  // reportId가 있으면 DB에서 procedure 정보 가져오기
  useEffect(() => {
    const fetchProcedureData = async () => {
      if (!reportId) {
        return;
      }

      setIsLoading(true);
      try {
        // 1. procedure 기본 구조 가져오기
        const response = await fetch(`/api/reports/${reportId}/procedure`);
        const result = await response.json();

        if (response.ok && result.data) {
          const procedureDataFromDb: ProcedureData = result.data;
          setBusinessField(getBusinessFieldId(procedureDataFromDb.field_name));

          // 대목차 기반으로 sections 생성
          const newSections: SectionItem[] =
            procedureDataFromDb.table_of_contents.map((item) => ({
              id: item.id.toString(),
              name: item.대목차,
              enabled: true,
            }));
          setSections(newSections);

          // FlatSubsections 생성
          const flat = convertToFlatSubsections(
            procedureDataFromDb.table_of_contents
          );
          setFlatSubsections(flat);

          // 2. 저장된 procedure_modify 데이터가 있는지 확인
          const modifyResponse = await fetch(
            `/api/reports/${reportId}/procedure-modify`
          );
          const modifyResult = await modifyResponse.json();

          if (modifyResponse.ok && modifyResult.data) {
            // 저장된 데이터가 있으면 그것을 사용
            const savedData: ProcedureModifyData = modifyResult.data;
            setProcedureData(savedData);

            // UI 상태도 저장된 데이터로 업데이트
            const updatedSections = newSections.map((section) => {
              const savedSection = savedData.sections.find(
                (s) => s.id === section.id
              );
              return savedSection
                ? { ...section, enabled: savedSection.enabled }
                : section;
            });
            setSections(updatedSections);

            // flatSubsections도 저장된 데이터로 업데이트
            const updatedFlat: FlatSubsectionItem[] = [];
            savedData.sections.forEach((section) => {
              section.subsections.forEach((sub) => {
                const [mainId, subId] = sub.id.split("-").map(Number);
                updatedFlat.push({
                  id: sub.id,
                  mainId,
                  subId,
                  name: sub.name,
                  enabled: sub.enabled,
                });
              });
            });
            setFlatSubsections(updatedFlat);

            // 첫 번째 소목차의 글자수 설정
            if (
              savedData.sections.length > 0 &&
              savedData.sections[0].subsections.length > 0
            ) {
              const firstSub = savedData.sections[0].subsections[0];
              setMinCharCount(firstSub.minChar.toString());
              setMaxCharCount(firstSub.maxChar.toString());
            }
          } else {
            // 저장된 데이터가 없으면 기본 데이터로 초기화
            const initialData = convertToProcedureModifyData(
              procedureDataFromDb.table_of_contents,
              newSections,
              flat
            );
            setProcedureData(initialData);
          }

          // 첫 번째 대목차를 기본 선택
          if (newSections.length > 0) {
            setSelectedSectionId(newSections[0].id);
          }

          // 첫 번째 소목차를 기본 선택
          if (flat.length > 0) {
            setSelectedSubsectionId(flat[0].id);
            setSelectedItemName(flat[0].name);
          }
        }
      } catch {
        // 에러 처리는 조용히
      } finally {
        setIsLoading(false);
      }
    };

    fetchProcedureData();
  }, [reportId, setBusinessField, setProcedureData]);

  // Business field ID를 한글 이름으로 변환
  const getBusinessFieldName = (fieldId: string | null) => {
    const fieldMap: Record<string, string> = {
      "digital-ict-ai": "디지털·ICT·AI 산업",
      "manufacturing-tech": "제조·산업기술·혁신",
      "culture-content-tourism": "문화·콘텐츠·관광",
      "public-urban-infrastructure": "공공·도시·인프라",
      "energy-environment": "에너지·환경",
    };
    return fieldId
      ? fieldMap[fieldId] || "디지털·ICT·AI 산업"
      : "디지털·ICT·AI 산업";
  };

  // 한글 이름을 Business field ID로 변환
  const getBusinessFieldId = (fieldName: string) => {
    const reverseFieldMap: Record<string, string> = {
      "디지털·ICT·AI 산업": "digital-ict-ai",
      "제조·산업기술·혁신": "manufacturing-tech",
      "문화·콘텐츠·관광": "culture-content-tourism",
      "공공·도시·인프라": "public-urban-infrastructure",
      "에너지·환경": "energy-environment",
    };
    return reverseFieldMap[fieldName] || "digital-ict-ai";
  };

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, enabled: !section.enabled } : section
      )
    );
    // zustand store 업데이트
    const section = sections.find((s) => s.id === id);
    if (section) {
      updateSection(id, !section.enabled);
    }
  };

  const handleSelectSection = (id: string) => {
    setSelectedSectionId(id);

    // 선택된 대목차에 해당하는 첫 번째 소목차를 자동 선택
    const filteredSubsections = flatSubsections.filter(
      (sub) => sub.mainId.toString() === id
    );
    if (filteredSubsections.length > 0) {
      setSelectedSubsectionId(filteredSubsections[0].id);
      setSelectedItemName(filteredSubsections[0].name);

      // 선택된 소목차의 글자수 정보 로드
      if (procedureData) {
        const section = procedureData.sections.find((s) => s.id === id);
        if (section && section.subsections.length > 0) {
          setMinCharCount(section.subsections[0].minChar.toString());
          setMaxCharCount(section.subsections[0].maxChar.toString());
        }
      }
    }
  };

  const handleSelectSubsection = (id: string) => {
    setSelectedSubsectionId(id);

    // 선택된 소목차의 이름 찾기
    const item = flatSubsections.find((sub) => sub.id === id);
    if (item) {
      setSelectedItemName(item.name);

      // 선택된 소목차의 글자수 정보 로드
      if (procedureData && selectedSectionId) {
        const section = procedureData.sections.find(
          (s) => s.id === selectedSectionId
        );
        if (section) {
          const subsection = section.subsections.find((s) => s.id === id);
          if (subsection) {
            setMinCharCount(subsection.minChar.toString());
            setMaxCharCount(subsection.maxChar.toString());
          }
        }
      }
    }
  };

  const handleToggleSubsection = (id: string) => {
    setFlatSubsections((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );

    // zustand store 업데이트
    if (selectedSectionId) {
      const item = flatSubsections.find((sub) => sub.id === id);
      if (item) {
        updateSubsection(selectedSectionId, id, { enabled: !item.enabled });
      }
    }
  };

  const handleReorderSubsections = (newItems: FlatSubsectionItem[]) => {
    setFlatSubsections((prevAll) => {
      // 현재 선택된 섹션의 소목차만 업데이트
      const otherSections = prevAll.filter(
        (item) => item.mainId.toString() !== selectedSectionId
      );
      return [...otherSections, ...newItems];
    });

    // zustand store 업데이트 (order 포함)
    if (selectedSectionId && procedureData) {
      const updatedSubsections: ProcedureModifySubsection[] = newItems.map(
        (item, index) => {
          const section = procedureData.sections.find(
            (s) => s.id === selectedSectionId
          );
          const existingSub = section?.subsections.find(
            (s) => s.id === item.id
          );

          return {
            id: item.id,
            name: item.name,
            enabled: item.enabled,
            order: index,
            minChar: existingSub?.minChar ?? 1000,
            maxChar: existingSub?.maxChar ?? 2000,
          };
        }
      );

      reorderSubsections(selectedSectionId, updatedSubsections);
    }
  };

  const handleMinCharCountChange = (value: string) => {
    setMinCharCount(value);
    // zustand store 업데이트
    if (selectedSectionId && selectedSubsectionId) {
      updateSubsection(selectedSectionId, selectedSubsectionId, {
        minChar: parseInt(value) || 0,
      });
    }
  };

  const handleMaxCharCountChange = (value: string) => {
    setMaxCharCount(value);
    // zustand store 업데이트
    if (selectedSectionId && selectedSubsectionId) {
      updateSubsection(selectedSectionId, selectedSubsectionId, {
        maxChar: parseInt(value) || 0,
      });
    }
  };

  const handleBusinessFieldChange = async (newField: string) => {
    setBusinessField(newField);

    // 새로운 분야의 목차 데이터 가져오기
    if (reportId) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/reports/${reportId}/procedure`);
        const result = await response.json();

        if (response.ok && result.data) {
          const procedureDataFromDb: ProcedureData = result.data;

          // 대목차 기반으로 sections 생성
          const newSections: SectionItem[] =
            procedureDataFromDb.table_of_contents.map((item) => ({
              id: item.id.toString(),
              name: item.대목차,
              enabled: true,
            }));
          setSections(newSections);

          // FlatSubsections 생성
          const flat = convertToFlatSubsections(
            procedureDataFromDb.table_of_contents
          );
          setFlatSubsections(flat);

          // ProcedureModifyData 초기화
          const initialData = convertToProcedureModifyData(
            procedureDataFromDb.table_of_contents,
            newSections,
            flat
          );
          setProcedureData(initialData);

          // 첫 번째 대목차를 기본 선택
          if (newSections.length > 0) {
            setSelectedSectionId(newSections[0].id);
          }

          // 첫 번째 소목차를 기본 선택
          if (flat.length > 0) {
            setSelectedSubsectionId(flat[0].id);
            setSelectedItemName(flat[0].name);
          }
        }
      } catch {
        // 에러 처리는 조용히
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 선택된 대목차에 해당하는 소목차만 필터링
  const filteredSubsections = flatSubsections.filter(
    (sub) => sub.mainId.toString() === selectedSectionId
  );

  return (
    <>
      {loader}
      <div className="flex w-full flex-col gap-8 max-w-[1200px] mx-auto">
        <div className="flex w-full items-start gap-6">
          {/* Left Panel - 대목차 */}
          <SectionList
            sections={sections}
            selectedSectionId={selectedSectionId}
            onToggle={toggleSection}
            onSelect={handleSelectSection}
            businessFieldName={getBusinessFieldName(businessField)}
            onChangeCategory={() => setIsBusinessModalOpen(true)}
          />

          {/* Middle Panel - 선택된 대목차의 소목차만 표시 */}
          <TableOfContentsList
            flatSubsections={filteredSubsections}
            selectedSubsectionId={selectedSubsectionId}
            onSelectSubsection={handleSelectSubsection}
            onToggleSubsection={handleToggleSubsection}
            onReorder={handleReorderSubsections}
          />

          {/* Right Panel - 항목명과 글자수 */}
          <ItemSettings
            itemName={selectedItemName}
            minCharCount={minCharCount}
            maxCharCount={maxCharCount}
            onMinCharCountChange={handleMinCharCountChange}
            onMaxCharCountChange={handleMaxCharCountChange}
          />
        </div>

        {/* Modals */}
        <BusinessCategoryModal
          open={isBusinessModalOpen}
          onOpenChange={setIsBusinessModalOpen}
          mode="update"
          reportId={reportId || undefined}
          onBusinessFieldChange={handleBusinessFieldChange}
        >
          <div />
        </BusinessCategoryModal>

        <ReportGenerationModal
          isOpen={isGenerationModalOpen}
          onClose={() => setGenerationModalOpen(false)}
        />
      </div>
    </>
  );
}

export default function ReportProcedurePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportProcedureContent />
    </Suspense>
  );
}
