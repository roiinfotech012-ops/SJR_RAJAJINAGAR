import { newsEvents, type NewsEvent } from "@/data/newsEvents";
import { schoolEvents, type SchoolEvent } from "@/data/events";
import type { AdminContentItem, AdminContentPayload } from "@/lib/api";

export type NewsDisplayItem = {
  key: string;
  source: "database" | "frontend";
  adminItem?: AdminContentItem;
  slug: string;
  title: string;
  date: string;
  dateValue: string;
  summary: string;
  body: string[];
  image: string;
  gallery: string[];
  href: string;
  isVisible: boolean;
  updatedAt?: string;
};

export const normalizeSafeImage = (src?: string | null): string => {
  if (!src || !src.trim()) return "/placeholder.svg";
  const s = src.trim();
  if (s.startsWith("/") && !s.startsWith("//")) {
    try {
      return encodeURI(decodeURI(s));
    } catch {
      return s;
    }
  }
  return s;
};

export const formatNewsDate = (value?: string | null) =>
  value ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)) : "";

export const createNewsSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getAdminNewsSlug = (item: AdminContentItem) => {
  const fieldSlug = typeof item.fields?.slug === "string" ? item.fields.slug : "";
  return fieldSlug || createNewsSlug(item.title) || item.id;
};

const adminNewsToDisplay = (item: AdminContentItem): NewsDisplayItem => {
  const slug = getAdminNewsSlug(item);
  const gallery = [item.image_url, ...((item.fields?.gallery as string[] | undefined) || [])]
    .filter(Boolean)
    .map(String)
    .map(normalizeSafeImage);

  return {
    key: `database-${item.id}`,
    source: "database",
    adminItem: item,
    slug,
    title: item.title,
    date: formatNewsDate(item.published_at),
    dateValue: item.published_at || item.created_at,
    summary: item.subtitle || item.body || "",
    body: (item.body || item.subtitle || "").split(/\n+/).map((part) => part.trim()).filter(Boolean),
    image: normalizeSafeImage(item.image_url),
    gallery: gallery.length ? gallery : ["/placeholder.svg"],
    href: `/news/${slug || item.id}`,
    isVisible: item.is_visible,
    updatedAt: item.updated_at,
  };
};

const newsEventToDisplay = (item: NewsEvent): NewsDisplayItem => ({
  key: `frontend-${item.slug}`,
  source: "frontend",
  slug: item.slug,
  title: item.title,
  date: item.date,
  dateValue: item.sortDate,
  summary: item.summary,
  body: item.body,
  image: normalizeSafeImage(item.image),
  gallery: (item.gallery || []).map((g) => normalizeSafeImage(g.src)),
  href: `/news/${item.slug}`,
  isVisible: true,
});

const schoolEventToDisplay = (item: SchoolEvent): NewsDisplayItem => ({
  key: `frontend-event-${item.id}`,
  source: "frontend",
  slug: item.id,
  title: item.title,
  date: item.date,
  dateValue: item.academicYear,
  summary: item.summary,
  body: [item.description],
  image: normalizeSafeImage(item.featuredImage),
  gallery: (item.galleryImages || []).map(normalizeSafeImage),
  href: `/news/${item.id}`,
  isVisible: true,
});

const deletedSlugsKey = "sjr_deleted_news_slugs";

export const getDeletedNewsSlugs = (): string[] => {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(deletedSlugsKey) : null;
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const markNewsSlugDeleted = (slug: string) => {
  try {
    const current = getDeletedNewsSlugs();
    if (!current.includes(slug)) {
      current.push(slug);
      window.localStorage.setItem(deletedSlugsKey, JSON.stringify(current));
    }
  } catch {}
};

export const mergeNewsItems = (adminNews: AdminContentItem[] = []): NewsDisplayItem[] => {
  const bySlug = new Map<string, NewsDisplayItem>();
  const deletedSlugs = new Set(getDeletedNewsSlugs());

  // 1. Add all rich school news and events
  newsEvents.forEach((item) => bySlug.set(item.slug, newsEventToDisplay(item)));

  // 2. Add extra campus events if not already present
  schoolEvents.forEach((item) => {
    if (!bySlug.has(item.id)) {
      bySlug.set(item.id, schoolEventToDisplay(item));
    }
  });

  // 3. Database admin records take priority and overlay/add
  adminNews.forEach((item) => {
    const displayItem = adminNewsToDisplay(item);
    bySlug.set(displayItem.slug || item.id, displayItem);
  });

  return Array.from(bySlug.values()).filter((item) => !deletedSlugs.has(item.slug));
};

export const findNewsItem = (adminNews: AdminContentItem[], slug?: string): NewsDisplayItem | undefined => {
  if (!slug) return undefined;
  const deletedSlugs = new Set(getDeletedNewsSlugs());
  if (deletedSlugs.has(slug)) return undefined;

  const adminItem = adminNews.find((item) => item.id === slug || getAdminNewsSlug(item) === slug);
  if (adminItem) return adminNewsToDisplay(adminItem);

  const foundNews = newsEvents.find((item) => item.slug === slug);
  if (foundNews) return newsEventToDisplay(foundNews);

  const foundSchoolEvent = schoolEvents.find((item) => item.id === slug);
  return foundSchoolEvent ? schoolEventToDisplay(foundSchoolEvent) : undefined;
};

export const newsDisplayToPayload = (item: NewsDisplayItem): AdminContentPayload => ({
  title: item.title,
  subtitle: item.summary,
  body: item.body.join("\n\n"),
  image_url: item.image,
  is_visible: item.isVisible,
  fields: {
    slug: item.slug,
    gallery: item.gallery,
  },
});
