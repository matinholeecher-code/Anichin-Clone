"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Anime } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function HeroSlider({ animes }: { animes: Anime[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (animes.length < 2) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % animes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [animes.length]);

  if (!animes.length) return null;
  const anime = animes[index];

  return (
    <div className="relative w-full aspect-[16/7] md:aspect-[21/7] rounded-lg overflow-hidden border border-[#2a2a2a] bg-[#141414]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img key={anime.id} src={anime.coverUrl} alt={anime.title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex items-end justify-between gap-4">
        <h2 className="text-lg md:text-2xl font-extrabold text-white line-clamp-2">{anime.title}</h2>
        <Link
          href={`/donghua/${anime.id}`}
          className="shrink-0 inline-block bg-[#f45c43] hover:bg-[#e04a32] text-white text-sm font-semibold px-5 py-2 rounded transition-colors"
        >
          Lihat Detail
        </Link>
      </div>

      {animes.length > 1 && (
        <>
          <button
            onClick={() => setIndex((index - 1 + animes.length) % animes.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-[#f45c43] transition-colors"
            aria-label="Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIndex((index + 1) % animes.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-[#f45c43] transition-colors"
            aria-label="Berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute top-3 right-3 flex gap-1.5">
            {animes.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === index ? "bg-[#f45c43]" : "bg-white/40"}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
