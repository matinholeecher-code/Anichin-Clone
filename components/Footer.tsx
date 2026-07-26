import Link from "next/link";

const AZ = ["#", "0-9", ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];

export function Footer() {
  return (
    <footer className="bg-[#141414] border-t border-[#2a2a2a] mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wide">A-Z List</h4>
          <span className="text-[#666]">|</span>
          <p className="text-xs text-[#a0a0a0]">Searching order by alphabet name A to Z.</p>
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {AZ.map((letter) => (
            <Link
              key={letter}
              href={`/az-lists?show=${encodeURIComponent(letter)}`}
              className="flex items-center justify-center h-9 min-w-9 px-2 rounded bg-[#f45c43] text-white text-xs font-semibold hover:bg-[#e04a32] transition-colors"
            >
              {letter}
            </Link>
          ))}
        </div>
        <div className="border-t border-[#2a2a2a] pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#666]">
          <p>&copy; 2026 Anichin. Semua hak dilindungi.</p>
          <p className="text-center md:text-right max-w-xl">
            Disclaimer: Anichin adalah situs review &amp; rekomendasi. Kami tidak menyimpan file video apa
            pun di server kami — seluruh episode ditampilkan melalui link/embed pihak ketiga.
          </p>
        </div>
      </div>
    </footer>
  );
}
