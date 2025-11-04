import { useState } from "react";
import * as XLSX from "xlsx";

interface UseExcelDownloadOptions<T> {
  filename?: string;
  sheetName?: string;
  dataTransformer?: (data: T[]) => Record<string, unknown>[];
}

export function useExcelDownload<T = Record<string, unknown>>(
  options: UseExcelDownloadOptions<T> = {}
) {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadExcel = async (data: T[]) => {
    setIsDownloading(true);
    
    // 약간의 지연을 주어 UI 업데이트 보장
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      const {
        filename = `data_${new Date().toISOString().split("T")[0]}.xlsx`,
        sheetName = "Sheet1",
        dataTransformer,
      } = options;

      // 데이터 변환
      const transformedData = dataTransformer ? dataTransformer(data) : data;

      // 워크시트 생성
      const worksheet = XLSX.utils.json_to_sheet(transformedData);

      // 워크북 생성
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      // 파일 다운로드 (동기 함수)
      XLSX.writeFile(workbook, filename);
      
      // 파일 쓰기 완료 후 약간의 지연
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setIsDownloading(false);
      return { success: true };
    } catch (error) {
      setIsDownloading(false);
      return { success: false, error };
    }
  };

  return { downloadExcel, isDownloading };
}
