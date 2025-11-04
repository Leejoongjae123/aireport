import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("consulting_requests")
    .select(
      `
      id,
      created_at,
      updated_at,
      status,
      report_uuid,
      user_id,
      expert_id,
      request_subject,
      report_create!inner(
        uuid,
        title,
        business_field
      ),
      profiles!inner(
        id,
        name,
        email
      ),
      expert_informations(
        id,
        name,
        field
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
