import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/dashboard";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard");

  const [
    totalUsers,
    activeSubscriptions,
    totalTools,
    totalRevenue,
    recentUsers,
    recentPayments,
  ] = await Promise.all([
    db.user.count(),
    db.subscription.count({ where: { status: "ACTIVE", plan: { not: "FREE" } } }),
    db.tool.count({ where: { active: true } }),
    db.payment.aggregate({ _sum: { amount: true }, where: { status: "paid" } }),
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { subscription: { select: { plan: true, status: true } } },
    }),
    db.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  const newUsersToday = await db.user.count({
    where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
  });

  return (
    <AdminDashboard
      stats={{
        totalUsers,
        activeSubscriptions,
        totalTools,
        newUsersToday,
        totalRevenue: totalRevenue._sum.amount ?? 0,
        mrr: activeSubscriptions * 2900, // rough estimate
      }}
      recentUsers={recentUsers}
      recentPayments={recentPayments}
    />
  );
}
