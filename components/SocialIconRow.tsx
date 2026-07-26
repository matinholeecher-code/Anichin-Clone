"use client";

import { Share, MessageCircle, Send, Image as ImageIcon, Video, Users, Globe } from "lucide-react";
import { useSocialLinks } from "@/lib/hooks/useSocialLinks";
import { SocialLink } from "@/types";

const ICON_MAP: Record<SocialLink["platform"], typeof Globe> = {
  facebook: Share,
  twitter: Share,
  whatsapp: MessageCircle,
  telegram: Send,
  instagram: ImageIcon,
  youtube: Video,
  discord: Users,
};

export function SocialIconRow() {
  const { links, loading } = useSocialLinks();
  const enabled = links.filter((l) => l.enabled && l.url);

  if (loading || !enabled.length) return null;

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-md p-4">
      <h3 className="font-semibold text-sm mb-3 text-white">Komunitas Anichin</h3>
      <div className="flex flex-wrap gap-2">
        {enabled.map((link) => {
          const Icon = ICON_MAP[link.platform] || Globe;
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f45c43] hover:bg-[#e04a32] text-white transition-colors"
              aria-label={link.platform}
              title={link.platform}
            >
              <Icon className="w-4 h-4" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
