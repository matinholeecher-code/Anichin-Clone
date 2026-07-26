"use client";

import { useEffect, useState } from "react";
import { ref, onValue, set, remove, push } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { SocialLink } from "@/types";

export function useSocialLinks() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socialRef = ref(rtdb, "settings/social");
    const unsub = onValue(
      socialRef,
      (snap) => {
        const val = snap.val() as Record<string, Omit<SocialLink, "id">> | null;
        setLinks(val ? Object.entries(val).map(([id, v]) => ({ id, ...v })) : []);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, []);

  const addLink = async (data: Omit<SocialLink, "id">) => {
    const newRef = push(ref(rtdb, "settings/social"));
    await set(newRef, data);
  };

  const updateLink = async (id: string, data: Partial<Omit<SocialLink, "id">>) => {
    const current = links.find((l) => l.id === id);
    if (!current) return;
    const { platform, url, enabled } = { ...current, ...data };
    await set(ref(rtdb, `settings/social/${id}`), { platform, url, enabled });
  };

  const removeLink = async (id: string) => {
    await remove(ref(rtdb, `settings/social/${id}`));
  };

  return { links, loading, addLink, updateLink, removeLink };
}
