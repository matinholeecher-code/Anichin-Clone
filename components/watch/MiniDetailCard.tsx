"use client";

import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Anime } from "@/types";
import { formatDate } from "@/lib/helpers";

export function MiniDetailCard({ anime }: { anime: Anime }) {
  const [expanded, setExpanded] = useState(false);
  const fullStars = Math.round(anime.rating / 2);

  const leftMeta: [string, string][] = [
    ["Status", anime.status],
    ["Durasi", anime.duration || "-"],
    ["Episode", String(anime.totalEpisodes || anime.episodes.length)],
    ["Tanggal rilis", formatDate(anime.releaseDate)],
    ["Tipe", anime.type],
  ];
  const rightMeta: [string, string][] = [
    ["Studio", anime.studio || "-"],
    ["Negara", "China"],
    ["Network", anime.network || "-"],
    ["Season", anime.season || "-"],
    ["Subber", anime.subber || "-"],
  ];

  return (
    <section className="bg-[#141414] border border-[#2a2a2a] rounded-md p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={anime.posterUrl}
          alt={anime.title}
          className="w-20 sm:w-24 aspect-[247/350] object-cover rounded shrink-0 border border-[#2a2a2a]"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <Link href={`/donghua/${anime.id}`} className="font-bold text-white hover:text-[#f45c43] line-clamp-1">
                {anime.title}
              </Link>
              {anime.altTitle && <p className="text-xs text-[#666]">{anime.altTitle}</p>}
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < fullStars ? "text-[#f5a623]" : "text-[#333]"}`}
                  fill={i < fullStars ? "#f5a623" : "none"}
                />
              ))}
              <span className="text-xs text-white ml-1">{anime.rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
            <div className="space-y-1.5">
              {leftMeta.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[20px_80px_1fr] items-center text-[11px]">
                  <span className="w-1 h-1 rounded-full bg-[#f45c43]" />
                  <span className="text-[#666]">{label}</span>
                  <span className="text-white line-clamp-1">{value}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              {rightMeta.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[20px_80px_1fr] items-center text-[11px]">
                  <span className="w-1 h-1 rounded-full bg-[#f45c43]" />
                  <span className="text-[#666]">{label}</span>
                  <span className="text-white line-clamp-1">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {anime.genre.map((g) => (
              <Link
                key={g}
                href={`/donghua?genre=${encodeURIComponent(g)}`}
                className="bg-[#1f1f1f] border border-[#2a2a2a] hover:border-[#f45c43] hover:text-[#f45c43] text-[#a0a0a0] text-[10px] px-2 py-0.5 rounded-full transition-colors"
              >
                {g}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <p className={`text-xs text-[#a0a0a0] mt-3 leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>{anime.synopsis}</p>
      <button onClick={() => setExpanded((v) => !v)} className="mt-1 text-[11px] text-[#f45c43] hover:underline">
        {expanded ? "Sembunyikan" : "Selengkapnya"}
      </button>
    </section>
  );
}
