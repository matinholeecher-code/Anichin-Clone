import { ServerLink } from "@/types";

export function PlayerGuideBox({ servers }: { servers: ServerLink[] }) {
  return (
    <div className="bg-[#d9f0f2] border border-[#b8dde0] rounded-md p-4 text-xs text-[#0d4f52] leading-relaxed space-y-1.5">
      <p>&#9888; Jika server streaming/download rusak, silakan laporkan ke admin lewat Grup Telegram.</p>
      <p>&#9888; Bookmark situs ini agar mudah kembali kapan saja.</p>
      {servers.length > 0 && (
        <>
          <p className="font-bold pt-1">== DESKRIPSI SERVER ==</p>
          {servers.map((s, idx) => (
            <p key={idx}>
              <span className="font-semibold">{s.name}:</span> Server streaming pilihan {idx + 1}.
            </p>
          ))}
        </>
      )}
      <p>&#9888; Iklan yang muncul di dalam player bukan milik Anichin dan di luar kendali kami.</p>
      <p>&#9888; Demi kenyamanan menonton &amp; download, gunakan browser terbaru (Chrome/Firefox).</p>
      <p>&#9888; Link download tersedia di bagian bawah halaman ini.</p>
    </div>
  );
}
