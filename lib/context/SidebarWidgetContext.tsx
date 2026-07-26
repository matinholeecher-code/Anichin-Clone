"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface SidebarAnimeWidget {
  animeId: string;
  currentEpisodeId: string;
}

interface SidebarWidgetContextType {
  widget: SidebarAnimeWidget | null;
  setWidget: (w: SidebarAnimeWidget | null) => void;
}

const SidebarWidgetContext = createContext<SidebarWidgetContextType | undefined>(undefined);

export function SidebarWidgetProvider({ children }: { children: ReactNode }) {
  const [widget, setWidget] = useState<SidebarAnimeWidget | null>(null);
  return <SidebarWidgetContext.Provider value={{ widget, setWidget }}>{children}</SidebarWidgetContext.Provider>;
}

export function useSidebarWidget() {
  const ctx = useContext(SidebarWidgetContext);
  if (!ctx) throw new Error("useSidebarWidget must be used within SidebarWidgetProvider");
  return ctx;
}
