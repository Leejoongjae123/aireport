"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import BasicInfoSection from "./components/BasicInfoSection";
import AffiliationSection from "./components/AffiliationSection";
import CareerSection from "./components/CareerSection";
import AttachmentSection from "./components/AttachmentSection";
import { ExpertFormData, CareerEntry, FieldEntry } from "./types";
import FieldSection from "./components/FieldSection";
import { useLoader } from "@/components/hooks/UseLoader";
import { Menu } from "lucide-react";

export default function ExpertEmbeddingPage() {
  const params = useParams();
  const router = useRouter();
  const expertId = params.id as string;

  const [formData, setFormData] = useState<ExpertFormData>({
    name: "",
    contact: "",
    businessField: "",
    summary: "",
    experienceYears: "",
    recentAffiliation: "",
    isPublic: true,
    careerFileName: "",
  });

  const [careerEntries, setCareerEntries] = useState<CareerEntry[]>([
    { id: "1", description: "" },
  ]);

  const [fieldEntries, setFieldEntries] = useState<FieldEntry[]>([
    { id: "1", year: "", field: "", description: "" },
  ]);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const Loader = useLoader({ isLoading: isSubmitting });

  // 기존 데이터 로드
  useEffect(() => {
    const loadExpertData = async () => {
      if (expertId === "new") {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/experts/${expertId}`);

        if (!response.ok) {
          alert("데이터를 불러오는데 실패했습니다.");
          router.back();
          return;
        }

        const data = await response.json();

        // 기본 정보 설정
        setFormData({
          name: data.name || "",
          contact: data.contact || "",
          businessField: data.business_field || "",
          summary: data.summary || "",
          experienceYears: data.experience_years || "",
          recentAffiliation: data.affiliation || "",
          isPublic: data.is_visible ?? true,
          careerFileName: data.career_file_name || "",
        });

        // 경력 데이터 설정
        if (
          data.career &&
          Array.isArray(data.career) &&
          data.career.length > 0
        ) {
          // career 데이터가 ["문자열", "문자열", ...] 형태
          setCareerEntries(
            data.career.map((item: string, index: number) => ({
              id: `career-${index}`,
              description: item || "",
            }))
          );
        }

        // 분야 데이터 설정
        if (data.field && Array.isArray(data.field) && data.field.length > 0) {
          // field 데이터가 ["문자열", "문자열", ...] 형태
          setFieldEntries(
            data.field.map((item: string, index: number) => ({
              id: `field-${index}`,
              year: "",
              field: "",
              description: item || "",
            }))
          );
        }
      } catch {
        alert("데이터를 불러오는 중 오류가 발생했습니다.");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    loadExpertData();
  }, [expertId, router]);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      let careerFileName = null;

      // 파일 업로드
      if (uploadedFile) {
        const fileFormData = new FormData();
        fileFormData.append("file", uploadedFile);

        const uploadResponse = await fetch("/api/experts/upload", {
          method: "POST",
          body: fileFormData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          alert(errorData.error || "파일 업로드에 실패했습니다.");
          return;
        }

        const uploadData = await uploadResponse.json();
        careerFileName = uploadData.fileName;
      }

      // 전문가 정보 저장
      const expertData = {
        name: formData.name,
        contact: formData.contact,
        business_field: formData.businessField,
        summary: formData.summary,
        affiliation: formData.recentAffiliation,
        experience_years: formData.experienceYears,
        is_visible: formData.isPublic,
        career:
          careerEntries.filter((entry) => entry.description.trim()).length > 0
            ? careerEntries
                .filter((entry) => entry.description.trim())
                .map((entry) => entry.description)
            : null,
        field:
          fieldEntries.filter((entry) => entry.description.trim()).length > 0
            ? fieldEntries
                .filter((entry) => entry.description.trim())
                .map((entry) => entry.description)
            : null,
        career_file_name: careerFileName || formData.careerFileName,
      };

      const apiUrl =
        expertId === "new" ? "/api/experts/new" : `/api/experts/${expertId}`;
      const method = expertId === "new" ? "POST" : "PUT";

      const response = await fetch(apiUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expertData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "저장에 실패했습니다.");
        return;
      }

      router.push("/admin/embeddings/experts");
    } catch {
      alert("오류가 발생했습니다.");
      setIsSubmitting(false);
    }
  };


  if (isLoading) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <div className="text-lg text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <>
      {Loader}
      <div className="flex w-full p-8 items-start gap-2.5">
        <div className="flex w-full p-11 flex-col items-end gap-20 rounded-[5px] bg-white">
          <div className="flex flex-col items-start gap-10 self-stretch">
            <BasicInfoSection
              formData={formData}
              onFormDataChange={setFormData}
            />

            <AffiliationSection
              formData={formData}
              onFormDataChange={setFormData}
            />

            <CareerSection
              careerEntries={careerEntries}
              onCareerEntriesChange={setCareerEntries}
            />

            <FieldSection
              fieldEntries={fieldEntries}
              onFieldEntriesChange={setFieldEntries}
            />

            <AttachmentSection
              formData={formData}
              onFormDataChange={setFormData}
              uploadedFile={uploadedFile}
              onFileUpload={setUploadedFile}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex w-full justify-between items-center gap-3">
            <div>
              <Button
                variant="outline"
                onClick={() => router.push("/admin/embeddings/experts")}
                className="flex items-center gap-1.5 px-3 h-[45px] border border-[#a0a0a0] bg-white text-[#555555] text-sm font-semibold rounded"
              >
                <Menu className="w-4 h-4" />
                목록으로
              </Button>
            </div>
            <div>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex w-[79px] h-[46px] justify-center items-center gap-1.5 rounded-lg bg-[#07F] text-white font-pretendard text-lg font-bold tracking-[-0.36px] hover:bg-[#0066CC] disabled:opacity-50"
              >
                {isSubmitting ? "저장 중..." : "저장"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
