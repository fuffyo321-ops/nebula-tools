import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { BillingPage } from "@/components/dashboard/billing";

export const metadata = { title: "Billing" };

export default async function DashboardBillingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [subscription, payments] = await Promise.all([
    db.subscription.findUnique({ where: { userId: session.user.id } }),
    db.payment.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return <BillingPage subscription={subscription} payments={payments} />;
}
