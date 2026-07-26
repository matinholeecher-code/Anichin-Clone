import { DownloadRow } from "@/types";

interface DownloadSectionProps {
  animeTitle: string;
  episodeNumber: number;
  links: DownloadRow[];
}

export function DownloadSection({ animeTitle, episodeNumber, links }: DownloadSectionProps) {
  const rows = links.filter((row) => row.links.length > 0);
  if (!rows.length) return null;

  const title = `${animeTitle} Episode ${episodeNumber} Subtitle Indonesia`;

  return (
    <section>
      <h3 className="text-sm font-semibold text-white mb-3">Download {title}</h3>
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-md overflow-hidden">
        <div className="bg-[#f45c43] text-white text-sm font-semibold px-4 py-2.5">{title}</div>
        <div className="divide-y divide-[#2a2a2a]">
          {rows.map((row, idx) => (
            <div key={idx} className="flex items-center gap-3 px-4 py-3">
              <span className="w-14 shrink-0 text-xs font-bold text-white bg-[#c0392b] rounded px-2 py-1 text-center">
                {row.resolution}
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#a0a0a0]">
                {row.links.map((link, i) => (
                  <span key={i} className="flex items-center gap-2">
                    {i > 0 && <span className="text-[#444]">|</span>}
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#f45c43] transition-colors">
                      {link.label}
                    </a>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
