import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin Panel" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[#080810]">
      <div className="border-b border-amber-500/20 bg-amber-500/5 px-6 py-2.5">
        <p className="text-xs text-amber-400 font-medium text-center">
          ⚡ ADMIN MODE — Changes affect all users
        </p>
      </div>
      {children}
    </div>
  );
}
