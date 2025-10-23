import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const statusParam = url.searchParams.get("status");
    const keywordParam = url.searchParams.get("keyword");
    const allowedStatuses = [
      "pending",
      "evaluating",
      "consulting_requested",
      "completed",
    ] as const;

    const { data } = await supabase
      .from("expert_requests")
      .select(
        `
        id,
        created_at,
        updated_at,
        report_uuid,
        user_id,
        all_candidates,
        selected_expert,
        status,
        report_create!expert_requests_report_uuid_fkey(
          title,
          business_field,
          created_at
        )
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    let rows = data ?? [];
    
    // 상태 필터링
    if (statusParam && (allowedStatuses as readonly string[]).includes(statusParam)) {
      rows = rows.filter((row) => row.status === statusParam);
    }
    
    // 키워드 필터링 (title 기준)
    if (keywordParam) {
      const keyword = keywordParam.toLowerCase();
      rows = rows.filter((row) => {
        const title = row.report_create && typeof row.report_create === 'object' && 'title' in row.report_create 
          ? row.report_create.title 
          : '';
        return title && typeof title === 'string' && title.toLowerCase().includes(keyword);
      });
    }

    return NextResponse.json(rows);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
