import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("expert_informations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const body = await request.json();
  const {
    name,
    contact,
    business_field,
    summary,
    career,
    field,
    career_file_name,
    affiliation,
    experience_years,
    is_visible,
  } = body;

  const { data, error } = await supabase
    .from("expert_informations")
    .update({
      name,
      contact,
      business_field,
      summary,
      career,
      field,
      career_file_name,
      affiliation,
      experience_years,
      is_visible,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const body = await request.json();
  const {
    name,
    contact,
    business_field,
    summary,
    career,
    field,
    career_file_name,
    affiliation,
    experience_years,
    is_visible,
  } = body;

  const { data, error } = await supabase
    .from("expert_informations")
    .insert({
      name,
      contact,
      business_field,
      summary,
      career,
      field,
      career_file_name,
      affiliation,
      experience_years,
      is_visible,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
