export interface ServerLink {
  name: string;
  embedUrl: string;
}

export interface DownloadLinkOption {
  label: string;
  url: string;
}

export interface DownloadRow {
  resolution: string;
  links: DownloadLinkOption[];
}

export interface Episode {
  id: string;
  animeId: string;
  number: number;
  title: string;
  releaseDate: string;
  servers: ServerLink[];
  downloadLinks?: DownloadRow[];
}

export type AnimeStatus = "Ongoing" | "Completed" | "Upcoming" | "Dropped";
export type AnimeType = "Donghua" | "Movie";
export type ReleaseDay = "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jum'at" | "Sabtu" | "Minggu";

export interface Anime {
  id: string;
  title: string;
  altTitle?: string;
  synopsis: string;
  status: AnimeStatus;
  studio: string;
  network: string;
  genre: string[];
  posterUrl: string;
  coverUrl: string;
  rating: number;
  releaseDate: string;
  type: AnimeType;
  totalEpisodes: number;
  episodes: Episode[];
  createdAt: string;
  releaseDay?: ReleaseDay;
  releaseTime?: string;
  showInSlider?: boolean;
  trailerUrl?: string;
  duration?: string;
  season?: string;
  subber?: string;
  postedBy?: string;
  updatedAt?: string;
}

export interface WatchHistoryEntry {
  animeId: string;
  episodeId: string;
  animeTitle: string;
  episodeNumber: number;
  posterUrl: string;
  watchedAt: string;
}

export interface SocialLink {
  id: string;
  platform: "facebook" | "twitter" | "whatsapp" | "telegram" | "instagram" | "youtube" | "discord";
  url: string;
  enabled: boolean;
}
