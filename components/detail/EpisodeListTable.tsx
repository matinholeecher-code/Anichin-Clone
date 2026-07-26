"use client";

import Link from "next/link";
import { Anime } from "@/types";

function formatEn(dateStr: string): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function EpisodeListTable({ anime }: { anime: Anime }) {
  const sorted = [...anime.episodes].sort((a, b) => b.number - a.number);
  const first = sorted[sorted.length - 1];
  const latest = sorted[0];

  return (
    <section className="bg-[#141414] border border-[#2a2a2a] rounded-md p-3 sm:p-4 md:p-6">
      <h2 className="text-base sm:text-lg font-bold text-white mb-4">Episode {anime.title}</h2>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {first ? (
          <Link
            href={`/watch/${anime.id}/${first.id}`}
            className="flex flex-col items-center justify-center gap-1 bg-[#f45c43] hover:bg-[#e04a32] rounded-md py-3 sm:py-4 transition-colors"
          >
            <span className="text-[11px] sm:text-xs font-medium text-white/90">Episode Awal</span>
            <span className="text-sm sm:text-lg font-bold text-white">Episode {first.number.toString().padStart(2, "0")}</span>
          </Link>
        ) : (
          <div className="bg-[#1f1f1f] rounded-md py-4 flex items-center justify-center text-xs text-[#666]">-</div>
        )}
        {latest ? (
          <Link
            href={`/watch/${anime.id}/${latest.id}`}
            className="flex flex-col items-center justify-center gap-1 bg-[#f45c43] hover:bg-[#e04a32] rounded-md py-3 sm:py-4 transition-colors"
          >
            <span className="text-[11px] sm:text-xs font-medium text-white/90">Episode Baru</span>
            <span className="text-sm sm:text-lg font-bold text-white">Episode {latest.number}</span>
          </Link>
        ) : (
          <div className="bg-[#1f1f1f] rounded-md py-4 flex items-center justify-center text-xs text-[#666]">-</div>
        )}
      </div>

      {sorted.length ? (
        <div>
          <div className="grid grid-cols-[28px_1fr_40px] sm:grid-cols-[50px_1fr_60px_120px] gap-2 sm:gap-3 px-2 pb-2 text-xs font-semibold text-[#666] border-b border-[#2a2a2a]">
            <span>Ep</span>
            <span>Judul</span>
            <span>Sub</span>
            <span className="hidden sm:block text-right">Tanggal Rilis</span>
          </div>
          <div className="divide-y divide-[#232323]">
            {sorted.map((ep) => (
              <Link
                key={ep.id}
                href={`/watch/${anime.id}/${ep.id}`}
                className="grid grid-cols-[28px_1fr_40px] sm:grid-cols-[50px_1fr_60px_120px] items-center gap-2 sm:gap-3 py-3 px-2 hover:bg-[#1f1f1f] transition-colors"
              >
                <span className="text-xs sm:text-sm font-semibold text-white">{ep.number}</span>
                <span className="text-xs sm:text-sm text-[#c8c8c8] line-clamp-1">
                  {anime.title} Episode {ep.number} Subtitle Indonesia
                </span>
                <span className="bg-[#f5a623] text-white text-[10px] font-bold px-1.5 py-0.5 rounded w-fit">Sub</span>
                <span className="hidden sm:block text-xs text-[#888] text-right">{formatEn(ep.releaseDate)}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-[#666] text-center py-6">Belum ada episode.</p>
      )}
    </section>
  );
}
