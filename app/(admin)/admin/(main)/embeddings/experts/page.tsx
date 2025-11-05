import ExpertsContent from "./components/ExpertsContent";
import { ExpertResponse } from "./types";

async function getInitialData(): Promise<ExpertResponse> {
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
    
    const response = await fetch(`${baseUrl}/api/admin/experts?page=1&limit=10`, {
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

export default async function ExpertsPage() {
  const initialData = await getInitialData();

  return <ExpertsContent initialData={initialData} />;
}
