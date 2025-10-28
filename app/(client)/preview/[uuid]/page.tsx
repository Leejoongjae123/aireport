import { Suspense } from "react";
import ReportPreviewModal from "./components/ReportPreviewModal";

interface PageProps {
  params: Promise<{ uuid: string }>;
}

export default async function ReportPreviewPage({ params }: PageProps) {
  const { uuid } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0077FF] mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 font-pretendard">
              로딩 중...
            </p>
          </div>
        </div>
      }
    >
      <ReportPreviewModal uuid={uuid} />
    </Suspense>
  );
}
