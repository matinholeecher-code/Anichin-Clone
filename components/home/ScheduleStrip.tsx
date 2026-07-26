"use client";

import Link from "next/link";
import { Anime } from "@/types";
import { RELEASE_DAYS } from "@/lib/seed-data";
import { Calendar } from "lucide-react";

export function ScheduleStrip({ ongoing: _ongoing }: { ongoing: Anime[] }) {
  return (
    <section className="bg-[#141414] border border-[#2a2a2a] rounded-md p-2">
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {RELEASE_DAYS.map((day) => (
          <Link
            key={day}
            href={`/schedule?day=${encodeURIComponent(day)}`}
            className="flex items-center justify-center gap-1.5 bg-[#1f1f1f] hover:bg-[#f45c43] text-[#c8c8c8] hover:text-white rounded text-xs font-medium py-2.5 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            {day}
          </Link>
        ))}
      </div>
    </section>
  );
}
