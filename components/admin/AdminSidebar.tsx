"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, Film, Video, ExternalLink, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/context/AuthContext";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Activity },
  { href: "/admin/anime", label: "Kelola Anime", icon: Film },
  { href: "/admin/episode", label: "Kelola Episode", icon: Video },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/admin/login");
  };

  return (
    <aside className="w-60 shrink-0 bg-[#141414] border-r border-[#2a2a2a] min-h-screen flex flex-col">
      <div className="px-5 h-16 flex items-center border-b border-[#2a2a2a]">
        <span className="text-lg font-extrabold text-white">
          ANI<span className="text-[#f45c43]">CHIN</span>
        </span>
        <span className="ml-2 text-[10px] text-[#666] uppercase tracking-wide">Admin</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active ? "bg-[#f45c43] text-white font-semibold" : "text-[#a0a0a0] hover:bg-[#1f1f1f] hover:text-white"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      {user?.email && <p className="px-6 text-[10px] text-[#666] truncate">{user.email}</p>}
      <div className="p-3 border-t border-[#2a2a2a] space-y-1">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-[#a0a0a0] hover:text-white transition-colors px-3 py-2"
        >
          <ExternalLink className="w-4 h-4" /> Lihat Situs
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors px-3 py-2"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
