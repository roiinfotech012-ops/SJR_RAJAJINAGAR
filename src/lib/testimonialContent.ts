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

export const mergeTestimonialItems = (adminTestimonials: AdminContentItem[] = []) => {
  const byName = new Map<string, TestimonialDisplayItem>();
  frontendTestimonials.forEach((item) => byName.set(item.name.toLowerCase(), item));
  adminTestimonials.forEach((item) => {
    const displayItem = databaseTestimonialToDisplay(item);
    byName.set(displayItem.name.toLowerCase(), displayItem);
  });
  return Array.from(byName.values()).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
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
