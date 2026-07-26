"use client";

import { X } from "lucide-react";

interface TrailerModalProps {
  open: boolean;
  onClose: () => void;
  embedUrl: string;
  title: string;
}

export function TrailerModal({ open, onClose, embedUrl, title }: TrailerModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 fade-in" onClick={onClose}>
      <div
        className="bg-[#141414] border border-[#2a2a2a] rounded-md w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a]">
          <h3 className="text-sm font-semibold text-white line-clamp-1">Trailer: {title}</h3>
          <button onClick={onClose} aria-label="Tutup">
            <X className="w-5 h-5 text-[#a0a0a0] hover:text-white" />
          </button>
        </div>
        <div className="aspect-video bg-black">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
