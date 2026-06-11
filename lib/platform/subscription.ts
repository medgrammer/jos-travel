import { createAdminClient } from "@/lib/supabase/admin";
import { isCloudSubscriptionActive, type CloudSubscription } from "./billing";

export type PlatformSubscriptionStatus = {
  configured: boolean;
  active: boolean;
  subscription: CloudSubscription | null;
};

export async function getPlatformSubscriptionStatus(): Promise<PlatformSubscriptionStatus> {
  const admin = createAdminClient();
  if (!admin) {
    return {
      configured: false,
      active: false,
      subscription: null
    };
  }

  const { data, error } = await admin.from("cloud_subscription").select("*").eq("id", true).maybeSingle();
  if (error) {
    return {
      configured: true,
      active: false,
      subscription: null
    };
  }

  const subscription = (data as CloudSubscription | null) ?? null;
  return {
    configured: true,
    active: isCloudSubscriptionActive(subscription),
    subscription
  };
}
