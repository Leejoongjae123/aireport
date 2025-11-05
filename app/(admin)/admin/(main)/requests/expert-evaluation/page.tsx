import EvaluationContent from "./components/EvaluationContent";
import { ExpertEvaluationResponse } from "./types";

async function getInitialData(): Promise<ExpertEvaluationResponse> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!baseUrl) {
      return { 
        data: [], 
        count: 0, 
        stats: { total: 0, completed: 0, pending: 0, delayed: 0 },
        page: 1, 
        limit: 10 
      };
    }
    
    const response = await fetch(`${baseUrl}/api/admin/expert-evaluation?page=1&limit=10`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        data: [],
        count: 0,
        stats: { total: 0, completed: 0, pending: 0, delayed: 0 },
        page: 1,
        limit: 10,
      };
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch initial data:", error);
    return {
      data: [],
      count: 0,
      stats: { total: 0, completed: 0, pending: 0, delayed: 0 },
      page: 1,
      limit: 10,
    };
  }
}

export default async function ExpertEvaluationRequestsPage() {
  const initialData = await getInitialData();

  return <EvaluationContent initialData={initialData} />;
}
