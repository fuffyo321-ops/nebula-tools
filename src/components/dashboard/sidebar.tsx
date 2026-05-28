"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, Grid3X3, CreditCard, Settings,
  LogOut, Zap, Shield,
} from "lucide-react";

const navItems = [
  { href: "/dashboard",          label: "Overview",  icon: LayoutDashboard, exact: true },
  { href: "/dashboard/tools",    label: "My Tools",  icon: Grid3X3 },
  { href: "/dashboard/billing",  label: "Billing",   icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings",  icon: Settings },
];

const planBadge: Record<string, { label: string; cls: string }> = {
  FREE:  { label: "FREE",  cls: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
  PRO:   { label: "PRO",   cls: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  ELITE: { label: "ELITE", cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
};

export function DashboardSidebar({ onClose }: { onClose?: () => void }) {
  const pathname  = usePathname();
  const { data: session } = useSession();

  const plan     = (session?.user as any)?.plan ?? "FREE";
  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "NT";

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="dashboard-sidebar flex flex-col" style={{ width: 256 }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 group w-fit">
          <div className="relative">
            <div className="absolute inset-0 bg-violet-600 rounded-xl blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
            <div className="relative w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-4.5 h-4.5 text-white fill-white" />
            </div>
          </div>
          <div>
            <span className="font-orbitron font-bold text-sm text-white tracking-wide leading-none">
              NEBULA<span className="text-violet-400">TOOLSNIPES</span>

            </span>
            <div className="text-[10px] text-slate-600 mt-0.5 font-mono">v2.0 · dashboard</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-3">Navigation</p>
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                active
                  ? "bg-violet-600/15 text-white"
                  : "text-slate-500 hover:text-white hover:bg-white/5"
              }`}
            >
              {/* Active left bar */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-violet-400" />
              )}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                active ? "bg-violet-500/20" : "bg-white/5 group-hover:bg-violet-500/10"
              }`}>
                <item.icon className={`w-4 h-4 ${active ? "text-violet-400" : "text-slate-500 group-hover:text-violet-400"}`} />
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}

        {(session?.user as any)?.role === "ADMIN" && (
          <div className="pt-3 mt-3 border-t border-white/5">
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-2">Admin</p>
            <Link
              href="/admin"
              onClick={onClose}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                pathname.startsWith("/admin")
                  ? "bg-amber-500/15 text-amber-300"
                  : "text-amber-600/70 hover:text-amber-400 hover:bg-amber-500/5"
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-amber-400" />
              </div>
              Admin Panel
              <Badge variant="elite" className="ml-auto text-[9px] px-1.5">ADMIN</Badge>
            </Link>
          </div>
        )}
      </nav>

      {/* User profile */}
      <div className="border-t border-white/5 p-4">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/3 border border-white/5 mb-2">
          <Avatar className="w-9 h-9 ring-2 ring-violet-500/20">
            <AvatarImage src={session?.user?.image ?? ""} />
            <AvatarFallback className="text-xs bg-violet-600/30 text-violet-300">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate leading-tight">{session?.user?.name ?? "User"}</p>
            <p className="text-[11px] text-slate-500 truncate">{session?.user?.email}</p>
          </div>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${planBadge[plan]?.cls ?? planBadge.FREE.cls}`}>
            {planBadge[plan]?.label ?? "FREE"}
          </span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
