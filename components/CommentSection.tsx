"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

interface Comment {
  name: string;
  message: string;
  date: string;
}

const DUMMY_COMMENTS: Comment[] = [
  { name: "Andi Pratama", message: "Episode terbaru mantap banget, animasinya makin halus!", date: "2 hari lalu" },
  { name: "Sinta Dewi", message: "Kapan ya episode selanjutnya rilis? Ga sabar!", date: "5 hari lalu" },
  { name: "Budi Santoso", message: "Terima kasih review-nya, jadi tau donghua legal yang bagus.", date: "1 minggu lalu" },
];

export function CommentSection() {
  const [comments, setComments] = useState<Comment[]>(DUMMY_COMMENTS);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setComments((prev) => [{ name, message, date: "Baru saja" }, ...prev]);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <section className="bg-[#141414] border border-[#2a2a2a] rounded-md p-4 md:p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
        <MessageCircle className="w-5 h-5 text-[#f45c43]" /> Komentar ({comments.length})
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama"
            required
            className="bg-[#1f1f1f] border border-[#2a2a2a] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#f45c43]"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="bg-[#1f1f1f] border border-[#2a2a2a] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#f45c43]"
          />
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis komentar kamu..."
          required
          rows={3}
          className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#f45c43]"
        />
        <button
          type="submit"
          className="bg-[#f45c43] hover:bg-[#e04a32] text-white text-sm font-semibold px-5 py-2 rounded transition-colors"
        >
          Kirim Komentar
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((c, idx) => (
          <div key={idx} className="border-t border-[#2a2a2a] pt-4 first:border-t-0 first:pt-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-white">{c.name}</p>
              <span className="text-[10px] text-[#666]">{c.date}</span>
            </div>
            <p className="text-xs text-[#a0a0a0]">{c.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
