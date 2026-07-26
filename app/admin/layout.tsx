"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/lib/context/AuthContext";
import { Loader2, Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();
  const isLoginPage = pathname === "/admin/login";
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!loading && !isLoginPage && !isAdmin) {
      router.replace("/admin/login");
    }
  }, [loading, isAdmin, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <Loader2 className="w-6 h-6 text-[#f45c43] animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0f0f0f]">
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 w-60 h-full">
            <AdminSidebar />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="md:hidden h-14 flex items-center gap-3 px-4 border-b border-[#2a2a2a] bg-[#141414] sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#1f1f1f]"
            aria-label="Menu admin"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="text-sm font-bold text-white">
            ANI<span className="text-[#f45c43]">CHIN</span> Admin
          </span>
        </div>
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
