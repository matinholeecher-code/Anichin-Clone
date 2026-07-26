"use client";

import { useEffect, useState } from "react";
import { Share } from "lucide-react";

interface ShareRowProps {
  title: string;
}

export function ShareRow({ title }: ShareRowProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setUrl(window.location.href);
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    { name: "Facebook", color: "bg-[#1877f2]", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { name: "Twitter", color: "bg-[#1da1f2]", href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { name: "WhatsApp", color: "bg-[#25d366]", href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { name: "Telegram", color: "bg-[#0088cc]", href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}` },
  ];

  return (
    <div className="flex items-center gap-2">
      {links.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-8 h-8 rounded-full ${link.color} flex items-center justify-center text-white hover:opacity-85 transition-opacity`}
          aria-label={`Bagikan ke ${link.name}`}
          title={`Bagikan ke ${link.name}`}
        >
          <Share className="w-3.5 h-3.5" />
        </a>
      ))}
    </div>
  );
}
