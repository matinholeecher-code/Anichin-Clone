"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useData } from "@/lib/context/DataContext";
import { useSidebarWidget } from "@/lib/context/SidebarWidgetContext";
import { formatDate } from "@/lib/helpers";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { ServerPlayer } from "@/components/watch/ServerPlayer";
import { PlayerGuideBox } from "@/components/watch/PlayerGuideBox";
import { DownloadSection } from "@/components/watch/DownloadSection";
import { MiniDetailCard } from "@/components/watch/MiniDetailCard";
import { ShareRow } from "@/components/watch/ShareRow";
import { CommentSection } from "@/components/CommentSection";

export default function WatchPage() {
  const params = useParams<{ animeId: string; episodeId: string }>();
  const { animes, loading, addHistoryEntry } = useData();
  const { setWidget } = useSidebarWidget();

  const anime = useMemo(() => animes.find((a) => a.id === params.animeId), [animes, params.animeId]);
  const sortedEpisodes = useMemo(
    () => (anime ? [...anime.episodes].sort((a, b) => a.number - b.number) : []),
    [anime]
  );
  const episodeIndex = sortedEpisodes.findIndex((e) => e.id === params.episodeId);
  const episode = episodeIndex >= 0 ? sortedEpisodes[episodeIndex] : undefined;
  const prevEp = episodeIndex > 0 ? sortedEpisodes[episodeIndex - 1] : undefined;
  const nextEp = episodeIndex >= 0 && episodeIndex < sortedEpisodes.length - 1 ? sortedEpisodes[episodeIndex + 1] : undefined;

  useEffect(() => {
    if (anime && episode) {
      addHistoryEntry({
        animeId: anime.id,
        episodeId: episode.id,
        animeTitle: anime.title,
        episodeNumber: episode.number,
        posterUrl: anime.posterUrl,
      });
      setWidget({ animeId: anime.id, currentEpisodeId: episode.id });
    }
    return () => setWidget(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anime?.id, episode?.id]);

  if (loading) return <div className="text-center text-[#a0a0a0] py-20">Memuat data...</div>;

  if (!anime || !episode) {
    return (
      <div className="text-center py-20">
        <p className="text-[#a0a0a0] mb-4">Episode tidak ditemukan.</p>
        <Link href="/donghua" className="text-[#f45c43] hover:underline">
          Kembali ke daftar donghua
        </Link>
      </div>
    );
  }

  const pageTitle = `${anime.title} Episode ${episode.number} Subtitle Indonesia`;
  const prevBaseClass = "flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded transition-colors";
  const disabledClass = "bg-[#1f1f1f] text-[#555] opacity-50 pointer-events-none";
  const enabledClass = "bg-[#1f1f1f] border border-[#2a2a2a] text-white hover:border-[#f45c43]";

  return (
    <div className="space-y-6">
      <nav className="text-xs text-[#a0a0a0] flex-wrap break-words">
        <Link href="/" className="hover:text-[#f45c43]">
          Home
        </Link>{" "}
        &gt;{" "}
        <Link href={`/donghua/${anime.id}`} className="hover:text-[#f45c43]">
          {anime.title}
        </Link>{" "}
        &gt; <span className="text-white">{pageTitle}</span>
      </nav>

      <div>
        <h1 className="text-lg md:text-xl font-bold text-white leading-snug mb-2">{pageTitle}</h1>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#a0a0a0]">
            <span className="bg-[#f5a623] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Sub</span>
            <span>
              Dirilis pada {formatDate(episode.releaseDate)} &middot; Diposting oleh{" "}
              <span className="text-white font-medium">{anime.postedBy || "Admin"}</span> &middot; series{" "}
              <Link href={`/donghua/${anime.id}`} className="text-white hover:text-[#f45c43]">
                {anime.title}
              </Link>
            </span>
          </div>
          <ShareRow title={pageTitle} />
        </div>
      </div>

      <ServerPlayer servers={episode.servers} />

      <PlayerGuideBox servers={episode.servers} />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href={prevEp ? `/watch/${anime.id}/${prevEp.id}` : "#"}
          aria-disabled={!prevEp}
          className={`${prevBaseClass} ${prevEp ? enabledClass : disabledClass}`}
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </Link>
        <Link
          href={`/donghua/${anime.id}`}
          className="flex items-center gap-1 bg-[#f45c43] hover:bg-[#e04a32] text-white text-xs font-semibold px-4 py-2 rounded transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" /> Semua Episode
        </Link>
        <Link
          href={nextEp ? `/watch/${anime.id}/${nextEp.id}` : "#"}
          aria-disabled={!nextEp}
          className={`${prevBaseClass} ${nextEp ? enabledClass : disabledClass}`}
        >
          Next <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <DownloadSection animeTitle={anime.title} episodeNumber={episode.number} links={episode.downloadLinks || []} />

      <MiniDetailCard anime={anime} />

      <CommentSection />
    </div>
  );
}
