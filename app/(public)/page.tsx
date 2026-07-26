"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useData } from "@/lib/context/DataContext";
import { PosterCard } from "@/components/PosterCard";
import { HeroSlider } from "@/components/home/HeroSlider";
import { ScheduleStrip } from "@/components/home/ScheduleStrip";

const POSTER_GRID = "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4";

export default function HomePage() {
  const { animes, loading } = useData();

  const ongoing = useMemo(() => animes.filter((a) => a.status === "Ongoing"), [animes]);
  const heroList = useMemo(() => {
    const flagged = animes.filter((a) => a.showInSlider);
    return (flagged.length ? flagged : [...animes].sort((a, b) => b.rating - a.rating)).slice(0, 8);
  }, [animes]);
  const popularToday = useMemo(() => [...animes].sort((a, b) => b.rating - a.rating).slice(0, 5), [animes]);
  const movies = useMemo(() => animes.filter((a) => a.type === "Movie").slice(0, 5), [animes]);
  const upcoming = useMemo(() => animes.filter((a) => a.status === "Upcoming").slice(0, 6), [animes]);

  const latestReleases = useMemo(() => {
    const withLatestEp = animes
      .map((a) => {
        const latest = [...a.episodes].sort((x, y) => y.releaseDate.localeCompare(x.releaseDate))[0];
        return { anime: a, releaseDate: latest?.releaseDate || a.releaseDate };
      })
      .sort((x, y) => y.releaseDate.localeCompare(x.releaseDate))
      .slice(0, 20);
    return withLatestEp.map((x) => x.anime);
  }, [animes]);

  if (loading) {
    return <div className="text-center text-[#a0a0a0] py-20">Memuat data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#d9f0f2] border border-[#b8dde0] rounded-md p-5 text-center">
        <h2 className="text-lg font-bold text-[#0d4f52] mb-1">Anichin - Fansub Donghua Sub Indo</h2>
        <p className="text-xs text-[#0d4f52]/80">
          Bantu kami dengan rekomendasikan Anichin di media sosial dan teman-teman kalian.
        </p>
      </div>

      <ScheduleStrip ongoing={ongoing} />

      <HeroSlider animes={heroList} />

      <section className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-4">
        <h2 className="text-lg font-bold mb-3 text-white">Terpopuler Hari Ini</h2>
        <div className="grid grid-cols-5 gap-3 sm:gap-4">
          {popularToday.map((anime) => (
            <PosterCard key={anime.id} anime={anime} />
          ))}
        </div>
      </section>

      <section className="bg-[#12181c] border border-[#233038] rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white">Rilisan Terbaru</h2>
          <Link href="/donghua" className="text-xs text-[#f45c43] hover:underline">
            Lihat Semua
          </Link>
        </div>
        <div className={POSTER_GRID}>
          {latestReleases.map((anime) => (
            <PosterCard key={anime.id} anime={anime} />
          ))}
        </div>
      </section>

      {movies.length > 0 && (
        <section className="bg-[#1a1420] border border-[#2f2438] rounded-lg p-4">
          <h2 className="text-lg font-bold mb-3 text-white">Movie</h2>
          <div className="grid grid-cols-5 gap-3 sm:gap-4">
            {movies.map((anime) => (
              <PosterCard key={anime.id} anime={anime} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="bg-[#141d14] border border-[#22331f] rounded-lg p-4">
          <h2 className="text-lg font-bold mb-3 text-white">Upcoming</h2>
          <div className={POSTER_GRID}>
            {upcoming.map((anime) => (
              <PosterCard key={anime.id} anime={anime} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-4">
        <h2 className="text-lg font-bold mb-3 text-white">Blog Terbaru</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: "Tips: Cari Donghua Legal",
              body: "Panduan singkat menemukan sumber donghua legal terpercaya agar mendukung industri kreator dan menghindari konten bajakan.",
            },
            {
              title: "Rekomendasi Donghua Rating Tinggi 2026",
              body: "Kumpulan judul donghua dengan rating terbaik tahun ini yang wajib masuk watchlist kamu.",
            },
          ].map((post) => (
            <Link
              key={post.title}
              href="/donghua"
              className="block bg-[#1f1f1f] border border-[#2a2a2a] rounded-md p-4 hover:border-[#f45c43] transition-colors"
            >
              <h3 className="font-semibold text-white mb-2">{post.title}</h3>
              <p className="text-xs text-[#a0a0a0] line-clamp-3">{post.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
