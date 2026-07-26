"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Flame } from "lucide-react";
import { Anime } from "@/types";

interface PosterCardProps {
  anime: Anime;
}

export function PosterCard({ anime }: PosterCardProps) {
  const latestEpisode = useMemo(() => {
    if (!anime.episodes.length) return undefined;
    return [...anime.episodes].sort((a, b) => b.number - a.number)[0];
  }, [anime.episodes]);

  const href = latestEpisode ? `/watch/${anime.id}/${latestEpisode.id}` : `/donghua/${anime.id}`;

  return (
    <article className="group fade-in">
      <Link href={href} className="block">
        <div className="relative aspect-[247/350] bg-[#1f1f1f] rounded-md overflow-hidden border border-[#2a2a2a]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={anime.posterUrl}
            alt={anime.title}
            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
          />

          {anime.status === "Completed" && (
            <span className="absolute top-2 -left-7 -rotate-45 bg-[#c0392b] text-white text-[8px] font-bold px-6 py-0.5 z-10">
              COMPLETED
            </span>
          )}

          <span className="absolute top-1.5 left-1.5 bg-[#f45c43] text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-0">
            {anime.type === "Movie" ? "Movie" : "Donghua"}
          </span>
          {anime.rating >= 8.5 && (
            <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center">
              <Flame className="text-[#e74c3c] w-3.5 h-3.5" />
            </span>
          )}

          <span className="absolute bottom-1.5 left-1.5 bg-[#c0392b] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            Ep {latestEpisode?.number ?? "TBA"}
          </span>
          <span className="absolute bottom-1.5 right-1.5 bg-[#f5a623] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            Sub
          </span>
        </div>
        <h3 className="mt-1.5 text-xs sm:text-sm font-semibold text-white text-center group-hover:text-[#f45c43] line-clamp-2 transition-colors">
          {anime.title}
        </h3>
      </Link>
    </article>
  );
}
