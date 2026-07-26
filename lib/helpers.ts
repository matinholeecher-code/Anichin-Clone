export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateId(prefix = "id"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function parseTags(input: string): string[] {
  return input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function isIframeFriendly(url: string): boolean {
  const blocked = ["mega.nz", "mediafire.com", "drive.google.com/file", "docs.google.com"];
  return !blocked.some((b) => url.includes(b));
}

export function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

const DAY_INDEX: Record<string, number> = {
  Minggu: 0,
  Senin: 1,
  Selasa: 2,
  Rabu: 3,
  Kamis: 4,
  "Jum'at": 5,
  Sabtu: 6,
};

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  label: string;
  isLive: boolean;
}

export function getNextRelease(day?: string, time?: string): Date | null {
  if (!day || !(day in DAY_INDEX)) return null;
  const [hh, mm] = (time || "00:00").split(":").map((n) => parseInt(n, 10) || 0);
  const targetDow = DAY_INDEX[day];
  const now = new Date();
  const next = new Date(now);
  next.setHours(hh, mm, 0, 0);
  let diffDays = (targetDow - now.getDay() + 7) % 7;
  if (diffDays === 0 && next.getTime() <= now.getTime()) {
    diffDays = 7;
  }
  next.setDate(now.getDate() + diffDays);
  return next;
}

export function getCountdown(day?: string, time?: string): Countdown {
  const target = getNextRelease(day, time);
  if (!target) {
    return { days: 0, hours: 0, minutes: 0, label: "-", isLive: false };
  }
  const diffMs = target.getTime() - Date.now();
  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, label: "Tayang sekarang", isLive: true };
  }
  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} hari`);
  if (hours > 0 || days > 0) parts.push(`${hours} jam`);
  parts.push(`${minutes} menit`);
  return { days, hours, minutes, label: `${parts.join(" ")} lagi`, isLive: false };
}
