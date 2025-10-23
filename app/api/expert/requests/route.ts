import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
        report_create!inner(
          title,
          business_field,
          created_at
        )
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
