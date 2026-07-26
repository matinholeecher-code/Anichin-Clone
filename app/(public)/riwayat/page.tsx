"use client";

import Link from "next/link";
import { useData } from "@/lib/context/DataContext";
import { Clock } from "lucide-react";
import { timeAgo } from "@/lib/helpers";

export default function RiwayatPage() {
  const { history, loading } = useData();

  if (loading) return <div className="text-center text-[#a0a0a0] py-20">Memuat data...</div>;

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-white">Riwayat Menonton</h1>
      {history.length ? (
        <div className="divide-y divide-[#2a2a2a] bg-[#141414] border border-[#2a2a2a] rounded-md">
          {history.map((h) => (
            <Link
              key={h.episodeId}
              href={`/watch/${h.animeId}/${h.episodeId}`}
              className="flex items-center gap-3 p-3 hover:bg-[#1f1f1f] transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={h.posterUrl} alt={h.animeTitle} className="w-12 h-16 object-cover rounded shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white line-clamp-1">{h.animeTitle}</p>
                <p className="text-xs text-[#a0a0a0]">Episode {h.episodeNumber}</p>
              </div>
              <span className="text-xs text-[#666] shrink-0">{timeAgo(h.watchedAt)}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Clock className="w-10 h-10 text-[#2a2a2a] mb-3" />
          <p className="text-[#a0a0a0] text-sm">Belum ada riwayat menonton.</p>
        </div>
      )}
    </div>
  );
}
