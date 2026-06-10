import { NextResponse } from "next/server";
import { getAuthenticatedPlatformUser } from "@/lib/platform/auth";
import { hasSupabaseBrowserConfig } from "@/lib/supabase/env";

export const runtime = "nodejs";

export async function GET() {
  if (!hasSupabaseBrowserConfig()) {
    return NextResponse.json({ configured: false, profile: null }, { status: 503 });
  }

  const user = await getAuthenticatedPlatformUser();
  if (!user) {
    return NextResponse.json({ configured: true, profile: null }, { status: 401 });
  }

  return NextResponse.json({ configured: true, profile: user.profile });
}
