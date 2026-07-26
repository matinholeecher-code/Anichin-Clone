"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useData } from "@/lib/context/DataContext";
import { formatDate } from "@/lib/helpers";
import { Play, Bookmark, Share, Star } from "lucide-react";
import { TrailerModal } from "@/components/detail/TrailerModal";
import { EpisodeListTable } from "@/components/detail/EpisodeListTable";
import { CommentSection } from "@/components/CommentSection";
import { PosterCard } from "@/components/PosterCard";

export default function DonghuaDetailPage() {
  const params = useParams<{ id: string }>();
  const { animes, loading, toggleBookmark, isBookmarked } = useData();
  const [trailerOpen, setTrailerOpen] = useState(false);

  const anime = useMemo(() => animes.find((a) => a.id === params.id), [animes, params.id]);

  const recommendations = useMemo(() => {
    if (!anime) return [];
    return animes.filter((a) => a.id !== anime.id).slice(0, 5);
  }, [animes, anime]);

  if (loading) return <div className="text-center text-[#a0a0a0] py-20">Memuat data...</div>;

  if (!anime) {
    return (
      <div className="text-center py-20">
        <p className="text-[#a0a0a0] mb-4">Donghua tidak ditemukan.</p>
        <Link href="/donghua" className="text-[#f45c43] hover:underline">
          Kembali ke daftar donghua
        </Link>
      </div>
    );
  }

  const meta: [string, string][] = [
    ["Status", anime.status],
    ["Network", anime.network || "-"],
    ["Studio", anime.studio || "-"],
    ["Tanggal rilis", formatDate(anime.releaseDate)],
    ["Durasi", anime.duration || "-"],
    ["Season", anime.season || "-"],
    ["Negara", "China"],
    ["Tipe", anime.type],
    ["Episode", String(anime.episodes.length)],
    ["Subber", anime.subber || "-"],
    ["Diposting oleh", anime.postedBy || "-"],
    ["Ditambahkan", formatDate(anime.createdAt)],
    ["Diperbarui pada", formatDate(anime.updatedAt || anime.createdAt)],
  ];

  const fullStars = Math.round(anime.rating / 2);

  return (
    <div className="space-y-8">
      <nav className="text-xs text-[#a0a0a0]">
        <Link href="/" className="hover:text-[#f45c43]">
          Beranda
        </Link>{" "}
        &gt;{" "}
        <Link href="/donghua" className="hover:text-[#f45c43]">
          Donghua
        </Link>{" "}
        &gt; <span className="text-white">{anime.title}</span>
      </nav>

      <div className="relative rounded-md overflow-hidden border border-[#2a2a2a] -mb-16 md:-mb-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={anime.coverUrl} alt={anime.title} className="w-full h-40 md:h-56 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/40 to-transparent" />
      </div>

      <div className="flex flex-col md:flex-row gap-6 relative">
        <div className="w-full md:w-[220px] shrink-0 space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={anime.posterUrl}
            alt={anime.title}
            className="w-full md:w-[220px] aspect-[247/350] object-cover rounded-md border border-[#2a2a2a]"
          />
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < fullStars ? "text-[#f5a623]" : "text-[#333]"}`}
                  fill={i < fullStars ? "#f5a623" : "none"}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-white">{anime.rating.toFixed(2)}</span>
          </div>
          {anime.trailerUrl && (
            <button
              onClick={() => setTrailerOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-[#f45c43] hover:bg-[#e04a32] text-white text-sm font-semibold py-2 rounded transition-colors"
            >
              <Play className="w-4 h-4" fill="white" /> Trailer
            </button>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => toggleBookmark(anime.id)}
              className={`flex-1 flex items-center justify-center gap-2 border text-sm font-medium py-2 rounded transition-colors ${
                isBookmarked(anime.id)
                  ? "bg-[#f45c43] border-[#f45c43] text-white"
                  : "border-[#2a2a2a] text-[#a0a0a0] hover:text-white"
              }`}
            >
              <Bookmark className="w-4 h-4" /> Bookmark
            </button>
            <button className="flex items-center justify-center gap-2 border border-[#2a2a2a] text-[#a0a0a0] hover:text-white text-sm font-medium py-2 px-3 rounded transition-colors">
              <Share className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 min-w-0 md:pt-16">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1">{anime.title}</h1>
          {anime.altTitle && <p className="text-sm text-[#666] mb-3">{anime.altTitle}</p>}
          <p className="text-sm text-[#a0a0a0] mb-4 leading-relaxed">{anime.synopsis}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-4">
            {meta.map(([label, value]) => (
              <div key={label} className="flex items-center text-xs gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f45c43] shrink-0" />
                <span className="text-[#666] w-28 shrink-0">{label}</span>
                <span className="text-white">{value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {anime.genre.map((g) => (
              <Link
                key={g}
                href={`/donghua?genre=${encodeURIComponent(g)}`}
                className="bg-[#1f1f1f] border border-[#2a2a2a] hover:border-[#f45c43] hover:text-[#f45c43] text-[#a0a0a0] text-xs px-3 py-1 rounded-full transition-colors"
              >
                {g}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <EpisodeListTable anime={anime} />

      <CommentSection />

      {recommendations.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3 text-white">Rekomendasi</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {recommendations.map((a) => (
              <PosterCard key={a.id} anime={a} />
            ))}
          </div>
        </section>
      )}

      {anime.trailerUrl && (
        <TrailerModal open={trailerOpen} onClose={() => setTrailerOpen(false)} embedUrl={anime.trailerUrl} title={anime.title} />
      )}
    </div>
  );
}
