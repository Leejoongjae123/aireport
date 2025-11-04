import { useState } from "react";

interface UseWordDownloadOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useWordDownload = (options?: UseWordDownloadOptions) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadWord = async (reportId: string) => {
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/reports/${reportId}/export`, {
        method: "GET",
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        
        // Content-Disposition 헤더에서 파일명 추출
        const contentDisposition = response.headers.get("Content-Disposition");
        let filename = "report.docx";
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = decodeURIComponent(filenameMatch[1]);
          }
        }
        
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        
        if (options?.onSuccess) {
          options.onSuccess();
        }
      } else {
        const errorMessage = "다운로드에 실패했습니다.";
        if (options?.onError) {
          options.onError(errorMessage);
        } else {
          alert(errorMessage);
        }
      }
    } catch {
      const errorMessage = "다운로드 중 오류가 발생했습니다.";
      if (options?.onError) {
        options.onError(errorMessage);
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadWord,
    isDownloading,
  };
};
