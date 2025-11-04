import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  try {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select(
        `
        id,
        name,
        email,
        organization,
        business_field,
        provider,
        role
      `
      )
      .order("id", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const userIds = profiles?.map((p) => p.id) || [];

    interface AuthUser {
      id: string;
      created_at: string;
      last_sign_in_at: string | null | undefined;
    }

    let authUsers: AuthUser[] = [];
    if (userIds.length > 0) {
      const {
        data: { users },
        error: authError,
      } = await supabase.auth.admin.listUsers();

      if (!authError && users) {
        authUsers = users.filter((u) => userIds.includes(u.id)) as AuthUser[];
      }
    }

    const membersData =
      profiles?.map((profile) => {
        const authUser = authUsers.find((u) => u.id === profile.id);

        return {
          id: profile.id,
          user_id: profile.id,
          name: profile.name,
          email: profile.email,
          organization: profile.organization,
          business_field: profile.business_field,
          provider: profile.provider || "local",
          role: profile.role,
          created_at: authUser?.created_at || new Date().toISOString(),
          last_sign_in_at: authUser?.last_sign_in_at || null,
          status: profile.role === "deleted" ? "탈퇴" : "정상",
        };
      }) || [];

    return NextResponse.json({ data: membersData });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
