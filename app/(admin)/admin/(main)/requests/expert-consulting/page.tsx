import ConsultingContent from "./components/ConsultingContent";
import { ConsultingRequestResponse } from "./types";

async function getInitialData(): Promise<ConsultingRequestResponse> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!baseUrl) {
      return { 
        data: [], 
        count: 0, 
        stats: { total: 0, completed: 0, waiting: 0 },
        page: 1, 
        limit: 10 
      };
    }
    
    const response = await fetch(`${baseUrl}/api/admin/expert-consulting?page=1&limit=10`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        data: [],
        count: 0,
        stats: { total: 0, completed: 0, waiting: 0 },
        page: 1,
        limit: 10,
      };
    }

    return response.json();
  } catch {
    return {
      data: [],
      count: 0,
      stats: { total: 0, completed: 0, waiting: 0 },
      page: 1,
      limit: 10,
    };
  }
}

export default async function ExpertConsultingPage() {
  const initialData = await getInitialData();

  return <ConsultingContent initialData={initialData} />;
}