"use client";

import { useState } from "react";
import { useSocialLinks } from "@/lib/hooks/useSocialLinks";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { SocialLink } from "@/types";

const PLATFORMS: SocialLink["platform"][] = [
  "facebook",
  "twitter",
  "whatsapp",
  "telegram",
  "instagram",
  "youtube",
  "discord",
];

export default function AdminSettingsPage() {
  const { links, loading, addLink, updateLink, removeLink } = useSocialLinks();
  const [platform, setPlatform] = useState<SocialLink["platform"]>("facebook");
  const [url, setUrl] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    await addLink({ platform, url: url.trim(), enabled: true });
    setUrl("");
  };

  if (loading) return <p className="text-[#a0a0a0]">Memuat data...</p>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Pengaturan Sosial Media</h1>
        <p className="text-sm text-[#a0a0a0] mt-1">
          Icon yang aktif akan tampil di sidebar situs pada bagian &quot;Dukung Kami&quot;
        </p>
      </div>

      <form onSubmit={handleAdd} className="bg-[#141414] border border-[#2a2a2a] rounded-md p-4 flex flex-col sm:flex-row gap-3">
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value as SocialLink["platform"])}
          className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-md text-sm px-3 py-2 capitalize"
        >
          {PLATFORMS.map((p) => (
            <option key={p} value={p} className="capitalize">
              {p}
            </option>
          ))}
        </select>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className="flex-1 bg-[#1f1f1f] border border-[#2a2a2a] rounded-md text-sm px-3 py-2 focus:outline-none focus:border-[#f45c43]"
        />
        <Button type="submit" className="bg-[#f45c43] hover:bg-[#e04a32] gap-2">
          <Plus className="w-4 h-4" /> Tambah
        </Button>
      </form>

      <div className="bg-[#141414] border border-[#2a2a2a] rounded-md divide-y divide-[#2a2a2a]">
        {links.length ? (
          links.map((link) => (
            <div key={link.id} className="flex items-center gap-3 p-3">
              <span className="text-sm text-white capitalize w-24 shrink-0">{link.platform}</span>
              <span className="flex-1 text-xs text-[#a0a0a0] truncate">{link.url}</span>
              <label className="flex items-center gap-1.5 text-xs text-[#a0a0a0] cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={link.enabled}
                  onChange={(e) => updateLink(link.id, { enabled: e.target.checked })}
                  className="accent-[#f45c43]"
                />
                Aktif
              </label>
              <button
                onClick={() => removeLink(link.id)}
                className="p-2 rounded bg-[#1f1f1f] border border-[#2a2a2a] hover:border-red-500 shrink-0"
                aria-label="Hapus"
              >
                <Trash className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-[#666] text-center">Belum ada link sosial media.</p>
        )}
      </div>
    </div>
  );
}
