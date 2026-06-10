import type { JwtPayload } from "@supabase/auth-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { getBootstrapAdminEmails } from "@/lib/supabase/env";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import type { Profile } from "./types";

export type AuthenticatedPlatformUser = {
  claims: JwtPayload;
  profile: Profile;
};

export async function getAuthenticatedPlatformUser(): Promise<AuthenticatedPlatformUser | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) {
    return null;
  }

  const userId = claimsData.claims.sub;
  const email = typeof claimsData.claims.email === "string" ? claimsData.claims.email : null;
  await maybeBootstrapAdmin(userId, email);

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle<Profile>();
  if (!profile) {
    return null;
  }

  return {
    claims: claimsData.claims,
    profile
  };
}

export async function requireAdmin() {
  const user = await getAuthenticatedPlatformUser();

  if (!user || user.profile.role !== "admin") {
    return null;
  }

  return user;
}

async function maybeBootstrapAdmin(userId: string, email: string | null) {
  if (!email) {
    return;
  }

  const allowedEmails = getBootstrapAdminEmails();
  if (!allowedEmails.includes(email.toLowerCase())) {
    return;
  }

  const admin = createAdminClient();
  if (!admin) {
    return;
  }

  await admin.from("profiles").update({ role: "admin" }).eq("id", userId).neq("role", "admin");
}
