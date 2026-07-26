"use client";

import Link from "next/link";
import { useData } from "@/lib/context/DataContext";
import { useSidebarWidget } from "@/lib/context/SidebarWidgetContext";
import { formatDate } from "@/lib/helpers";

export function WatchSidebarWidget() {
  const { widget } = useSidebarWidget();
  const { animes } = useData();

  if (!widget) return null;
  const anime = animes.find((a) => a.id === widget.animeId);
  if (!anime) return null;

  const sortedEpisodes = [...anime.episodes].sort((a, b) => b.number - a.number);
  const currentEp = sortedEpisodes.find((e) => e.id === widget.currentEpisodeId);
  const recent = sortedEpisodes.slice(0, 4);

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-md p-4 space-y-4">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={anime.posterUrl}
          alt={anime.title}
          className="w-12 h-12 rounded-full object-cover border border-[#2a2a2a] shrink-0"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white line-clamp-1">{anime.title}</p>
          <p className="text-xs">
            <span className="text-[#f5a623] font-medium">{anime.status}</span>
            <span className="text-[#666]"> &middot; {currentEp?.number ?? "-"}/{anime.episodes.length}</span>
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {recent.map((ep) => (
          <Link
            key={ep.id}
            href={`/watch/${anime.id}/${ep.id}`}
            className={`flex items-center gap-2.5 rounded p-1.5 transition-colors ${
              ep.id === widget.currentEpisodeId ? "bg-[#1f1f1f]" : "hover:bg-[#1f1f1f]"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={anime.posterUrl} alt={anime.title} className="w-12 h-12 rounded object-cover shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-white line-clamp-2">
                {anime.title} Episode {ep.number} Subtitle Indonesia
              </p>
              <p className="text-[10px] text-[#666]">
                Eps {ep.number} &middot; {formatDate(ep.releaseDate)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
