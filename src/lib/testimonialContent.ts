import type { AdminContentItem, AdminContentPayload } from "@/lib/api";
import { authenticTestimonials, type TestimonialItem } from "@/data/testimonials";

export type TestimonialDisplayItem = {
  key: string;
  source: "database" | "frontend";
  adminItem?: AdminContentItem;
  name: string;
  role: string;
  childName?: string;
  className?: string;
  category: string;
  quote: string;
  image: string;
  imageAlt?: string;
  language?: "en" | "kn";
  subheadings?: { title: string; text: string }[];
  isVisible: boolean;
  displayOrder: number;
};

const frontendTestimonials: TestimonialDisplayItem[] = authenticTestimonials.map((t, idx) => ({
  key: `frontend-${t.id}`,
  source: "frontend",
  name: t.parentName,
  role: `Parent of ${t.childName} (${t.className})`,
  childName: t.childName,
  className: t.className,
  category: "Parent",
  image: t.image,
  imageAlt: t.imageAlt,
  quote: t.quote,
  language: t.language,
  subheadings: t.subheadings,
  isVisible: true,
  displayOrder: idx + 1,
}));

const databaseTestimonialToDisplay = (item: AdminContentItem): TestimonialDisplayItem => ({
  key: `database-${item.id}`,
  source: "database",
  adminItem: item,
  name: item.title,
  role: item.subtitle || "",
  category: item.category || "Parent",
  quote: item.body || "",
  image: item.image_url || "/placeholder.svg",
  isVisible: item.is_visible,
  displayOrder: item.display_order || 0,
});

const deletedTestimonialsKey = "sjr_deleted_testimonials";

export const getDeletedTestimonialNames = (): string[] => {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(deletedTestimonialsKey) : null;
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const markTestimonialDeleted = (name: string) => {
  try {
    const current = getDeletedTestimonialNames();
    const clean = name.trim().toLowerCase();
    if (!current.includes(clean)) {
      current.push(clean);
      window.localStorage.setItem(deletedTestimonialsKey, JSON.stringify(current));
    }
  } catch {}
};

export const mergeTestimonialItems = (adminTestimonials: AdminContentItem[] = []) => {
  const byName = new Map<string, TestimonialDisplayItem>();
  const deletedNames = new Set(getDeletedTestimonialNames());

  frontendTestimonials.forEach((item) => byName.set(item.name.toLowerCase(), item));
  adminTestimonials.forEach((item) => {
    const displayItem = databaseTestimonialToDisplay(item);
    byName.set(displayItem.name.toLowerCase(), displayItem);
  });
  return Array.from(byName.values())
    .filter((item) => !deletedNames.has(item.name.toLowerCase()))
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
};

export const testimonialDisplayToPayload = (item: TestimonialDisplayItem): AdminContentPayload => ({
  title: item.name,
  subtitle: item.role,
  body: item.quote,
  image_url: item.image === "/placeholder.svg" ? "" : item.image,
  category: item.category,
  published_at: "",
  is_visible: item.isVisible,
  display_order: item.displayOrder,
  fields: item.adminItem?.fields || {},
});
