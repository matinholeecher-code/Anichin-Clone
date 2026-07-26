"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useData } from "@/lib/context/DataContext";
import { PosterCard } from "@/components/PosterCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AZ = ["All", "#", "0-9", ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];
const PAGE_SIZE = 10;

interface ArchiveGridProps {
  title: string;
  presetStatus?: string;
  presetType?: string;
}

function ArchiveGridContent({ title, presetStatus, presetType }: ArchiveGridProps) {
  const { animes } = useData();
  const searchParams = useSearchParams();
  const [letter, setLetter] = useState("All");
  const [page, setPage] = useState(1);

  const search = searchParams.get("search")?.toLowerCase() || "";
  const genreParam = searchParams.get("genre");
  const studioParam = searchParams.get("studio");
  const statusParam = presetStatus || searchParams.get("status") || "";
  const typeParam = presetType || searchParams.get("type") || "";
  const orderParam = searchParams.get("order") || "terbaru";
  const letterParam = searchParams.get("letter") || searchParams.get("show");

  const filtered = useMemo(() => {
    let list = [...animes];
    if (search) list = list.filter((a) => a.title.toLowerCase().includes(search));
    if (genreParam) {
      const genres = genreParam.split(",");
      list = list.filter((a) => a.genre.some((g) => genres.includes(g)));
    }
    if (studioParam) list = list.filter((a) => a.studio === studioParam);
    if (statusParam) list = list.filter((a) => a.status === statusParam);
    if (typeParam) list = list.filter((a) => a.type === typeParam);
    const activeLetter = letterParam || (letter !== "All" ? letter : "");
    if (activeLetter) {
      if (activeLetter === "#") {
        list = list.filter((a) => !/^[a-zA-Z0-9]/.test(a.title));
      } else if (activeLetter === "0-9") {
        list = list.filter((a) => /^[0-9]/.test(a.title));
      } else {
        list = list.filter((a) => a.title.toUpperCase().startsWith(activeLetter));
      }
    }
    if (orderParam === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (orderParam === "judul") list.sort((a, b) => a.title.localeCompare(b.title));
    else list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    return list;
  }, [animes, search, genreParam, studioParam, statusParam, typeParam, orderParam, letter, letterParam]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeLetterDisplay = letterParam || letter;

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-white">{title}</h1>

      <div className="flex flex-wrap gap-1.5">
        {AZ.map((l) => (
          <button
            key={l}
            onClick={() => {
              setLetter(l);
              setPage(1);
            }}
            className={`px-2.5 py-1.5 rounded text-xs font-medium border transition-colors ${
              activeLetterDisplay === l
                ? "bg-[#f45c43] border-[#f45c43] text-white"
                : "bg-[#141414] border-[#2a2a2a] text-[#a0a0a0] hover:text-white"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {paginated.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {paginated.map((anime) => (
            <PosterCard key={anime.id} anime={anime} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#666] py-10 text-center">Tidak ada donghua ditemukan.</p>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="w-8 h-8 flex items-center justify-center rounded bg-[#141414] border border-[#2a2a2a] disabled:opacity-30 hover:border-[#f45c43] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-[#a0a0a0]">
            Halaman {page} dari {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="w-8 h-8 flex items-center justify-center rounded bg-[#141414] border border-[#2a2a2a] disabled:opacity-30 hover:border-[#f45c43] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export function ArchiveGrid(props: ArchiveGridProps) {
  return (
    <Suspense fallback={<div className="p-10 text-center text-[#a0a0a0]">Memuat data...</div>}>
      <ArchiveGridContent {...props} />
    </Suspense>
  );
}
