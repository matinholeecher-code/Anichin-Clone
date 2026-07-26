"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { ref, onValue, set, update, remove, push, get } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { Anime, Episode, WatchHistoryEntry, DownloadRow } from "@/types";
import { SEED_ANIME } from "@/lib/seed-data";
import { useAuth } from "@/lib/context/AuthContext";

const BOOKMARK_KEY = "anichin_bookmarks";
const HISTORY_KEY = "anichin_watch_history";
const HISTORY_LIMIT = 20;

interface DataContextType {
  animes: Anime[];
  loading: boolean;
  bookmarks: string[];
  history: WatchHistoryEntry[];
  addAnime: (data: Omit<Anime, "id" | "episodes" | "createdAt">) => Promise<Anime>;
  updateAnime: (id: string, data: Partial<Anime>) => Promise<void>;
  deleteAnime: (id: string) => Promise<void>;
  getAnimeById: (id: string) => Anime | undefined;
  addEpisode: (animeId: string, data: Omit<Episode, "id" | "animeId">) => Promise<void>;
  updateEpisode: (animeId: string, episodeId: string, data: Partial<Episode>) => Promise<void>;
  deleteEpisode: (animeId: string, episodeId: string) => Promise<void>;
  toggleBookmark: (animeId: string) => void;
  isBookmarked: (animeId: string) => boolean;
  addHistoryEntry: (entry: Omit<WatchHistoryEntry, "watchedAt">) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function toArray<T>(val: unknown): T[] {
  if (Array.isArray(val)) return val as T[];
  if (val && typeof val === "object") return Object.values(val as Record<string, unknown>) as T[];
  return [];
}

// Firebase RTDB's set()/update() throw if the payload contains an `undefined` value anywhere
// (unlike JSON.stringify, which would just drop the key). Recursively strip them so optional
// form fields left blank (-> undefined) don't crash writes. Arrays are preserved as arrays.
function stripUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((v) => stripUndefinedDeep(v)) as unknown as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v === undefined) continue;
      out[k] = stripUndefinedDeep(v);
    }
    return out as T;
  }
  return value;
}

function normalizeDownloadRows(val: unknown): DownloadRow[] {
  return toArray<Record<string, unknown>>(val).map((row) => ({
    resolution: (row.resolution as string) || "",
    links: toArray<{ label: string; url: string }>(row.links).filter((l) => l && l.url),
  }));
}

