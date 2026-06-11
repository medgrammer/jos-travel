import { JosTravelSite } from "@/components/jos-travel-site";
import { PlatformLock } from "@/components/platform-lock";
import { getAuthenticatedPlatformUser } from "@/lib/platform/auth";
import { getPlatformSubscriptionStatus } from "@/lib/platform/subscription";

export default async function Home() {
  const [subscriptionStatus, user] = await Promise.all([
    getPlatformSubscriptionStatus(),
    getAuthenticatedPlatformUser()
  ]);

  if (subscriptionStatus.configured && !subscriptionStatus.active && user?.profile.role !== "admin") {
    return <PlatformLock subscription={subscriptionStatus.subscription} />;
  }

  return <JosTravelSite />;
}
