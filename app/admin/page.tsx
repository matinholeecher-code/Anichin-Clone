"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useData } from "@/lib/context/DataContext";
import { Film, Video, Activity, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/helpers";

export default function AdminDashboardPage() {
  const { animes, loading } = useData();

  const totalEpisode = useMemo(() => animes.reduce((sum, a) => sum + a.episodes.length, 0), [animes]);
  const ongoingCount = useMemo(() => animes.filter((a) => a.status === "Ongoing").length, [animes]);
  const completedCount = useMemo(() => animes.filter((a) => a.status === "Completed").length, [animes]);
  const latest = useMemo(
    () => [...animes].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")).slice(0, 5),
    [animes]
  );

  const cards = [
    { label: "Total Anime", value: animes.length, icon: Film },
    { label: "Total Episode", value: totalEpisode, icon: Video },
    { label: "Ongoing", value: ongoingCount, icon: Activity },
    { label: "Completed", value: completedCount, icon: CheckCircle },
  ];

  if (loading) return <p className="text-[#a0a0a0]">Memuat data...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-[#a0a0a0] mt-1">Ringkasan konten Anichin</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-[#141414] border border-[#2a2a2a] rounded-md p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#a0a0a0]">{c.label}</span>
              <c.icon className="w-4 h-4 text-[#f45c43]" />
            </div>
            <p className="text-2xl font-bold text-white">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#141414] border border-[#2a2a2a] rounded-md p-4">
        <h2 className="text-sm font-semibold text-white mb-4">5 Anime Terbaru Ditambahkan</h2>
        <div className="divide-y divide-[#2a2a2a]">
          {latest.length ? (
            latest.map((a) => (
              <Link
                key={a.id}
                href={`/admin/anime`}
                className="flex items-center gap-3 py-3 hover:bg-[#1f1f1f] rounded px-2 transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.posterUrl} alt={a.title} className="w-10 h-14 object-cover rounded shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white line-clamp-1">{a.title}</p>
                  <p className="text-xs text-[#666]">{formatDate(a.createdAt)}</p>
                </div>
                <span className="text-xs bg-[#1f1f1f] border border-[#2a2a2a] px-2 py-1 rounded text-[#a0a0a0]">
                  {a.status}
                </span>
              </Link>
            ))
          ) : (
            <p className="text-xs text-[#666] py-4">Belum ada data anime.</p>
          )}
        </div>
      </div>
    </div>
  );
}