function normalizeAnime(id: string, raw: Record<string, unknown>): Anime {
  const episodesRaw = (raw.episodes as Record<string, unknown>) || {};
  const episodes: Episode[] = Object.entries(episodesRaw).map(([epId, epRaw]) => {
    const ep = epRaw as Record<string, unknown>;
    return {
      id: epId,
      animeId: id,
      number: Number(ep.number) || 0,
      title: (ep.title as string) || "",
      releaseDate: (ep.releaseDate as string) || "",
      servers: toArray<Episode["servers"][number]>(ep.servers),
      downloadLinks: normalizeDownloadRows(ep.downloadLinks),
    };
  });
  return {
    id,
    title: (raw.title as string) || "",
    altTitle: raw.altTitle as string | undefined,
    synopsis: (raw.synopsis as string) || "",
    status: (raw.status as Anime["status"]) || "Ongoing",
    studio: (raw.studio as string) || "",
    network: (raw.network as string) || "",
    genre: toArray<string>(raw.genre),
    posterUrl: (raw.posterUrl as string) || "",
    coverUrl: (raw.coverUrl as string) || "",
    rating: Number(raw.rating) || 0,
    releaseDate: (raw.releaseDate as string) || "",
    type: (raw.type as Anime["type"]) || "Donghua",
    totalEpisodes: Number(raw.totalEpisodes) || 0,
    episodes,
    createdAt: (raw.createdAt as string) || new Date().toISOString(),
    releaseDay: raw.releaseDay as Anime["releaseDay"],
    releaseTime: raw.releaseTime as string | undefined,
    showInSlider: Boolean(raw.showInSlider),
    trailerUrl: raw.trailerUrl as string | undefined,
    duration: raw.duration as string | undefined,
    season: raw.season as string | undefined,
    subber: raw.subber as string | undefined,
    postedBy: raw.postedBy as string | undefined,
    updatedAt: raw.updatedAt as string | undefined,
  };
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { isAdmin, loading: authLoading } = useAuth();
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [history, setHistory] = useState<WatchHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const storedBookmarks = localStorage.getItem(BOOKMARK_KEY);
      if (storedBookmarks) setBookmarks(JSON.parse(storedBookmarks));
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) setHistory(JSON.parse(storedHistory));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const animesRef = ref(rtdb, "animes");
    const unsubscribe = onValue(
      animesRef,
      (snapshot) => {
        const val = snapshot.val() as Record<string, Record<string, unknown>> | null;
        setAnimes(val ? Object.entries(val).map(([id, raw]) => normalizeAnime(id, raw)) : []);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsubscribe();
  }, []);

  // Only an authenticated admin can seed the database (RTDB write rules are admin-only).
  useEffect(() => {
    if (authLoading || !isAdmin) return;
    (async () => {
      try {
        const snap = await get(ref(rtdb, "animes"));
        if (!snap.exists()) {
          const seedObj: Record<string, Anime> = {};
          SEED_ANIME.forEach((a) => {
            seedObj[a.id] = a;
          });
          await set(ref(rtdb, "animes"), stripUndefinedDeep(seedObj));
        }
      } catch {
        /* seeding failed silently */
      }
    })();
  }, [authLoading, isAdmin]);

  const addAnime = useCallback(async (data: Omit<Anime, "id" | "episodes" | "createdAt">) => {
    const newRef = push(ref(rtdb, "animes"));
    const id = newRef.key as string;
    const newAnime: Anime = { ...data, id, episodes: [], createdAt: new Date().toISOString() };
    await set(newRef, stripUndefinedDeep(newAnime));
    return newAnime;
  }, []);

  const updateAnime = useCallback(async (id: string, data: Partial<Anime>) => {
    await update(ref(rtdb, `animes/${id}`), stripUndefinedDeep(data));
  }, []);

  const deleteAnime = useCallback(async (id: string) => {
    await remove(ref(rtdb, `animes/${id}`));
  }, []);

  const getAnimeById = useCallback((id: string) => animes.find((a) => a.id === id), [animes]);

  const addEpisode = useCallback(async (animeId: string, data: Omit<Episode, "id" | "animeId">) => {
    const newRef = push(ref(rtdb, `animes/${animeId}/episodes`));
    const id = newRef.key as string;
    await set(newRef, stripUndefinedDeep({ ...data, id, animeId }));
  }, []);

  const updateEpisode = useCallback(async (animeId: string, episodeId: string, data: Partial<Episode>) => {
    await update(ref(rtdb, `animes/${animeId}/episodes/${episodeId}`), stripUndefinedDeep(data));
  }, []);

  const deleteEpisode = useCallback(async (animeId: string, episodeId: string) => {
    await remove(ref(rtdb, `animes/${animeId}/episodes/${episodeId}`));
  }, []);

  const toggleBookmark = useCallback((animeId: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(animeId) ? prev.filter((b) => b !== animeId) : [...prev, animeId];
      if (typeof window !== "undefined") localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isBookmarked = useCallback((animeId: string) => bookmarks.includes(animeId), [bookmarks]);

  const addHistoryEntry = useCallback((entry: Omit<WatchHistoryEntry, "watchedAt">) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.episodeId !== entry.episodeId);
      const next = [{ ...entry, watchedAt: new Date().toISOString() }, ...filtered].slice(0, HISTORY_LIMIT);
      if (typeof window !== "undefined") localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <DataContext.Provider
      value={{
        animes,
        loading,
        bookmarks,
        history,
        addAnime,
        updateAnime,
        deleteAnime,
        getAnimeById,
        addEpisode,
        updateEpisode,
        deleteEpisode,
        toggleBookmark,
        isBookmarked,
        addHistoryEntry,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
