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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Anime, AnimeStatus, AnimeType, ReleaseDay } from "@/types";
import { parseTags } from "@/lib/helpers";
import { RELEASE_DAYS } from "@/lib/seed-data";

export interface AnimeFormValues {
  title: string;
  altTitle: string;
  synopsis: string;
  status: AnimeStatus;
  studio: string;
  network: string;
  genre: string;
  posterUrl: string;
  coverUrl: string;
  rating: string;
  releaseDate: string;
  type: AnimeType;
  totalEpisodes: string;
  releaseDay: string;
  releaseTime: string;
  showInSlider: boolean;
  trailerUrl: string;
  duration: string;
  season: string;
  subber: string;
  postedBy: string;
}

const EMPTY_FORM: AnimeFormValues = {
  title: "",
  altTitle: "",
  synopsis: "",
  status: "Ongoing",
  studio: "",
  network: "",
  genre: "",
  posterUrl: "",
  coverUrl: "",
  rating: "0",
  releaseDate: "",
  type: "Donghua",
  totalEpisodes: "0",
  releaseDay: "",
  releaseTime: "",
  showInSlider: false,
  trailerUrl: "",
  duration: "",
  season: "",
  subber: "",
  postedBy: "",
};

function sanitizeRating(raw: string): number {
  const n = Number(raw);
  if (!isFinite(n)) return 0;
  const clamped = Math.min(10, Math.max(0, n));
  // Round to 1 decimal to avoid floating point drift (e.g. from repeated step increments)
  return Math.round(clamped * 10) / 10;
}

interface AnimeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Anime;
  onSubmit: (data: Omit<Anime, "id" | "episodes" | "createdAt">) => void;
}

