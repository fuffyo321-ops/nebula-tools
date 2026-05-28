"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Zap } from "lucide-react";
import { DashboardSidebar } from "./sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#080810]">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar — hidden off-screen on mobile, visible on md+ */}
      <div
        className={`fixed left-0 top-0 h-full z-30 transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <DashboardSidebar onClose={() => setOpen(false)} />
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-64 min-h-screen overflow-x-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden sticky top-0 z-10 flex items-center gap-3 px-4 h-14 border-b border-violet-500/10 bg-[#080810]/95 backdrop-blur-xl">
          <button
            onClick={() => setOpen(true)}
            className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-md flex items-center justify-center">
              <Zap className="w-3 h-3 text-white fill-white" />
            </div>
            <span className="font-orbitron font-bold text-sm text-white">
              NEBULA<span className="text-violet-400">TOOLSNIPES</span>
            </span>
          </Link>
        </div>
        {children}
      </main>
    </div>
  );
}
