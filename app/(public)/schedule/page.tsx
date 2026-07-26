"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useData } from "@/lib/context/DataContext";
import { RELEASE_DAYS } from "@/lib/seed-data";
import { CountdownBadge } from "@/components/schedule/CountdownBadge";

const JS_DAY_TO_NAME = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];

function ScheduleContent() {
  const { animes, loading } = useData();
  const searchParams = useSearchParams();
  const ongoing = useMemo(() => animes.filter((a) => a.status === "Ongoing"), [animes]);
  const [activeDay, setActiveDay] = useState(() => JS_DAY_TO_NAME[new Date().getDay()]);

  useEffect(() => {
    const dayParam = searchParams.get("day");
    if (dayParam && (RELEASE_DAYS as readonly string[]).includes(dayParam)) {
      setActiveDay(dayParam);
    }
  }, [searchParams]);

  const mapping = useMemo(() => {
    const map: Record<string, typeof ongoing> = {};
    RELEASE_DAYS.forEach((day) => {
      map[day] = ongoing.filter((a) => a.releaseDay === day);
    });
    return map;
  }, [ongoing]);

  if (loading) return <div className="text-center text-[#a0a0a0] py-20">Memuat data...</div>;

  const activeList = mapping[activeDay] || [];

  return (
    <div className="space-y-5">
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-md p-4">
        <h1 className="text-lg font-bold text-white mb-1">Schedule</h1>
        <p className="text-xs text-[#a0a0a0]">
          Jadwal ini estimasi berdasarkan hari &amp; jam rilis yang diatur admin. Hitung mundur bisa berubah jika
          episode rilis lebih cepat atau lambat dari jadwal.
        </p>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {RELEASE_DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`py-3 rounded-md text-sm font-semibold transition-colors ${
              activeDay === day ? "bg-[#f45c43] text-white" : "bg-[#141414] border border-[#2a2a2a] text-[#a0a0a0] hover:text-white"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div>
        <h2 className="text-base font-bold text-white mb-3">{activeDay}</h2>
        {activeList.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {activeList.map((anime) => (
              <Link key={anime.id} href={`/donghua/${anime.id}`} className="group block">
                <div className="relative aspect-[247/350] bg-[#1f1f1f] rounded-md overflow-hidden border border-[#2a2a2a]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={anime.posterUrl}
                    alt={anime.title}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  {anime.releaseTime && (
                    <span className="absolute top-2 left-2 bg-[#f45c43] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      Jam {anime.releaseTime}
                    </span>
                  )}
                  <span className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Ep {anime.episodes.length || "TBA"}
                  </span>
                </div>
                <h3 className="mt-2 text-xs font-semibold text-white group-hover:text-[#f45c43] line-clamp-2 transition-colors">
                  {anime.title}
                </h3>
                <CountdownBadge day={anime.releaseDay} time={anime.releaseTime} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#666] py-10 text-center">Belum ada jadwal rilis untuk hari ini.</p>
        )}
      </div>
    </div>
  );
}

export default function SchedulePage() {
  return (
    <Suspense fallback={<div className="text-center text-[#a0a0a0] py-20">Memuat data...</div>}>
      <ScheduleContent />
    </Suspense>
  );
}
