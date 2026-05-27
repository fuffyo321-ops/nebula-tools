"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";

interface Props {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    createdAt: Date;
  };
}

export function SettingsPage({ user }: Props) {
  const router = useRouter();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [profile, setProfile] = useState({ name: user.name ?? "" });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  const initials = user.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "NT";

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile.name }),
      });
      if (!res.ok) throw new Error();
      toast.success("Profile updated");
      router.refresh();
    } catch {
      toast.error("Could not update profile");
    } finally {
      setProfileLoading(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords don't match");
      return;
    }
    if (passwords.new.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Password changed successfully");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not change password");
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="p-6 sm:p-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-orbitron text-2xl sm:text-3xl font-bold text-white mb-1">Settings</h1>
        <p className="text-slate-400 text-sm">Manage your account and preferences</p>
      </motion.div>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-6 mb-6"
      >
        <h2 className="font-semibold text-white flex items-center gap-2 mb-5">
          <User className="w-4 h-4 text-violet-400" />
          Profile
        </h2>

        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.image ?? ""} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>

        <form onSubmit={saveProfile} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input id="email" value={user.email} className="pl-10 opacity-60" disabled />
            </div>
            <p className="text-xs text-slate-500">Email cannot be changed</p>
          </div>
          <Button type="submit" size="sm" disabled={profileLoading} className="font-orbitron tracking-wider">
            {profileLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "SAVE CHANGES"}
          </Button>
        </form>
      </motion.div>

      {/* Change password */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6"
      >
        <h2 className="font-semibold text-white flex items-center gap-2 mb-5">
          <Lock className="w-4 h-4 text-violet-400" />
          Change Password
        </h2>

        <form onSubmit={changePassword} className="space-y-4">
          {[
            { id: "current", label: "Current Password", state: passwords.current, show: showOld, toggle: () => setShowOld((v) => !v) },
            { id: "new", label: "New Password", state: passwords.new, show: showNew, toggle: () => setShowNew((v) => !v) },
            { id: "confirm", label: "Confirm New Password", state: passwords.confirm, show: showNew, toggle: () => setShowNew((v) => !v) },
          ].map((field) => (
            <div key={field.id} className="space-y-1.5">
              <Label htmlFor={field.id}>{field.label}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id={field.id}
                  type={field.show ? "text" : "password"}
                  value={field.state}
                  onChange={(e) => setPasswords((p) => ({ ...p, [field.id]: e.target.value }))}
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button type="button" onClick={field.toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
          <Button type="submit" size="sm" variant="outline" disabled={passwordLoading} className="font-orbitron tracking-wider">
            {passwordLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "CHANGE PASSWORD"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
