"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Episode, ServerLink, DownloadRow } from "@/types";
import { Plus, Trash } from "lucide-react";

interface EpisodeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Episode;
  onSubmit: (data: { number: number; title: string; releaseDate: string; servers: ServerLink[]; downloadLinks: DownloadRow[] }) => void;
}

const RESOLUTION_OPTIONS = ["360p", "480p", "720p", "1080p", "4K"];
const EMPTY_ROW: DownloadRow = { resolution: "720p", links: [{ label: "", url: "" }, { label: "", url: "" }, { label: "", url: "" }] };

function ensureThreeLinks(row: DownloadRow): DownloadRow {
  const links = [...row.links];
  while (links.length < 3) links.push({ label: "", url: "" });
  return { ...row, links: links.slice(0, 3) };
}

export function EpisodeForm({ open, onOpenChange, initialData, onSubmit }: EpisodeFormProps) {
  const [number, setNumber] = useState("1");
  const [title, setTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [servers, setServers] = useState<ServerLink[]>([{ name: "", embedUrl: "" }]);
  const [downloads, setDownloads] = useState<DownloadRow[]>([EMPTY_ROW]);

  useEffect(() => {
    if (initialData) {
      setNumber(String(initialData.number));
      setTitle(initialData.title);
      setReleaseDate(initialData.releaseDate);
      setServers(initialData.servers.length ? initialData.servers : [{ name: "", embedUrl: "" }]);
      setDownloads(
        initialData.downloadLinks && initialData.downloadLinks.length
          ? initialData.downloadLinks.map(ensureThreeLinks)
          : [EMPTY_ROW]
      );
    } else {
      setNumber("1");
      setTitle("");
      setReleaseDate("");
      setServers([{ name: "", embedUrl: "" }]);
      setDownloads([EMPTY_ROW]);
    }
  }, [initialData, open]);

  const updateServer = (idx: number, field: keyof ServerLink, value: string) => {
    setServers((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };
  const addServer = () => setServers((prev) => [...prev, { name: "", embedUrl: "" }]);
  const removeServer = (idx: number) => setServers((prev) => prev.filter((_, i) => i !== idx));

  const updateRowResolution = (rowIdx: number, resolution: string) => {
    setDownloads((prev) => prev.map((r, i) => (i === rowIdx ? { ...r, resolution } : r)));
  };
  const updateRowLink = (rowIdx: number, linkIdx: number, field: "label" | "url", value: string) => {
    setDownloads((prev) =>
      prev.map((r, i) =>
        i === rowIdx ? { ...r, links: r.links.map((l, j) => (j === linkIdx ? { ...l, [field]: value } : l)) } : r
      )
    );
  };
  const addRow = () => setDownloads((prev) => [...prev, EMPTY_ROW]);
  const removeRow = (idx: number) => setDownloads((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number.trim()) {
      alert("Episode Number wajib diisi.");
      return;
    }
    const validServers = servers.filter((s) => s.name.trim() && s.embedUrl.trim());
    const validDownloads: DownloadRow[] = downloads
      .map((row) => ({ resolution: row.resolution, links: row.links.filter((l) => l.label.trim() && l.url.trim()) }))
      .filter((row) => row.links.length > 0);
    onSubmit({ number: Number(number) || 0, title: title.trim(), releaseDate, servers: validServers, downloadLinks: validDownloads });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#141414] border-[#2a2a2a] text-white max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Episode" : "Tambah Episode"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Episode Number *</Label>
              <Input
                type="number"
                min={0}
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
                className="bg-[#1f1f1f] border-[#2a2a2a]"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Judul Episode</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-[#1f1f1f] border-[#2a2a2a]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Tanggal Rilis</Label>
            <Input
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className="bg-[#1f1f1f] border-[#2a2a2a]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Server Links (Streaming)</Label>
              <Button type="button" size="sm" onClick={addServer} className="bg-[#1f1f1f] border border-[#2a2a2a] hover:border-[#f45c43] gap-1">
                <Plus className="w-3.5 h-3.5" /> Server
              </Button>
            </div>
            <div className="space-y-2">
              {servers.map((s, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input
                    placeholder="Nama Server (mis: YouTube)"
                    value={s.name}
                    onChange={(e) => updateServer(idx, "name", e.target.value)}
                    className="bg-[#1f1f1f] border-[#2a2a2a] w-40 shrink-0"
                  />
                  <Input
                    placeholder="Embed URL eksternal (https://...)"
                    value={s.embedUrl}
                    onChange={(e) => updateServer(idx, "embedUrl", e.target.value)}
                    className="bg-[#1f1f1f] border-[#2a2a2a] flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeServer(idx)}
                    className="p-2 rounded bg-[#1f1f1f] border border-[#2a2a2a] hover:border-red-500 shrink-0"
                    aria-label="Hapus server"
                  >
                    <Trash className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Link Download (per resolusi, hingga 3 link opsional)</Label>
              <Button type="button" size="sm" onClick={addRow} className="bg-[#1f1f1f] border border-[#2a2a2a] hover:border-[#f45c43] gap-1">
                <Plus className="w-3.5 h-3.5" /> Resolusi
              </Button>
            </div>
            <div className="space-y-3">
              {downloads.map((row, rowIdx) => (
                <div key={rowIdx} className="border border-[#2a2a2a] rounded-md p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <select
                      value={row.resolution}
                      onChange={(e) => updateRowResolution(rowIdx, e.target.value)}
                      className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-md text-sm px-2 py-1.5 w-24 shrink-0"
                    >
                      {RESOLUTION_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <span className="text-xs text-[#666] flex-1">Isi salah satu, dua, atau tiga link (opsional)</span>
                    <button
                      type="button"
                      onClick={() => removeRow(rowIdx)}
                      className="p-1.5 rounded bg-[#1f1f1f] border border-[#2a2a2a] hover:border-red-500 shrink-0"
                      aria-label="Hapus resolusi"
                    >
                      <Trash className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                  {row.links.map((link, linkIdx) => (
                    <div key={linkIdx} className="flex gap-2">
                      <Input
                        placeholder={`Label link ${linkIdx + 1} (mis: Mediafire)`}
                        value={link.label}
                        onChange={(e) => updateRowLink(rowIdx, linkIdx, "label", e.target.value)}
                        className="bg-[#1f1f1f] border-[#2a2a2a] w-40 shrink-0"
                      />
                      <Input
                        placeholder="URL download eksternal (https://...)"
                        value={link.url}
                        onChange={(e) => updateRowLink(rowIdx, linkIdx, "url", e.target.value)}
                        className="bg-[#1f1f1f] border-[#2a2a2a] flex-1"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-[#2a2a2a]">
              Batal
            </Button>
            <Button type="submit" className="bg-[#f45c43] hover:bg-[#e04a32]">
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
