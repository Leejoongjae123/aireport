"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import BasicInfoSection from "./components/BasicInfoSection";
import AffiliationSection from "./components/AffiliationSection";
import CareerSection from "./components/CareerSection";
import AttachmentSection from "./components/AttachmentSection";
import { ExpertFormData, CareerEntry, FieldEntry } from "./types";
import FieldSection from "./components/FieldSection";
import { useLoader } from "@/components/hooks/UseLoader";

export default function ExpertCreatePage() {
  const router = useRouter();

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

  const Loader = useLoader({ isLoading: isSubmitting });

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
          setIsSubmitting(false);
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
        career: careerEntries
          .filter((entry) => entry.description.trim())
          .length > 0 
          ? [{ 
              career: careerEntries
                .filter((entry) => entry.description.trim())
                .map((entry) => entry.description)
            }] 
          : null,
        field: fieldEntries
          .filter((entry) => entry.description.trim())
          .length > 0 
          ? [{ 
              field: fieldEntries
                .filter((entry) => entry.description.trim())
                .map((entry) => entry.description)
            }] 
          : null,
        career_file_name: careerFileName,
      };

      const response = await fetch("/api/experts/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expertData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "저장에 실패했습니다.");
        setIsSubmitting(false);
        return;
      }

      router.push("/admin/embeddings/experts");
    } catch {
      alert("오류가 발생했습니다.");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

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
          <div className="flex items-start gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex w-[79px] h-[46px] justify-center items-center gap-1.5 rounded-lg border border-[#07F] bg-white text-[#07F] font-pretendard text-lg font-bold tracking-[-0.36px] hover:bg-[#F8FCFF]"
            >
              취소
            </Button>
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
    </>
  );
}
