import { JosTravelSite } from "@/components/jos-travel-site";
import { PlatformLock } from "@/components/platform-lock";
import { getPlatformSubscriptionStatus } from "@/lib/platform/subscription";

export const dynamic = "force-dynamic";

export default async function Home() {
  const subscriptionStatus = await getPlatformSubscriptionStatus();

  if (!subscriptionStatus.active) {
    return <PlatformLock subscription={subscriptionStatus.subscription} />;
  }

  return <JosTravelSite />;
}
