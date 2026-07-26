"use client";

import { useMemo, useState } from "react";
import { Anime } from "@/types";
import { PosterCard } from "@/components/PosterCard";
import { RECOMMEND_GENRE_TABS } from "@/lib/seed-data";

export function GenreTabs({ animes }: { animes: Anime[] }) {
  const [active, setActive] = useState(RECOMMEND_GENRE_TABS[0]);

  const filtered = useMemo(
    () => animes.filter((a) => a.genre.some((g) => g.toLowerCase() === active.toLowerCase())).slice(0, 5),
    [animes, active]
  );

  return (
    <section>
      <h2 className="text-lg font-bold mb-3 text-white">Rekomendasi Genre</h2>
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {RECOMMEND_GENRE_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`relative px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
              active === tab ? "text-[#f45c43]" : "text-[#a0a0a0] hover:text-white"
            }`}
          >
            {tab}
            {active === tab && <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-[#f45c43] rounded-full" />}
          </button>
        ))}
      </div>
      {filtered.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {filtered.map((anime) => (
            <PosterCard key={anime.id} anime={anime} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#666] py-6 text-center">Belum ada donghua dengan genre {active}.</p>
      )}
    </section>
  );
}
