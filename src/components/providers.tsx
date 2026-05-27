"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#111127",
              border: "1px solid rgba(124,58,237,0.2)",
              color: "#e2e8f0",
              fontFamily: "Inter, sans-serif",
            },
            classNames: {
              success: "!border-emerald-500/30",
              error: "!border-red-500/30",
            },
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
}
