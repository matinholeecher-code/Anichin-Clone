"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useData } from "@/lib/context/DataContext";
import { PosterCard } from "@/components/PosterCard";
import { Bookmark } from "lucide-react";

export default function BookmarkPage() {
  const { animes, bookmarks, loading } = useData();
  const bookmarked = useMemo(() => animes.filter((a) => bookmarks.includes(a.id)), [animes, bookmarks]);

  if (loading) return <div className="text-center text-[#a0a0a0] py-20">Memuat data...</div>;

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-white">Bookmark Saya</h1>
      {bookmarked.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {bookmarked.map((anime) => (
            <PosterCard key={anime.id} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bookmark className="w-10 h-10 text-[#2a2a2a] mb-3" />
          <p className="text-[#a0a0a0] text-sm mb-4">Kamu belum menambahkan bookmark apa pun.</p>
          <Link href="/donghua" className="text-[#f45c43] hover:underline text-sm">
            Jelajahi Donghua
          </Link>
        </div>
      )}
    </div>
  );
}
