"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { Loader2, Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("admin@gxmods.dev");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/admin");
    } catch {
      setError("Email atau password salah.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4">
      <div className="w-full max-w-sm bg-[#141414] border border-[#2a2a2a] rounded-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-xl font-extrabold">
            <span className="text-white">ANI</span>
            <span className="text-[#f45c43]">CHIN</span>
          </h1>
          <p className="text-xs text-[#a0a0a0] mt-1">Admin Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-[#a0a0a0]">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#f45c43]"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[#a0a0a0]">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#f45c43]"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-[#f45c43] hover:bg-[#e04a32] disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded transition-colors"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
