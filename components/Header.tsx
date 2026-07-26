"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search, ChevronRight, Home, Video, Bookmark, Calendar, Clock, Star, MessageCircle } from "lucide-react";

const donghuaSubmenu = [
  { label: "Ongoing", href: "/ongoing" },
  { label: "Completed", href: "/completed" },
  { label: "Upcoming", href: "/upcoming" },
  { label: "Movie", href: "/movie" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/donghua?search=${encodeURIComponent(query.trim())}`);
      setMenuOpen(false);
    }
  };

  const closeAll = () => {
    setMenuOpen(false);
    setSubmenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-sm border-b border-[#2a2a2a]">
      <div className="w-full px-3 sm:px-4 h-16 flex items-center gap-3">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="w-9 h-9 flex items-center justify-center rounded hover:bg-[#1f1f1f] transition-colors shrink-0"
          aria-label="Menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <Link href="/" className="text-lg sm:text-xl font-extrabold tracking-tight shrink-0" onClick={closeAll}>
          <span className="text-white">ANI</span>
          <span className="text-[#f45c43]">CHIN</span>
        </Link>

        <form onSubmit={handleSearch} className="flex items-center relative w-32 xs:w-40 sm:w-56 md:w-72 shrink min-w-0">
          <Search className="absolute left-3 w-4 h-4 text-[#666]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari..."
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-[#f45c43] transition-colors"
          />
        </form>
      </div>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={closeAll} />
          <div className="absolute left-3 sm:left-4 top-16 z-50 flex fade-in">
            <div className="w-48 bg-[#0f0f0f] border border-[#2a2a2a] rounded-b-md overflow-hidden">
              <Link
                href="/"
                onClick={closeAll}
                className="flex items-center gap-2 px-4 py-3 text-sm font-semibold bg-[#f45c43] text-white"
              >
                <Home className="w-4 h-4" /> HOME
              </Link>
              <div
                className="relative"
                onMouseEnter={() => setSubmenuOpen(true)}
                onMouseLeave={() => setSubmenuOpen(false)}
              >
                <button
                  onClick={() => setSubmenuOpen((v) => !v)}
                  className={`w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-semibold transition-colors ${
                    submenuOpen ? "bg-[#1f1f1f] text-white" : "text-[#a0a0a0] hover:bg-[#1f1f1f] hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Video className="w-4 h-4" /> DONGHUA LIST
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                {submenuOpen && (
                  <div className="absolute left-full top-0 w-44 bg-[#141414] border border-[#2a2a2a] fade-in">
                    {donghuaSubmenu.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeAll}
                        className="block px-4 py-2.5 text-sm text-[#a0a0a0] hover:bg-[#1f1f1f] hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link
                href="/bookmark"
                onClick={closeAll}
                className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[#a0a0a0] hover:bg-[#1f1f1f] hover:text-white transition-colors"
              >
                <Bookmark className="w-4 h-4" /> BOOKMARK
              </Link>
              <Link
                href="/schedule"
                onClick={closeAll}
                className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[#a0a0a0] hover:bg-[#1f1f1f] hover:text-white transition-colors"
              >
                <Calendar className="w-4 h-4" /> SCHEDULE
              </Link>
              <Link
                href="/riwayat"
                onClick={closeAll}
                className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[#a0a0a0] hover:bg-[#1f1f1f] hover:text-white transition-colors"
              >
                <Clock className="w-4 h-4" /> RIWAYAT
              </Link>
              <Link
                href="/"
                onClick={closeAll}
                className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[#a0a0a0] hover:bg-[#1f1f1f] hover:text-white transition-colors"
              >
                <Star className="w-4 h-4" /> ANICHIN VIP
              </Link>
              <Link
                href="/"
                onClick={closeAll}
                className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-[#a0a0a0] hover:bg-[#1f1f1f] hover:text-white transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> ANICHIN CAFE
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
