"use client";

import { useMemo, useState } from "react";
import { useData } from "@/lib/context/DataContext";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, Star, Search } from "lucide-react";
import { AnimeForm } from "@/components/admin/AnimeForm";
import { Anime } from "@/types";

export default function AdminAnimePage() {
  const { animes, loading, addAnime, updateAnime, deleteAnime } = useData();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Anime | undefined>(undefined);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return animes;
    return animes.filter((a) => a.title.toLowerCase().includes(q) || a.altTitle?.toLowerCase().includes(q));
  }, [animes, search]);

  const openAdd = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  const openEdit = (anime: Anime) => {
    setEditing(anime);
    setFormOpen(true);
  };

  const handleSubmit = (data: Omit<Anime, "id" | "episodes" | "createdAt"> & { totalEpisodes: number }) => {
    if (editing) {
      updateAnime(editing.id, data);
    } else {
      addAnime(data);
    }
  };

  const handleDelete = (anime: Anime) => {
    const ok = window.confirm(
      `Hapus "${anime.title}" beserta ${anime.episodes.length} episode terkait? Tindakan ini tidak dapat dibatalkan.`
    );
    if (ok) deleteAnime(anime.id);
  };

  const toggleSlider = (anime: Anime) => {
    updateAnime(anime.id, { showInSlider: !anime.showInSlider });
  };

  if (loading) return <p className="text-[#a0a0a0]">Memuat data...</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Kelola Anime</h1>
          <p className="text-sm text-[#a0a0a0] mt-1">
            {filtered.length} dari {animes.length} anime &middot; realtime Firebase RTDB
          </p>
        </div>
        <Button onClick={openAdd} className="bg-[#f45c43] hover:bg-[#e04a32] gap-2">
          <Plus className="w-4 h-4" /> Tambah Anime
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari judul anime..."
          className="w-full bg-[#141414] border border-[#2a2a2a] rounded-md pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#f45c43]"
        />
      </div>

      <div className="bg-[#141414] border border-[#2a2a2a] rounded-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a] text-left text-[#a0a0a0]">
              <th className="p-3 font-medium">Thumbnail</th>
              <th className="p-3 font-medium">Judul</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Episode</th>
              <th className="p-3 font-medium">Jadwal</th>
              <th className="p-3 font-medium">Rating</th>
              <th className="p-3 font-medium">Slider</th>
              <th className="p-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? (
              filtered.map((a) => (
                <tr key={a.id} className="border-b border-[#2a2a2a] last:border-0 hover:bg-[#1f1f1f] transition-colors">
                  <td className="p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.posterUrl} alt={a.title} className="w-10 h-14 object-cover rounded" />
                  </td>
                  <td className="p-3 text-white max-w-[220px]">
                    <p className="line-clamp-1">{a.title}</p>
                    <p className="text-xs text-[#666]">{a.type}</p>
                  </td>
                  <td className="p-3">
                    <span className="bg-[#1f1f1f] border border-[#2a2a2a] px-2 py-1 rounded text-xs text-[#a0a0a0]">
                      {a.status}
                    </span>
                  </td>
                  <td className="p-3 text-[#a0a0a0]">{a.episodes.length}</td>
                  <td className="p-3 text-[#a0a0a0] text-xs">
                    {a.releaseDay ? `${a.releaseDay} ${a.releaseTime || ""}` : "-"}
                  </td>
                  <td className="p-3 text-[#a0a0a0]">{a.rating.toFixed(1)}</td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleSlider(a)}
                      className={`p-2 rounded border transition-colors ${
                        a.showInSlider
                          ? "bg-[#f45c43] border-[#f45c43] text-white"
                          : "bg-[#1f1f1f] border-[#2a2a2a] text-[#666] hover:text-white"
                      }`}
                      aria-label="Toggle slider"
                      title="Tampilkan di banner slider beranda"
                    >
                      <Star className="w-4 h-4" fill={a.showInSlider ? "white" : "none"} />
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(a)}
                        className="p-2 rounded bg-[#1f1f1f] border border-[#2a2a2a] hover:border-[#f45c43] transition-colors"
                        aria-label="Edit"
                      >
                        <Edit className="w-4 h-4 text-[#a0a0a0]" />
                      </button>
                      <button
                        onClick={() => handleDelete(a)}
                        className="p-2 rounded bg-[#1f1f1f] border border-[#2a2a2a] hover:border-red-500 transition-colors"
                        aria-label="Hapus"
                      >
                        <Trash className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-6 text-center text-[#666]">
                  Tidak ada anime yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimeForm open={formOpen} onOpenChange={setFormOpen} initialData={editing} onSubmit={handleSubmit} />
    </div>
  );
}
