"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useData } from "@/lib/context/DataContext";
import { GENRE_LIST, SEASON_LIST } from "@/lib/seed-data";
import { timeAgo } from "@/lib/helpers";
import { Clock } from "lucide-react";
import { SocialIconRow } from "@/components/SocialIconRow";

export function Sidebar() {
  const { animes, history } = useData();
  const router = useRouter();
  const [genre, setGenre] = useState("All");
  const [season, setSeason] = useState("All");
  const [studio, setStudio] = useState("All");
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [orderBy, setOrderBy] = useState("Default");
  const [popularTab, setPopularTab] = useState<"mingguan" | "bulanan" | "semua">("mingguan");

  const studioList = useMemo(() => Array.from(new Set(animes.map((a) => a.studio).filter(Boolean))), [animes]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (genre !== "All") params.set("genre", genre);
    if (status !== "All") params.set("status", status);
    if (type !== "All") params.set("type", type);
    if (studio !== "All") params.set("studio", studio);
    if (orderBy !== "Default") params.set("order", orderBy.toLowerCase());
    router.push(`/donghua?${params.toString()}`);
  };

  const popular = useMemo(() => [...animes].sort((a, b) => b.rating - a.rating).slice(0, 10), [animes, popularTab]);
  const newest = useMemo(
    () => [...animes].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")).slice(0, 6),
    [animes]
  );

  const selectClass =
    "w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded text-xs text-white px-2 py-2 focus:outline-none focus:border-[#f45c43]";

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6">
      {/* Filter Search */}
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-md p-4">
        <h3 className="font-semibold text-sm mb-3 text-white">Filter Search</h3>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <select value={genre} onChange={(e) => setGenre(e.target.value)} className={selectClass}>
            <option value="All">Genre All</option>
            {GENRE_LIST.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <select value={season} onChange={(e) => setSeason(e.target.value)} className={selectClass}>
            <option value="All">Season All</option>
            {SEASON_LIST.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select value={studio} onChange={(e) => setStudio(e.target.value)} className={selectClass}>
            <option value="All">Studio All</option>
            {studioList.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
            <option value="All">Status All</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Dropped">Dropped</option>
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
            <option value="All">Type All</option>
            <option value="Donghua">Donghua</option>
            <option value="Movie">Movie</option>
          </select>
          <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)} className={selectClass}>
            <option value="Default">Order by Default</option>
            <option value="rating">Rating Tertinggi</option>
            <option value="judul">Judul A-Z</option>
            <option value="terbaru">Terbaru</option>
          </select>
        </div>
        <button
          onClick={handleSearch}
          className="w-full bg-[#f45c43] hover:bg-[#e04a32] text-white text-sm font-semibold py-2 rounded transition-colors"
        >
          Search
        </button>
      </div>

      {/* Riwayat Menonton */}
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-md p-4">
        <h3 className="font-semibold text-sm mb-3 text-white">Riwayat Menonton</h3>
        {history.length ? (
          <ul className="space-y-3">
            {history.slice(0, 5).map((h) => (
              <li key={h.episodeId}>
                <Link href={`/watch/${h.animeId}/${h.episodeId}`} className="group block">
                  <p className="text-xs font-medium text-white group-hover:text-[#f45c43] line-clamp-1 transition-colors">
                    {h.animeTitle} Episode {h.episodeNumber}
                  </p>
                  <p className="text-[10px] text-[#666]">{timeAgo(h.watchedAt)}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-[#666] flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" /> Belum ada riwayat menonton.
          </p>
        )}
      </div>

      <SocialIconRow />

      {/* Populer */}
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-md p-4">
        <h3 className="font-semibold text-sm mb-3 text-white">Populer</h3>
        <div className="flex gap-1 mb-3 bg-[#1f1f1f] rounded p-1">
          {(["mingguan", "bulanan", "semua"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setPopularTab(tab)}
              className={`flex-1 text-[10px] font-semibold py-1.5 rounded capitalize transition-colors ${
                popularTab === tab ? "bg-[#f45c43] text-white" : "text-[#a0a0a0]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <ol className="space-y-3">
          {popular.map((anime, idx) => (
            <li key={anime.id}>
              <Link href={`/donghua/${anime.id}`} className="flex items-center gap-2 group">
                <span className="text-sm font-bold text-[#666] w-4">{idx + 1}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={anime.posterUrl}
                  alt={anime.title}
                  width={65}
                  height={85}
                  className="w-[45px] h-[60px] object-cover rounded shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-white group-hover:text-[#f45c43] line-clamp-2 transition-colors">
                    {anime.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#f45c43] rounded-full"
                        style={{ width: `${(anime.rating / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-[#a0a0a0]">{anime.rating.toFixed(1)}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      {/* Donghua Baru */}
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-md p-4">
        <h3 className="font-semibold text-sm mb-3 text-white">Donghua Baru</h3>
        <div className="space-y-3">
          {newest.map((anime) => (
            <Link key={anime.id} href={`/donghua/${anime.id}`} className="flex items-center gap-2 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={anime.posterUrl}
                alt={anime.title}
                width={56}
                height={80}
                className="w-14 h-20 object-cover rounded shrink-0"
              />
              <p className="text-xs font-medium text-white group-hover:text-[#f45c43] line-clamp-3 transition-colors">
                {anime.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
