import { Anime } from "@/types";

const PLACEHOLDER = (w: number, h: number, bg: string, fg: string, text: string) =>
  `https://placehold.co/${w}x${h}/${bg}/${fg}?text=${encodeURIComponent(text)}`;

function makeEpisodes(animeId: string, count: number, daysAgoStart: number) {
  return Array.from({ length: count }, (_, i) => {
    const num = count - i;
    const d = new Date();
    d.setDate(d.getDate() - (daysAgoStart + i * 7));
    return {
      id: `${animeId}-ep-${num}`,
      animeId,
      number: num,
      title: `Episode ${num}`,
      releaseDate: d.toISOString().slice(0, 10),
      servers: [
        { name: "YouTube", embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        { name: "Bilibili", embedUrl: "https://www.bilibili.tv/id" },
      ],
      downloadLinks: [
        { resolution: "720p", provider: "Pixeldrain", url: "https://pixeldrain.com/" },
        { resolution: "1080p", provider: "Mediafire", url: "https://mediafire.com/" },
      ],
    };
  }).reverse();
}

interface SeedInput {
  id: string;
  title: string;
  altTitle?: string;
  genre: string[];
  rating: number;
  status: Anime["status"];
  type: Anime["type"];
  studio: string;
  network: string;
  episodeCount: number;
  releaseDay?: Anime["releaseDay"];
  releaseTime?: string;
  showInSlider?: boolean;
  color: string;
  season?: string;
  duration?: string;
  subber?: string;
  postedBy?: string;
}

const RAW: SeedInput[] = [
  { id: "renegade-immortal", title: "Renegade Immortal", altTitle: "仙逆", genre: ["Action", "Adventure", "Fantasy"], rating: 8.83, status: "Ongoing", type: "Donghua", studio: "Build Dream", network: "Tencent Penguin Pictures", episodeCount: 3, releaseDay: "Kamis", releaseTime: "19:15", showInSlider: true, color: "f45c43", season: "Summer 2023", duration: "20 min per ep", subber: "Muizzaq", postedBy: "Dongdong" },
  { id: "battle-through-the-heavens-season-5", title: "Battle Through the Heavens Season 5", altTitle: "斗破苍穹 第5季", genre: ["Action", "Adventure", "Martial Arts"], rating: 9.2, status: "Ongoing", type: "Donghua", studio: "Laan Studio", network: "Tencent", episodeCount: 3, releaseDay: "Selasa", releaseTime: "18:00", showInSlider: true, color: "3d5a80", season: "Winter 2024", duration: "22 min per ep", subber: "Muizzaq", postedBy: "Dongdong" },
  { id: "perfect-world", title: "Perfect World", altTitle: "完美世界", genre: ["Action", "Adventure", "Drama", "Fantasy"], rating: 9.0, status: "Ongoing", type: "Donghua", studio: "Original Force", network: "Tencent", episodeCount: 3, releaseDay: "Rabu", releaseTime: "20:00", showInSlider: true, color: "6a4c93", season: "Fall 2022", duration: "20 min per ep", subber: "A-chuan", postedBy: "Dongdong" },
  { id: "tales-of-herding-gods", title: "Tales of Herding Gods", altTitle: "牧神记", genre: ["Action", "Adventure", "Fantasy", "Supernatural"], rating: 8.83, status: "Ongoing", type: "Donghua", studio: "Wan Wei Mao", network: "iQIYI", episodeCount: 3, releaseDay: "Senin", releaseTime: "17:15", showInSlider: true, color: "1d3557", season: "Spring 2024", duration: "18 min per ep", subber: "Muizzaq", postedBy: "Dongdong" },
  { id: "beyond-times-gaze", title: "Beyond Time's Gaze", altTitle: "光阴之外", genre: ["Action", "Adventure", "Fantasy", "Sci-fi"], rating: 8.83, status: "Ongoing", type: "Donghua", studio: "Haoliners", network: "Bilibili", episodeCount: 3, releaseDay: "Jum'at", releaseTime: "21:00", showInSlider: true, color: "e63946", season: "Summer 2024", duration: "24 min per ep", subber: "NexusXP", postedBy: "Dongdong" },
  { id: "martial-master", title: "Martial Master", altTitle: "武神主宰", genre: ["Action", "Adventure", "Martial Arts"], rating: 7.9, status: "Ongoing", type: "Donghua", studio: "Fengying Animation", network: "Tencent", episodeCount: 2, releaseDay: "Sabtu", releaseTime: "16:30", showInSlider: false, color: "2a9d8f", season: "Spring 2020", duration: "10 min per ep", subber: "Muizzaq", postedBy: "Dongdong" },
  { id: "apotheosis", title: "Apotheosis", altTitle: "飞升之后", genre: ["Action", "Adventure", "Fantasy", "Reincarnation"], rating: 8.4, status: "Ongoing", type: "Donghua", studio: "Original Force", network: "Tencent", episodeCount: 2, releaseDay: "Senin", releaseTime: "19:00", showInSlider: false, color: "f4a261", season: "Summer 2023", duration: "20 min per ep", subber: "A-chuan", postedBy: "Dongdong" },
  { id: "swallowed-star", title: "Swallowed Star", altTitle: "吞噬星空", genre: ["Action", "Sci-fi"], rating: 8.0, status: "Ongoing", type: "Donghua", studio: "Original Force", network: "Tencent", episodeCount: 2, releaseDay: "Minggu", releaseTime: "18:45", showInSlider: false, color: "264653", season: "Fall 2020", duration: "20 min per ep", subber: "yui", postedBy: "Dongdong" },
  { id: "soul-land-2", title: "Soul Land 2: The Unrivaled Tang Sect", altTitle: "斗罗大陆2", genre: ["Action", "Adventure", "Fantasy", "Romance", "Friendship"], rating: 8.83, status: "Ongoing", type: "Donghua", studio: "Original Force", network: "Tencent", episodeCount: 2, releaseDay: "Rabu", releaseTime: "20:30", showInSlider: false, color: "9d4edd", season: "Winter 2022", duration: "20 min per ep", subber: "Join", postedBy: "Dongdong" },
  { id: "the-supreme-dantian", title: "The Supreme Dantian", genre: ["Action", "Adventure", "Fantasy", "Martial Arts"], rating: 7.0, status: "Ongoing", type: "Donghua", studio: "Silver Ocean", network: "Youku", episodeCount: 2, releaseDay: "Minggu", releaseTime: "12:17", showInSlider: false, color: "023047", season: "Spring 2025", duration: "8 min per ep", subber: "Muizzaq", postedBy: "Dongdong" },
  { id: "ever-night", title: "Ever Night", altTitle: "将夜", genre: ["Action", "Drama", "Fantasy", "Historical"], rating: 8.2, status: "Completed", type: "Donghua", studio: "Croton Media", network: "Tencent", episodeCount: 2, color: "606c38", season: "Winter 2018", duration: "45 min per ep", subber: "Muizzaq", postedBy: "Dongdong" },
  { id: "above-myriads", title: "Above Myriads", altTitle: "万古神话", genre: ["Action", "Adventure", "Fantasy"], rating: 7.5, status: "Dropped", type: "Donghua", studio: "Tencent Penguin", network: "Tencent", episodeCount: 2, color: "bc6c25", season: "Fall 2023", duration: "20 min per ep", subber: "Mbgxbahlil", postedBy: "Dongdong" },
  { id: "cultivators-vs-superheroes", title: "Cultivators vs Superheroes", genre: ["Action", "Comedy", "Fantasy", "Game"], rating: 7.2, status: "Ongoing", type: "Donghua", studio: "Motion Magic", network: "Bilibili", episodeCount: 2, releaseDay: "Kamis", releaseTime: "15:00", showInSlider: false, color: "d62828", season: "Summer 2025", duration: "12 min per ep", subber: "Naruto", postedBy: "Dongdong" },
  { id: "100000-years-of-refining-qi", title: "100.000 Years of Refining Qi", altTitle: "炼气十万年", genre: ["Action", "Adventure", "Fantasy", "Sci-fi"], rating: 8.83, status: "Ongoing", type: "Donghua", studio: "Alpha Group", network: "Tencent", episodeCount: 2, releaseDay: "Selasa", releaseTime: "22:00", showInSlider: false, color: "007f5f", season: "Spring 2023", duration: "20 min per ep", subber: "Tio", postedBy: "Dongdong" },
  { id: "ze-tian-ji-season-1", title: "Ze Tian Ji Season 1", altTitle: "择天记", genre: ["Action", "Adventure", "Fantasy", "Historical"], rating: 8.5, status: "Completed", type: "Donghua", studio: "Original Force", network: "Tencent", episodeCount: 2, color: "3a0ca3", season: "Fall 2017", duration: "20 min per ep", subber: "Muizzaq", postedBy: "Dongdong" },
  { id: "x-epoch-of-dragon", title: "X-Epoch of Dragon", genre: ["Action", "Fantasy", "Sci-fi"], rating: 6.9, status: "Upcoming", type: "Donghua", studio: "Original Force", network: "Tencent", episodeCount: 0, color: "4361ee", season: "Winter 2026", duration: "20 min per ep", postedBy: "Dongdong" },
  { id: "quanzhi-gaoshou-season-3", title: "Quanzhi Gaoshou Season 3", altTitle: "全职高手", genre: ["Action", "Game", "Friendship"], rating: 8.6, status: "Completed", type: "Donghua", studio: "Original Force", network: "Tencent", episodeCount: 2, color: "0077b6", season: "Summer 2020", duration: "20 min per ep", subber: "Muizzaq", postedBy: "Dongdong" },
  { id: "swallowed-star-movie", title: "Swallowed Star Movie: Blood River Continent", genre: ["Action", "Adventure", "Fantasy", "Sci-fi"], rating: 7.8, status: "Completed", type: "Movie", studio: "Original Force", network: "Tencent", episodeCount: 1, color: "780000", season: "Winter 2024", duration: "90 min", subber: "yui", postedBy: "Dongdong" },
  { id: "soul-land-movie", title: "Soul Land Movie: Sword Dao Chen Xin", genre: ["Action", "Adventure", "Cultivation", "Fantasy"], rating: 8.1, status: "Completed", type: "Movie", studio: "Original Force", network: "Tencent", episodeCount: 1, color: "6d597a", season: "Summer 2021", duration: "100 min", subber: "Join", postedBy: "Dongdong" },
];

export const SEED_ANIME: Anime[] = RAW.map((r, idx) => {
  const episodes = makeEpisodes(r.id, r.episodeCount, idx * 2);
  return {
    id: r.id,
    title: r.title,
    altTitle: r.altTitle || undefined,
    synopsis:
      "Sinopsis singkat untuk " +
      r.title +
      ". Ikuti perjalanan penuh aksi, petualangan, dan pertarungan epik di dunia kultivasi yang luas dan penuh bahaya.",
    status: r.status,
    studio: r.studio,
    network: r.network,
    genre: r.genre,
    posterUrl: PLACEHOLDER(247, 350, r.color, "ffffff", r.title),
    coverUrl: PLACEHOLDER(1200, 500, "1a1a1a", r.color, r.title),
    rating: r.rating,
    releaseDate: new Date(Date.now() - idx * 86400000 * 30).toISOString().slice(0, 10),
    type: r.type,
    totalEpisodes: episodes.length,
    createdAt: new Date(Date.now() - idx * 3600 * 1000 * 6).toISOString(),
    episodes,
    releaseDay: r.releaseDay,
    releaseTime: r.releaseTime,
    showInSlider: r.showInSlider,
    season: r.season,
    duration: r.duration,
    subber: r.subber,
    postedBy: r.postedBy || "Dongdong",
    updatedAt: new Date().toISOString(),
  };
});

export const GENRE_LIST = [
  "Action",
  "Adventure",
  "Fantasy",
  "Martial Arts",
  "Drama",
  "Comedy",
  "Sci-fi",
  "Romance",
  "Friendship",
  "Game",
  "Historical",
  "Reincarnation",
];
export const RECOMMEND_GENRE_TABS = ["Friendship", "Game", "Historical", "Reincarnation", "Action"];
export const SEASON_LIST = ["Winter 2026", "Spring 2026", "Summer 2025", "Fall 2025", "Spring 2023"];

export const RELEASE_DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu", "Minggu"] as const;
