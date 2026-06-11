import type { Metadata } from "next";
import { PaymentStatus } from "@/components/payment-status";

export const metadata: Metadata = {
  title: "Suivi de paiement | JOS-Travel",
  robots: {
    index: false,
    follow: false
  }
};

export default async function PaymentPage({ params }: { params: Promise<{ depositId: string }> }) {
  const { depositId } = await params;
  return <PaymentStatus depositId={depositId} />;
}
