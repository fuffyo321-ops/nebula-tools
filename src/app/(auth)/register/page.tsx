"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Zap, Mail, Lock, Eye, EyeOff, Loader2, User, Star, Check, ArrowRight, Crown } from "lucide-react";
import { PhantomButton } from "@/components/billing/phantom-button";

const plans = [
  {
    id: "FREE" as const,
    name: "Free",
    price: 0,
    description: "Get started for free",
    features: ["10 tool launches/month", "5 AI categories", "Community support"],
    color: "border-slate-500/20",
    icon: Star,
    iconColor: "text-slate-400",
  },
  {
    id: "PRO" as const,
    name: "Pro",
    price: 19,
    description: "For creators & teams",
    features: ["100 tool launches/month", "All 50+ AI tools", "API access", "Priority support"],
    color: "border-violet-500/30",
    icon: Zap,
    iconColor: "text-violet-400",
    highlighted: true,
  },
  {
    id: "ELITE" as const,
    name: "Elite",
    price: 49,
    description: "Unlimited everything",
    features: ["Unlimited launches", "All 100+ AI tools", "Exclusive tools", "Dedicated manager"],
    color: "border-amber-500/20",
    icon: Crown,
    iconColor: "text-amber-400",
  },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultPlan = (searchParams.get("plan")?.toUpperCase() as "PRO" | "ELITE") ?? null;

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [stripeLoading, setStripeLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Registration failed");

      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      toast.success("Account created! 🚀");
      setStep(2);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  async function handleStripe(plan: "PRO" | "ELITE") {
    setStripeLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billing: "monthly" }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error);
    } catch {
      toast.error("Could not start checkout");
    } finally {
      setStripeLoading(null);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080810] px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.6) 0%, transparent 70%)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full relative z-10"
        style={{ maxWidth: step === 2 ? "720px" : "448px" }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-600 rounded-lg blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
            </div>
            <span className="font-orbitron font-bold text-xl text-white tracking-wide">
              NEBULA<span className="text-violet-400">TOOLS</span>
            </span>
          </Link>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step >= s ? "bg-violet-600 text-white" : "bg-[#111127] text-slate-500 border border-border"
              }`}>
                {step > s ? <Check className="w-3.5 h-3.5" /> : s}
              </div>
              {s < 2 && <div className={`w-10 h-px transition-colors duration-300 ${step > s ? "bg-violet-500" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── Step 1: Account creation ── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass-card rounded-3xl p-8">
                <h1 className="font-orbitron text-2xl font-bold text-white text-center mb-1">Create Account</h1>
                <p className="text-sm text-slate-500 text-center mb-8">Start free — no credit card required</p>

                <Button
                  variant="secondary"
                  className="w-full mb-6 h-11 gap-3 border-border hover:border-violet-500/30"
                  onClick={handleGoogle}
                  disabled={googleLoading}
                >
                  {googleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-4 h-4">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  )}
                  Continue with Google
                </Button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-slate-600">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input id="name" type="text" placeholder="Your name" value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="pl-10" required />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input id="email" type="email" placeholder="you@example.com" value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="pl-10" required />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input id="password" type={showPassword ? "text" : "password"} placeholder="Min. 6 characters"
                        value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                        className="pl-10 pr-10" required minLength={6} />
                      <button type="button" onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-11 font-orbitron tracking-wider shadow-lg shadow-violet-500/25 gap-2" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>CREATE ACCOUNT <ArrowRight className="w-4 h-4" /></>}
                  </Button>
                </form>

                <p className="text-xs text-slate-600 text-center mt-4">
                  By creating an account you agree to our{" "}
                  <Link href="#" className="text-violet-400/70 hover:text-violet-400">Terms</Link> and{" "}
                  <Link href="#" className="text-violet-400/70 hover:text-violet-400">Privacy Policy</Link>
                </p>
              </div>

              <p className="text-center text-sm text-slate-600 mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">Sign in</Link>
              </p>
            </motion.div>
          )}

          {/* ── Step 2: Plan selection ── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass-card rounded-3xl p-6 sm:p-8">
                <h1 className="font-orbitron text-xl sm:text-2xl font-bold text-white text-center mb-1">Choose Your Plan</h1>
                <p className="text-sm text-slate-500 text-center mb-8">Upgrade now or start free — you can always upgrade later</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative rounded-2xl border p-5 flex flex-col gap-4 transition-all duration-200 ${plan.color} ${
                        plan.highlighted
                          ? "bg-violet-500/5"
                          : "bg-[#0d0d1a]"
                      } ${defaultPlan === plan.id ? "ring-2 ring-violet-500/50" : ""}`}
                    >
                      {plan.highlighted && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                            MOST POPULAR
                          </span>
                        </div>
                      )}

                      {/* Header */}
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          plan.id === "PRO" ? "bg-violet-500/20" : plan.id === "ELITE" ? "bg-amber-500/20" : "bg-slate-500/10"
                        }`}>
                          <plan.icon className={`w-4 h-4 ${plan.iconColor}`} />
                        </div>
                        <div>
                          <p className="font-orbitron font-bold text-white text-sm">{plan.name}</p>
                          <p className="text-[11px] text-slate-500">{plan.description}</p>
                        </div>
                      </div>

                      {/* Price */}
                      <div>
                        <span className="font-orbitron text-2xl font-black text-white">${plan.price}</span>
                        {plan.price > 0 && <span className="text-slate-500 text-xs ml-1">/month</span>}
                        {plan.price === 0 && <span className="text-slate-500 text-xs ml-1">forever</span>}
                      </div>

                      {/* Features */}
                      <ul className="space-y-1.5 flex-1">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                            <Check className={`w-3.5 h-3.5 flex-shrink-0 ${plan.iconColor}`} />
                            {f}
                          </li>
                        ))}
                      </ul>

                      {/* CTAs */}
                      {plan.id === "FREE" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full font-orbitron tracking-wider text-xs"
                          onClick={() => router.push("/dashboard")}
                        >
                          CONTINUE FREE
                        </Button>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant={plan.id === "ELITE" ? "elite" : "default"}
                            className="w-full font-orbitron tracking-wider text-xs"
                            onClick={() => handleStripe(plan.id)}
                            disabled={stripeLoading === plan.id}
                          >
                            {stripeLoading === plan.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "PAY WITH CARD"}
                          </Button>
                          <PhantomButton
                            plan={plan.id}
                            size="sm"
                            className="w-full text-xs border-[#AB9FF2]/30 text-[#AB9FF2] hover:bg-[#AB9FF2]/10 hover:text-[#c4b8f7]"
                            onSuccess={() => router.push("/dashboard")}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-center text-xs text-slate-600 mt-6">
                  All paid plans include a 7-day free trial · Cancel anytime
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
