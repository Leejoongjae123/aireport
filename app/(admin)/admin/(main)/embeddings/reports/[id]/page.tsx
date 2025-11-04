"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLoader } from "@/components/hooks/UseLoader";
import { useToast } from "@/components/hooks/UseToast";
import { ToastContainer } from "@/components/ToastContainer";
import { CustomModal } from "@/components/ui/CustomModal";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";

export default function ReportEmbeddingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [번호, set번호] = useState("");
  const [제목, set제목] = useState("");
  const [분야, set분야] = useState("");
  const [키워드, set키워드] = useState("");
  const [보고서파일명, set보고서파일명] = useState("");
  const [분야번호, set분야번호] = useState("");
  const [loading, setLoading] = useState(true);
  const [dataNotFound, setDataNotFound] = useState(false);
  const [원본보고서파일명, set원본보고서파일명] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const loader = useLoader({
    isLoading: isSubmitting || isUploading || isDeleting,
  });
  const { toasts, showSuccess, showError, removeToast } = useToast();

  // report_embed 데이터 가져오기
  useEffect(() => {
    const fetchReportData = async () => {
      if (!id) return;

      try {
        const supabase = createClient();
        // id로 조회
        const { data, error } = await supabase
          .from("report_embed")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          // 에러 발생 시 데이터 없음 상태로 설정
          setDataNotFound(true);
          setLoading(false);
          return;
        }

        if (!data) {
          // 데이터가 없을 경우
          setDataNotFound(true);
          setLoading(false);
          return;
        }

        // report_embed 테이블의 데이터를 직접 매핑
        set번호(data.번호?.toString() || "");
        set제목(data.제목 || "");
        set분야(data.분야 || "");
        set키워드(data.키워드 || "");
        set보고서파일명(data.보고서파일명 || "");
        set원본보고서파일명(data.보고서파일명 || ""); // 원본 파일명 저장
        set분야번호(data.분야번호?.toString() || "");

        setLoading(false);
      } catch {
        // 예외 발생 시 로딩 상태만 해제
        setLoading(false);
      }
    };

    fetchReportData();
  }, [id]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // PDF 파일 검증
    if (file.type !== "application/pdf") {
      showError("PDF 파일만 업로드 가능합니다.");
      const fileInput = document.getElementById(
        "file-upload"
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
      return;
    }

    // 파일 크기 검증 (20MB)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      showError("파일 크기는 20MB를 초과할 수 없습니다.");
      const fileInput = document.getElementById(
        "file-upload"
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
      return;
    }

    setIsUploading(true);
    setSelectedFile(file);

    try {
      const fastApiUrl =
        process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000";
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${fastApiUrl}/api/reports/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      // 중복 파일 체크 (success: false인 경우)
      if (!result.success) {
        showError(
          result.message ||
            "S3에 이미 동일한 파일명이 존재합니다. 파일명을 변경해주세요."
        );
        setSelectedFile(null);
        setIsUploading(false);
        const fileInput = document.getElementById(
          "file-upload"
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
        return;
      }

      // 업로드 성공
      set보고서파일명(result.file_name);
      showSuccess("파일이 성공적으로 업로드되었습니다.");

      // input 초기화 (같은 파일 재선택 가능하도록)
      const fileInput = document.getElementById(
        "file-upload"
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      showError(
        `파일 업로드 중 오류가 발생했습니다: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
      setSelectedFile(null);

      // 에러 시에도 input 초기화
      const fileInput = document.getElementById(
        "file-upload"
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  const fieldOptions = [
    { value: "1)디지털·ICT·AI 산업", label: "1)디지털·ICT·AI 산업", number: 1 },
    { value: "2)제조·산업기술·혁신", label: "2)제조·산업기술·혁신", number: 2 },
    { value: "3)문화·콘텐츠·관광", label: "3)문화·콘텐츠·관광", number: 3 },
    { value: "4)공공·도시·인프라", label: "4)공공·도시·인프라", number: 4 },
    { value: "5)에너지·환경", label: "5)에너지·환경", number: 5 },
  ];

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const supabase = createClient();

      // report_embed 테이블에서 삭제
      const { error } = await supabase
        .from("report_embed")
        .delete()
        .eq("id", id);

      if (error) {
        showError(`삭제 실패: ${error.message}`);
        setIsDeleting(false);
        return;
      }

      showSuccess("보고서가 성공적으로 삭제되었습니다.");

      // 삭제 성공 후 목록 페이지로 이동
      setTimeout(() => {
        router.push("/admin/embeddings/reports");
      }, 1000);
    } catch (error) {
      showError(
        `삭제 중 오류가 발생했습니다: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
      setIsDeleting(false);
    }
  };

  const handleEmbedding = async () => {
    // 필수 필드 검증
    if (!번호 || !제목 || !분야 || !키워드 || !보고서파일명) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // 파일이 변경되었는지 확인
      const isFileChanged = 보고서파일명 !== 원본보고서파일명;

      // report_embed 테이블 업데이트
      const updateData: {
        번호: number;
        제목: string;
        분야: string;
        키워드: string;
        보고서파일명: string;
        분야번호: number;
        updated_at: string;
        is_completed?: boolean;
      } = {
        번호: parseInt(번호),
        제목,
        분야,
        키워드,
        보고서파일명,
        분야번호: parseInt(분야번호),
        updated_at: new Date().toISOString(),
      };

      // 파일이 변경된 경우에만 is_completed를 false로 설정
      if (isFileChanged) {
        updateData.is_completed = false;
      }

      const { error } = await supabase
        .from("report_embed")
        .update(updateData)
        .eq("id", id);

      if (error) {
        alert(`저장 실패: ${error.message}`);
        setIsSubmitting(false);
        return;
      }

      // 파일이 변경된 경우에만 임베딩 처리
      if (isFileChanged) {
        try {
          const fastApiUrl =
            process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000";
          const embedResponse = await fetch(`${fastApiUrl}/api/reports/embed`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              file_name: 보고서파일명,
              embed_id: String(id),
            }),
          });

          if (!embedResponse.ok) {
            const embedError = await embedResponse.json();
            showError(
              `임베딩 처리 요청 실패: ${embedError.detail || "알 수 없는 오류"}`
            );
          } else {
            showSuccess("저장이 완료되었으며 임베딩 처리가 시작되었습니다.");
            // 원본 파일명 업데이트
            set원본보고서파일명(보고서파일명);
          }
        } catch (embedError) {
          showError(
            `임베딩 처리 요청 중 오류: ${
              embedError instanceof Error
                ? embedError.message
                : "알 수 없는 오류"
            }`
          );
        }
      } else {
        showSuccess("저장이 성공적으로 완료되었습니다.");
      }
    } catch (error) {
      alert(
        `저장 중 오류가 발생했습니다: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {loader}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="flex w-full p-8">
        <div className="flex flex-col w-full p-11 gap-20 bg-white rounded-[5px] relative">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-500">
                데이터를 불러오는 중...
              </div>
            </div>
          ) : dataNotFound ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <div className="text-xl text-gray-700 font-semibold">
                데이터를 찾을 수 없습니다
              </div>
              <div className="text-base text-gray-500">
                ID {id}에 해당하는 보고서가 존재하지 않습니다.
              </div>
              <Button
                onClick={() => window.history.back()}
                className="mt-4 px-6 py-2 bg-[#07F] text-white rounded-lg hover:bg-[#0066e6]"
              >
                목록으로 돌아가기
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-10 w-full">
              {/* 보고서 임베딩 Section */}
              <div className="flex flex-col gap-4 w-full">
                <div className="flex justify-between items-center w-full">
                  <h1 className="text-2xl font-semibold text-black leading-8">
                    보고서 등록
                  </h1>
                </div>

                <div className="flex flex-col border border-[#f5f5f5] w-full">
                  {/* 번호 Row */}
                  <div className="flex w-full border-b border-[#f5f5f5]">
                    <div className="flex w-40 p-6 items-center bg-[#f5f5f5]">
                      <Label className="text-[#555] text-base font-normal leading-6 tracking-[-0.32px]">
                        번호
                      </Label>
                    </div>
                    <div className="flex flex-1 p-4 px-6 items-center">
                      <Input
                        placeholder="자동으로 부여됩니다."
                        value={번호}
                        onChange={(e) => set번호(e.target.value)}
                        type="number"
                        className="w-full h-14 px-[18px] py-4 border border-[#E3E5E5] rounded-lg bg-gray-200 text-gray-500 text-base leading-6 tracking-[-0.064px] placeholder:text-[#A6A6A6] cursor-not-allowed opacity-60"
                        disabled
                      />
                    </div>
                  </div>

                  {/* 제목 Row */}
                  <div className="flex w-full border-b border-[#f5f5f5]">
                    <div className="flex w-40 p-6 items-center bg-[#f5f5f5]">
                      <Label className="text-[#555] text-base font-normal leading-6 tracking-[-0.32px]">
                        제목
                      </Label>
                    </div>
                    <div className="flex flex-1 p-4 px-6 items-center">
                      <Input
                        placeholder="보고서 제목을 입력해주세요."
                        value={제목}
                        onChange={(e) => set제목(e.target.value)}
                        className="w-full h-14 px-[18px] py-4 border border-[#E3E5E5] rounded-lg bg-white text-base leading-6 tracking-[-0.064px] placeholder:text-[#A6A6A6]"
                      />
                    </div>
                  </div>

                  {/* 분야 Row */}
                  <div className="flex w-full h-22 items-center border-b border-[#f5f5f5]">
                    <div className="flex w-40 p-6 items-center bg-[#f5f5f5] h-full">
                      <Label className="text-[#555] text-base font-normal leading-6 tracking-[-0.32px]">
                        분야
                      </Label>
                    </div>
                    <div className="flex flex-1 p-4 px-6 items-center">
                      <Select
                        value={분야}
                        onValueChange={(value) => {
                          set분야(value);
                          const selected = fieldOptions.find(
                            (opt) => opt.value === value
                          );
                          if (selected) {
                            set분야번호(selected.number.toString());
                          }
                        }}
                      >
                        <SelectTrigger className="w-full h-14 px-[18px] py-4 border border-[#E3E5E5] rounded-lg bg-white">
                          <SelectValue
                            placeholder="선택"
                            className="text-[#A6A6A6] text-base leading-6 tracking-[-0.064px]"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* 키워드 Row */}
                  <div className="flex w-full border-b border-[#f5f5f5]">
                    <div className="flex w-40 p-6 items-center bg-[#f5f5f5]">
                      <Label className="text-[#555] text-base font-normal leading-6 tracking-[-0.32px]">
                        키워드
                      </Label>
                    </div>
                    <div className="flex flex-1 p-4 px-6 items-center">
                      <Input
                        placeholder="키워드를 입력해주세요. 쉼표(,)로 구분합니다."
                        value={키워드}
                        onChange={(e) => set키워드(e.target.value)}
                        className="w-full h-14 px-[18px] py-4 border border-[#E3E5E5] rounded-lg bg-white text-base leading-6 tracking-[-0.064px] placeholder:text-[#A6A6A6]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 보고서 등록 Section */}
              <div className="flex flex-col gap-4 w-full">
                <div className="flex justify-between items-center w-full">
                  <h2 className="text-xl font-semibold text-[#2A2A2A] leading-6">
                    보고서 등록
                  </h2>
                </div>

                <div className="flex flex-col border border-[#f5f5f5] w-full">
                  {/* 파일첨부 Row */}
                  <div className="flex w-full items-center border-b border-[#f5f5f5]">
                    <div className="flex w-40 p-6 items-center bg-[#f5f5f5] h-full">
                      <Label className="text-[#555] text-base font-normal leading-6 tracking-[-0.32px]">
                        파일첨부
                      </Label>
                    </div>
                    <div className="flex flex-1 p-6 flex-col justify-center items-start gap-2">
                      <div className="flex items-center gap-2 w-full">
                        <label
                          htmlFor="file-upload"
                          className={
                            isUploading ? "cursor-not-allowed opacity-50" : ""
                          }
                        >
                          <div
                            className={`flex p-3 px-6 justify-center items-center gap-[6px] rounded-lg bg-[#E8F3FF] ${
                              isUploading
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                          >
                            <Plus
                              className="w-6 h-6 text-[#0077FF]"
                              strokeWidth={2}
                            />
                            <span className="text-[#07F] text-lg font-semibold tracking-[-0.36px]">
                              {isUploading ? "업로드 중..." : "파일 첨부"}
                            </span>
                          </div>
                        </label>
                        <input
                          id="file-upload"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                          className="hidden"
                        />
                        <div className="flex flex-1 p-3 px-[18px] items-center border border-[#E3E5E5] rounded-lg bg-white">
                          <span
                            className={`text-base leading-6 tracking-[-0.064px] ${
                              보고서파일명 ? "text-black" : "text-[#A6A6A6]"
                            }`}
                          >
                            {보고서파일명 ||
                              (selectedFile
                                ? `업로드 중: ${selectedFile.name}`
                                : "첨부파일을 업로드해주세요.")}
                          </span>
                        </div>
                      </div>
                      <div className="w-full text-[#757575] text-sm font-semibold tracking-[-0.064px] opacity-80">
                        (PDF만 가능, 최대 20MB)
                      </div>
                    </div>
                  </div>

                  {/* 미리보기 Row */}
                  <div className="flex items-center w-full border-b border-[#f5f5f5]">
                    <div className="flex w-40 p-6 items-center bg-[#f5f5f5] h-full">
                      <Label className="text-[#555] text-base font-normal leading-6 tracking-[-0.32px]">
                        미리보기
                      </Label>
                    </div>
                    <div className="flex flex-1 p-6 items-center gap-6">
                      <div className="flex h-[555px] p-5 px-6 flex-col items-center gap-[10px] flex-1 rounded-xl border border-[#EEEEEF] bg-white relative overflow-hidden">
                        {보고서파일명 ? (
                          <iframe
                            src={`https://${
                              process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME
                            }.s3.ap-northeast-2.amazonaws.com/${encodeURIComponent(
                              보고서파일명
                            )}`}
                            className="w-full h-full border-0"
                            title="PDF 미리보기"
                          />
                        ) : (
                          <div className="flex flex-col items-start flex-1 w-full bg-gray-50 relative">
                            <div className="h-full w-full"></div>
                          </div>
                        )}

                        {/* Scrollbar */}
                        <div className="absolute right-3 top-5 bottom-5 w-[6px] bg-[#f5f5f5] rounded-full">
                          <div className="w-[6px] h-[317px] bg-[#b2b2b2] rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!loading && (
            <div className="flex justify-between items-center gap-3 w-full">
              <div>
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push("/admin/embeddings/reports")
                  }
                  className="flex items-center gap-1.5 px-3 h-[45px] border border-[#a0a0a0] bg-white text-[#555555] text-sm font-semibold rounded"
                >
                  <Menu className="w-4 h-4" />
                  목록으로
                </Button>
              </div>
              <div className="flex gap-x-3">
                <Button
                  onClick={() => setIsDeleteModalOpen(true)}
                  variant="outline"
                  disabled={isSubmitting || isDeleting}
                  className="flex w-[94px] h-[46px] justify-center items-center gap-[6px] rounded-lg border border-red-500 bg-white text-red-500 text-lg font-semibold tracking-[-0.36px] hover:bg-red-50"
                >
                  삭제
                </Button>
                <Button
                  onClick={handleEmbedding}
                  disabled={isSubmitting || isDeleting}
                  className="flex w-[94px] h-[46px] justify-center items-center gap-[6px] rounded-lg bg-[#07F] text-white text-lg font-semibold tracking-[-0.36px] hover:bg-[#0066e6] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "저장 중..." : "저장"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      <CustomModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="보고서 삭제"
        width="500px"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <Button
              onClick={() => setIsDeleteModalOpen(false)}
              variant="outline"
              disabled={isDeleting}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              취소
            </Button>
            <Button
              onClick={() => {
                setIsDeleteModalOpen(false);
                handleDelete();
              }}
              disabled={isDeleting}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              삭제
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4 w-full">
          <p className="text-base text-gray-700">
            정말로 이 보고서를 삭제하시겠습니까?
          </p>
          <p className="text-sm text-gray-500">이 작업은 되돌릴 수 없습니다.</p>
        </div>
      </CustomModal>
    </>
  );
}
