import ReportsContent from "./components/ReportsContent";
import { ReportResponse } from "./types";

async function getInitialData(): Promise<ReportResponse> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!baseUrl) {
      return { 
        data: [], 
        count: 0, 
        stats: { total: 0, thisMonth: 0, latestEmbeddingDate: null },
        page: 1, 
        limit: 10 
      };
    }
    
    const response = await fetch(`${baseUrl}/api/admin/reports?page=1&limit=10`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        data: [],
        count: 0,
        stats: { total: 0, thisMonth: 0, latestEmbeddingDate: null },
        page: 1,
        limit: 10,
      };
    }

    return response.json();
  } catch {
    return {
      data: [],
      count: 0,
      stats: { total: 0, thisMonth: 0, latestEmbeddingDate: null },
      page: 1,
      limit: 10,
    };
  }
}

export default async function ReportsPage() {
  const initialData = await getInitialData();

  return <ReportsContent initialData={initialData} />;
}
