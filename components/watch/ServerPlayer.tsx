"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { ServerLink } from "@/types";
import { isIframeFriendly } from "@/lib/helpers";

export function ServerPlayer({ servers }: { servers: ServerLink[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [servers]);

  const current = servers[activeIndex];

  return (
    <div className="space-y-2">
      <div className="w-full aspect-video bg-black rounded border border-[#333] overflow-hidden">
        {current ? (
          isIframeFriendly(current.embedUrl) ? (
            <iframe
              key={current.embedUrl}
              src={current.embedUrl}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <a
                href={current.embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#f45c43] hover:bg-[#e04a32] text-white text-sm font-semibold px-5 py-2.5 rounded transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Buka Link External
              </a>
            </div>
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-xs text-[#666]">Belum ada server tersedia untuk episode ini.</p>
          </div>
        )}
      </div>

      {servers.length > 0 && (
        <select
          value={activeIndex}
          onChange={(e) => setActiveIndex(Number(e.target.value))}
          className="w-full sm:w-56 bg-[#1f1f1f] border border-[#2a2a2a] rounded text-sm text-white px-3 py-2 focus:outline-none focus:border-[#f45c43]"
        >
          {servers.map((s, idx) => (
            <option key={`${s.name}-${idx}`} value={idx}>
              {s.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
