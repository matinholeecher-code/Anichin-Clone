"use client";

import Link from "next/link";
import { Anime } from "@/types";
import { formatDate } from "@/lib/helpers";

export function EpisodeSidebarList({ anime, currentEpisodeId }: { anime: Anime; currentEpisodeId: string }) {
  const sorted = [...anime.episodes].sort((a, b) => b.number - a.number);

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-md p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Semua Episode</h3>
        <div className="space-y-2 max-h-[520px] overflow-y-auto scrollbar-thin pr-1">
          {sorted.map((ep) => {
            const active = ep.id === currentEpisodeId;
            return (
              <Link
                key={ep.id}
                href={`/watch/${anime.id}/${ep.id}`}
                className={`flex items-center gap-3 rounded-md p-2 transition-colors ${
                  active ? "border border-[#f45c43] bg-[#1f1f1f]" : "border border-transparent hover:bg-[#1f1f1f]"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={anime.posterUrl}
                  alt={anime.title}
                  width={84}
                  height={98}
                  className="w-[60px] h-[70px] object-cover rounded shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white">Ep {ep.number}</p>
                  <p className="text-[11px] text-[#a0a0a0] line-clamp-1">{ep.title}</p>
                  <p className="text-[10px] text-[#666] mt-0.5">{formatDate(ep.releaseDate)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
