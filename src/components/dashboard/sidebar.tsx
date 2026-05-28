"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, Grid3X3, CreditCard, Settings,
  LogOut, Zap, Shield, Heart, BarChart3, ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/tools", label: "My Tools", icon: Grid3X3 },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "NT";

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="dashboard-sidebar">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-violet-500/10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="absolute inset-0 bg-violet-600 rounded-lg blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
            <div className="relative w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
          </div>
          <span className="font-orbitron font-bold text-base text-white tracking-wide">
            NEBULA<span className="text-violet-400">TOOLS</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                active
                  ? "bg-violet-600/20 text-white border border-violet-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-violet-400" : "group-hover:text-violet-400 transition-colors"}`} />
              {item.label}
              {active && <ChevronRight className="w-3 h-3 ml-auto text-violet-400" />}
            </Link>
          );
        })}

        {session?.user?.role === "ADMIN" && (
          <>
            <div className="my-2 h-px bg-border" />
            <Link
              href="/admin"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                pathname.startsWith("/admin")
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/20"
                  : "text-amber-500/70 hover:text-amber-400 hover:bg-amber-500/5"
              }`}
            >
              <Shield className="w-4 h-4 flex-shrink-0" />
              Admin Panel
              <Badge variant="elite" className="ml-auto text-[10px]">ADMIN</Badge>
            </Link>
          </>
        )}
      </nav>

      {/* User info */}
      <div className="border-t border-violet-500/10 p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-9 h-9">
            <AvatarImage src={session?.user?.image ?? ""} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{session?.user?.name ?? "User"}</p>
            <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
          </div>
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
