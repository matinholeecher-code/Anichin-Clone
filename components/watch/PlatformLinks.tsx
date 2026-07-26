const PLATFORMS = [
  { name: "Bilibili", url: "https://www.bilibili.tv/id", color: "bg-[#00a1d6]" },
  { name: "iQIYI", url: "https://www.iq.com/", color: "bg-[#00be06]" },
  { name: "WeTV", url: "https://wetv.vip/", color: "bg-[#ffb800]" },
  { name: "YouTube", url: "https://www.youtube.com/", color: "bg-[#ff0000]" },
];

export function PlatformLinks() {
  return (
    <section>
      <h3 className="text-sm font-semibold text-white mb-3">Tonton di Platform Resmi</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PLATFORMS.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${p.color} text-white text-sm font-semibold text-center py-2.5 rounded hover:opacity-90 transition-opacity`}
          >
            {p.name}
          </a>
        ))}
      </div>
    </section>
  );
}