export function AnimeForm({ open, onOpenChange, initialData, onSubmit }: AnimeFormProps) {
  const [form, setForm] = useState<AnimeFormValues>(EMPTY_FORM);

  useEffect(() => {
    if (!open) return;
    if (initialData) {
      setForm({
        title: initialData.title,
        altTitle: initialData.altTitle || "",
        synopsis: initialData.synopsis,
        status: initialData.status,
        studio: initialData.studio,
        network: initialData.network,
        genre: initialData.genre.join(", "),
        posterUrl: initialData.posterUrl,
        coverUrl: initialData.coverUrl,
        rating: sanitizeRating(String(initialData.rating)).toString(),
        releaseDate: initialData.releaseDate,
        type: initialData.type,
        totalEpisodes: String(initialData.totalEpisodes || 0),
        releaseDay: initialData.releaseDay || "",
        releaseTime: initialData.releaseTime || "",
        showInSlider: !!initialData.showInSlider,
        trailerUrl: initialData.trailerUrl || "",
        duration: initialData.duration || "",
        season: initialData.season || "",
        subber: initialData.subber || "",
        postedBy: initialData.postedBy || "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
    // Only re-sync when the modal opens or the record being edited changes identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?.id, open]);

  const update = (field: keyof AnimeFormValues, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.synopsis.trim() || !form.posterUrl.trim() || !form.coverUrl.trim()) {
      alert("Mohon lengkapi Title, Synopsis, Poster URL, dan Cover URL.");
      return;
    }
    onSubmit({
      title: form.title.trim(),
      altTitle: form.altTitle.trim() || undefined,
      synopsis: form.synopsis.trim(),
      status: form.status,
      studio: form.studio.trim(),
      network: form.network.trim(),
      genre: parseTags(form.genre),
      posterUrl: form.posterUrl.trim(),
      coverUrl: form.coverUrl.trim(),
      rating: sanitizeRating(form.rating),
      releaseDate: form.releaseDate,
      type: form.type,
      totalEpisodes: Math.max(0, Math.round(Number(form.totalEpisodes)) || 0),
      releaseDay: (form.releaseDay || undefined) as ReleaseDay | undefined,
      releaseTime: form.releaseTime || undefined,
      showInSlider: form.showInSlider,
      trailerUrl: form.trailerUrl.trim() || undefined,
      duration: form.duration.trim() || undefined,
      season: form.season.trim() || undefined,
      subber: form.subber.trim() || undefined,
      postedBy: form.postedBy.trim() || undefined,
      updatedAt: new Date().toISOString(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#141414] border-[#2a2a2a] text-white max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Anime" : "Tambah Anime"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                required
                className="bg-[#1f1f1f] border-[#2a2a2a]"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Alt Title</Label>
              <Input
                value={form.altTitle}
                onChange={(e) => update("altTitle", e.target.value)}
                className="bg-[#1f1f1f] border-[#2a2a2a]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Synopsis *</Label>
            <Textarea
              value={form.synopsis}
              onChange={(e) => update("synopsis", e.target.value)}
              required
              rows={3}
              className="bg-[#1f1f1f] border-[#2a2a2a]"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <select
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
                className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded-md text-sm px-3 py-2"
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Studio</Label>
              <Input value={form.studio} onChange={(e) => update("studio", e.target.value)} className="bg-[#1f1f1f] border-[#2a2a2a]" />
            </div>
            <div className="space-y-1.5">
              <Label>Network</Label>
              <Input value={form.network} onChange={(e) => update("network", e.target.value)} className="bg-[#1f1f1f] border-[#2a2a2a]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Genre (pisahkan dengan koma)</Label>
            <Input
              value={form.genre}
              onChange={(e) => update("genre", e.target.value)}
              placeholder="Action, Adventure, Fantasy"
              className="bg-[#1f1f1f] border-[#2a2a2a]"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Poster URL *</Label>
              <Input
                value={form.posterUrl}
                onChange={(e) => update("posterUrl", e.target.value)}
                required
                placeholder="https://..."
                className="bg-[#1f1f1f] border-[#2a2a2a]"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Cover URL *</Label>
              <Input
                value={form.coverUrl}
                onChange={(e) => update("coverUrl", e.target.value)}
                required
                placeholder="https://..."
                className="bg-[#1f1f1f] border-[#2a2a2a]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Trailer URL (opsional, embed YouTube dll)</Label>
            <Input
              value={form.trailerUrl}
              onChange={(e) => update("trailerUrl", e.target.value)}
              placeholder="https://www.youtube.com/embed/..."
              className="bg-[#1f1f1f] border-[#2a2a2a]"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Rating (0-10)</Label>
              <Input
                type="number"
                inputMode="decimal"
                min={0}
                max={10}
                step={0.1}
                value={form.rating}
                onChange={(e) => update("rating", e.target.value)}
                onBlur={(e) => update("rating", sanitizeRating(e.target.value).toString())}
                className="bg-[#1f1f1f] border-[#2a2a2a]"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Jumlah Episode (total keseluruhan)</Label>
              <Input
                type="number"
                min={0}
                value={form.totalEpisodes}
                onChange={(e) => update("totalEpisodes", e.target.value)}
                placeholder="mis: 150"
                className="bg-[#1f1f1f] border-[#2a2a2a]"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <select
                value={form.type}
                onChange={(e) => update("type", e.target.value)}
                className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded-md text-sm px-3 py-2"
              >
                <option value="Donghua">Donghua</option>
                <option value="Movie">Movie</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Release Date</Label>
            <Input
              type="date"
              value={form.releaseDate}
              onChange={(e) => update("releaseDate", e.target.value)}
              className="bg-[#1f1f1f] border-[#2a2a2a] max-w-xs"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Durasi (mis: 20 min per ep)</Label>
              <Input value={form.duration} onChange={(e) => update("duration", e.target.value)} className="bg-[#1f1f1f] border-[#2a2a2a]" />
            </div>
            <div className="space-y-1.5">
              <Label>Season (mis: Summer 2023)</Label>
              <Input value={form.season} onChange={(e) => update("season", e.target.value)} className="bg-[#1f1f1f] border-[#2a2a2a]" />
            </div>
            <div className="space-y-1.5">
              <Label>Subber</Label>
              <Input value={form.subber} onChange={(e) => update("subber", e.target.value)} className="bg-[#1f1f1f] border-[#2a2a2a]" />
            </div>
            <div className="space-y-1.5">
              <Label>Diposting Oleh</Label>
              <Input value={form.postedBy} onChange={(e) => update("postedBy", e.target.value)} className="bg-[#1f1f1f] border-[#2a2a2a]" />
            </div>
          </div>

          <p className="text-[11px] text-[#666]">
            &quot;Jumlah Episode&quot; adalah total episode keseluruhan series (untuk ditampilkan di halaman detail &amp;
            player). Episode yang benar-benar sudah diupload dikelola terpisah di menu Kelola Episode.
          </p>

          <div className="border-t border-[#2a2a2a] pt-4">
            <p className="text-xs font-semibold text-[#a0a0a0] mb-3">Jadwal Rilis Mingguan (untuk halaman Jadwal Rilis)</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Hari Rilis</Label>
                <select
                  value={form.releaseDay}
                  onChange={(e) => update("releaseDay", e.target.value)}
                  className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded-md text-sm px-3 py-2"
                >
                  <option value="">Tidak ada jadwal</option>
                  {RELEASE_DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Jam Rilis</Label>
                <Input
                  type="time"
                  value={form.releaseTime}
                  onChange={(e) => update("releaseTime", e.target.value)}
                  className="bg-[#1f1f1f] border-[#2a2a2a]"
                />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-[#a0a0a0] cursor-pointer">
            <input
              type="checkbox"
              checked={form.showInSlider}
              onChange={(e) => update("showInSlider", e.target.checked)}
              className="accent-[#f45c43] w-4 h-4"
            />
            Tampilkan di Banner Slider Beranda
          </label>

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
