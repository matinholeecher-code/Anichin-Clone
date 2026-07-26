"use client";

import { useMemo, useState } from "react";
import { useData } from "@/lib/context/DataContext";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, Search } from "lucide-react";
import { EpisodeForm } from "@/components/admin/EpisodeForm";
import { Episode, ServerLink, DownloadLink } from "@/types";
import { formatDate } from "@/lib/helpers";

export default function AdminEpisodePage() {
  const { animes, loading, addEpisode, updateEpisode, deleteEpisode } = useData();
  const [animeSearch, setAnimeSearch] = useState("");
  const [episodeSearch, setEpisodeSearch] = useState("");
  const [selectedAnimeId, setSelectedAnimeId] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Episode | undefined>(undefined);

  const animeOptions = useMemo(() => {
    const q = animeSearch.trim().toLowerCase();
    if (!q) return animes;
    return animes.filter((a) => a.title.toLowerCase().includes(q));
  }, [animes, animeSearch]);

  const activeAnimeId = selectedAnimeId || animeOptions[0]?.id || "";
  const activeAnime = animes.find((a) => a.id === activeAnimeId);

  const episodes = useMemo(() => {
    if (!activeAnime) return [];
    const sorted = [...activeAnime.episodes].sort((a, b) => b.number - a.number);
    const q = episodeSearch.trim();
    if (!q) return sorted;
    return sorted.filter((ep) => String(ep.number).includes(q) || ep.title.toLowerCase().includes(q.toLowerCase()));
  }, [activeAnime, episodeSearch]);

  const openAdd = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  const openEdit = (ep: Episode) => {
    setEditing(ep);
    setFormOpen(true);
  };

  const handleSubmit = (data: {
    number: number;
    title: string;
    releaseDate: string;
    servers: ServerLink[];
    downloadLinks: DownloadLink[];
  }) => {
    if (!activeAnime) return;
    if (editing) {
      updateEpisode(activeAnime.id, editing.id, data);
    } else {
      addEpisode(activeAnime.id, data);
    }
  };

  const handleDelete = (ep: Episode) => {
    if (!activeAnime) return;
    const ok = window.confirm(`Hapus Episode ${ep.number} - "${ep.title}"?`);
    if (ok) deleteEpisode(activeAnime.id, ep.id);
  };

  if (loading) return <p className="text-[#a0a0a0]">Memuat data...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Kelola Episode</h1>
        <p className="text-sm text-[#a0a0a0] mt-1">Kelola episode, server streaming, dan link download per anime</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
          <input
            value={animeSearch}
            onChange={(e) => setAnimeSearch(e.target.value)}
            placeholder="Cari anime..."
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-md pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#f45c43]"
          />
        </div>
        <select
          value={activeAnimeId}
          onChange={(e) => setSelectedAnimeId(e.target.value)}
          className="bg-[#141414] border border-[#2a2a2a] rounded-md text-sm px-3 py-2"
        >
          {animeOptions.length ? (
            animeOptions.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title} ({a.episodes.length} ep)
              </option>
            ))
          ) : (
            <option value="">Tidak ditemukan</option>
          )}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
          <input
            value={episodeSearch}
            onChange={(e) => setEpisodeSearch(e.target.value)}
            placeholder="Cari nomor / judul episode..."
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-md pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#f45c43]"
          />
        </div>
        <Button onClick={openAdd} disabled={!activeAnime} className="bg-[#f45c43] hover:bg-[#e04a32] gap-2 sm:ml-auto">
          <Plus className="w-4 h-4" /> Tambah Episode
        </Button>
      </div>

      <div className="bg-[#141414] border border-[#2a2a2a] rounded-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a] text-left text-[#a0a0a0]">
              <th className="p-3 font-medium">No</th>
              <th className="p-3 font-medium">Episode</th>
              <th className="p-3 font-medium">Judul</th>
              <th className="p-3 font-medium">Jumlah Server</th>
              <th className="p-3 font-medium">Link Download</th>
              <th className="p-3 font-medium">Tgl Rilis</th>
              <th className="p-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {episodes.length ? (
              episodes.map((ep, idx) => (
                <tr key={ep.id} className="border-b border-[#2a2a2a] last:border-0 hover:bg-[#1f1f1f] transition-colors">
                  <td className="p-3 text-[#a0a0a0]">{idx + 1}</td>
                  <td className="p-3 text-white">Ep {ep.number}</td>
                  <td className="p-3 text-[#a0a0a0] max-w-[200px] truncate">{ep.title || "-"}</td>
                  <td className="p-3 text-[#a0a0a0]">{ep.servers.length}</td>
                  <td className="p-3 text-[#a0a0a0]">{ep.downloadLinks?.length || 0}</td>
                  <td className="p-3 text-[#a0a0a0]">{formatDate(ep.releaseDate)}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(ep)}
                        className="p-2 rounded bg-[#1f1f1f] border border-[#2a2a2a] hover:border-[#f45c43] transition-colors"
                        aria-label="Edit"
                      >
                        <Edit className="w-4 h-4 text-[#a0a0a0]" />
                      </button>
                      <button
                        onClick={() => handleDelete(ep)}
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
                <td colSpan={7} className="p-6 text-center text-[#666]">
                  Belum ada episode untuk anime ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <EpisodeForm open={formOpen} onOpenChange={setFormOpen} initialData={editing} onSubmit={handleSubmit} />
    </div>
  );
}
