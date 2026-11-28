import type { AdminContentItem, AdminContentPayload } from "@/lib/api";
import { schoolConfig } from "@/schoolConfig";

export interface LatestNewsItem {
  id?: string;
  adminId?: string;
  source?: "database" | "frontend";
  text: string;
  isVisible?: boolean;
  displayOrder?: number;
  createdAt?: string;
}

export const defaultLatestNewsItems: LatestNewsItem[] = [
  {
    id: "latest-news-1",
    source: "frontend",
    text: schoolConfig.fullName,
    isVisible: true,
    displayOrder: 1,
  },
  {
    id: "latest-news-2",
    source: "frontend",
    text: "Admissions Open from Pre-KG to Class 10 (AY 2026–27)",
    isVisible: true,
    displayOrder: 2,
  },
  {
    id: "latest-news-3",
    source: "frontend",
    text: "CBSE Affiliation No: 831136 | School Code: 46766",
    isVisible: true,
    displayOrder: 3,
  },
  {
    id: "latest-news-4",
    source: "frontend",
    text: "Empowering Young Minds Through Quality Education Since 1981",
    isVisible: true,
    displayOrder: 4,
  },
];

export const adminLatestNewsToDisplay = (item: AdminContentItem): LatestNewsItem => ({
  id: item.id,
  adminId: item.id,
  source: "database",
  text: item.title,
  isVisible: item.is_visible,
  displayOrder: item.display_order || 0,
  createdAt: item.published_at || item.created_at,
});

const deletedLatestNewsKey = "sjr_deleted_latest_news";

export const getDeletedLatestNewsKeys = (): string[] => {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(deletedLatestNewsKey) : null;
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const markLatestNewsDeleted = (key: string) => {
  try {
    const current = getDeletedLatestNewsKeys();
    const clean = key.trim().toLowerCase();
    if (clean && !current.includes(clean)) {
      current.push(clean);
      window.localStorage.setItem(deletedLatestNewsKey, JSON.stringify(current));
    }
  } catch {}
};

export const unmarkLatestNewsDeleted = (key: string) => {
  try {
    const clean = key.trim().toLowerCase();
    const next = getDeletedLatestNewsKeys().filter((item) => item !== clean);
    window.localStorage.setItem(deletedLatestNewsKey, JSON.stringify(next));
  } catch {}
};

export const mergeLatestNewsItems = (adminItems: AdminContentItem[] = []): LatestNewsItem[] => {
  const byKey = new Map<string, LatestNewsItem>();
  const deletedKeys = new Set(getDeletedLatestNewsKeys());

  defaultLatestNewsItems.forEach((item) => {
    const key = (item.id || item.text).toLowerCase().trim();
    byKey.set(key, item);
  });

  adminItems.forEach((item) => {
    const news = adminLatestNewsToDisplay(item);
    const key = (news.adminId || news.text).toLowerCase().trim();
    const existing =
      byKey.get(key) ||
      Array.from(byKey.values()).find((candidate) => candidate.text.toLowerCase().trim() === news.text.toLowerCase().trim());
    if (existing) {
      const existingKey = (existing.id || existing.text).toLowerCase().trim();
      byKey.set(existingKey, {
        ...existing,
        ...news,
        displayOrder: news.displayOrder || existing.displayOrder || 0,
      });
    } else {
      byKey.set(key, news);
    }
  });

  return Array.from(byKey.values())
    .filter((item) => {
      const idKey = (item.id || "").toLowerCase().trim();
      const textKey = item.text.toLowerCase().trim();
      return !deletedKeys.has(idKey) && !deletedKeys.has(textKey);
    })
    .sort((a, b) => {
      const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (aCreated && bCreated && aCreated !== bCreated) return bCreated - aCreated;
      if (aCreated && !bCreated) return -1;
      if (!aCreated && bCreated) return 1;
      return (a.displayOrder || 0) - (b.displayOrder || 0);
    });
};

export const latestNewsToPayload = (item: LatestNewsItem, displayOrder = item.displayOrder || 0): AdminContentPayload => ({
  title: item.text.trim(),
  subtitle: "",
  body: item.text.trim(),
  image_url: "",
  category: "Latest News",
  is_visible: item.isVisible !== false,
  display_order: displayOrder,
  fields: {},
});
