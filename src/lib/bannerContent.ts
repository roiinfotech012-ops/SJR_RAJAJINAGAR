import type { AdminContentItem, AdminContentPayload } from "@/lib/api";

export interface BannerSlide {
  id?: string;
  adminId?: string;
  source?: "database" | "frontend";
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  isVisible?: boolean;
  displayOrder?: number;
  createdAt?: string;
}

export const defaultBannerSlides: BannerSlide[] = [
  {
    id: "banner-1",
    source: "frontend",
    tag: "Welcome to SJR",
    title: "Excellence in Education",
    subtitle: "Shaping Tomorrow's Leaders Today",
    description: "Where tradition meets innovation in a vibrant, value-driven CBSE learning environment.",
    image: "/images/Banner/banner-school-building.jpg",
    isVisible: true,
    displayOrder: 1,
  },
  {
    id: "banner-2",
    source: "frontend",
    tag: "A Legacy Since 1981",
    title: "A Legacy of Learning",
    subtitle: "Building Character & Confidence",
    description: "Committed to academic brilliance, ethical integrity, and lifelong learning for every child.",
    image: "/images/Banner/banner-classroom.jpg",
    isVisible: true,
    displayOrder: 2,
  },
  {
    id: "banner-3",
    source: "frontend",
    tag: "Future-Ready Campus",
    title: "Modern Learning",
    subtitle: "State-of-the-Art Facilities",
    description: "Equipped with AI flat panels, robotics laboratories, and digital infrastructure for progressive education.",
    image: "/images/Banner/banner-library.jpg",
    isVisible: true,
    displayOrder: 3,
  },
  {
    id: "banner-4",
    source: "frontend",
    tag: "Beyond The Classroom",
    title: "Holistic Development",
    subtitle: "Beyond Academics, Building Citizens",
    description: "Sports, taekwondo, yoga, arts, and values come together for complete, well-rounded development.",
    image: "/images/Banner/banner-science-lab.jpg",
    isVisible: true,
    displayOrder: 4,
  },
  {
    id: "banner-5",
    source: "frontend",
    tag: "STEM & Robotics",
    title: "Innovation & Robotics",
    subtitle: "Hands-on Experiential Learning",
    description: "Empowering young innovators with practical robotics, creative problem-solving, and future-ready technology skills.",
    image: "/images/Banner/banner-robotics-stem.jpg",
    isVisible: true,
    displayOrder: 5,
  },
  {
    id: "banner-6",
    source: "frontend",
    tag: "Digital Excellence",
    title: "Technology in Education",
    subtitle: "Modern Computer Laboratory",
    description: "Equipping students with essential digital literacy, computing competence, and tech-driven academic skills.",
    image: "/images/Banner/banner-computer-lab.jpg",
    isVisible: true,
    displayOrder: 6,
  },
  {
    id: "banner-7",
    source: "frontend",
    tag: "Sports & Athletics",
    title: "Champions on the Field",
    subtitle: "Sportsmanship & Active Life",
    description: "Fostering physical fitness, agility, and teamwork through dedicated coaching and outdoor sports courts.",
    image: "/images/Banner/banner-sports-volleyball.jpg",
    isVisible: true,
    displayOrder: 7,
  },
  {
    id: "banner-8",
    source: "frontend",
    tag: "Scientific Inquiry",
    title: "Discovery & Exploration",
    subtitle: "Composite Science Laboratories",
    description: "Cultivating scientific temper and hands-on investigative learning through guided laboratory experiments.",
    image: "/images/Banner/banner-science-practical.jpg",
    isVisible: true,
    displayOrder: 8,
  },
  {
    id: "banner-9",
    source: "frontend",
    tag: "Foundational Years",
    title: "Joyful Early Education",
    subtitle: "Play-Way & Activity Learning",
    description: "A warm and stimulating environment where pre-primary children learn, play, and grow in confidence every day.",
    image: "/images/Banner/banner-early-childhood.jpg",
    isVisible: true,
    displayOrder: 9,
  },
];

export const adminBannerToDisplay = (item: AdminContentItem): BannerSlide => ({
  id: item.id,
  adminId: item.id,
  source: "database",
  tag: String(item.fields?.tag || item.category || "SJRPS Highlight"),
  title: item.title,
  subtitle: item.subtitle || "",
  description: item.body || "",
  image: item.image_url || "/placeholder.svg",
  isVisible: item.is_visible,
  displayOrder: item.display_order || 0,
  createdAt: item.published_at || item.created_at,
});

const deletedBannersKey = "sjr_deleted_banners";

export const getDeletedBannerKeys = (): string[] => {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(deletedBannersKey) : null;
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const markBannerDeleted = (key: string) => {
  try {
    const current = getDeletedBannerKeys();
    const clean = key.trim().toLowerCase();
    if (clean && !current.includes(clean)) {
      current.push(clean);
      window.localStorage.setItem(deletedBannersKey, JSON.stringify(current));
    }
  } catch {}
};

export const unmarkBannerDeleted = (key: string) => {
  try {
    const clean = key.trim().toLowerCase();
    const next = getDeletedBannerKeys().filter((item) => item !== clean);
    window.localStorage.setItem(deletedBannersKey, JSON.stringify(next));
  } catch {}
};

export const mergeBannerItems = (adminItems: AdminContentItem[] = []): BannerSlide[] => {
  const byKey = new Map<string, BannerSlide>();
  const deletedKeys = new Set(getDeletedBannerKeys());

  defaultBannerSlides.forEach((banner) => {
    const key = (banner.id || banner.title).toLowerCase().trim();
    byKey.set(key, banner);
  });

  adminItems.forEach((item) => {
    const banner = adminBannerToDisplay(item);
    const key = (banner.adminId || banner.title).toLowerCase().trim();
    const existing = byKey.get(key) || Array.from(byKey.values()).find((b) => b.title.toLowerCase().trim() === banner.title.toLowerCase().trim());
    if (existing) {
      const existingKey = (existing.id || existing.title).toLowerCase().trim();
      byKey.set(existingKey, {
        ...existing,
        ...banner,
        displayOrder: banner.displayOrder || existing.displayOrder || 0,
      });
    } else {
      byKey.set(key, banner);
    }
  });

  return Array.from(byKey.values())
    .filter((b) => {
      const idKey = (b.id || "").toLowerCase().trim();
      const titleKey = b.title.toLowerCase().trim();
      return !deletedKeys.has(idKey) && !deletedKeys.has(titleKey);
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

export const bannerToPayload = (banner: BannerSlide, displayOrder = banner.displayOrder || 0): AdminContentPayload => ({
  title: banner.title.trim(),
  subtitle: banner.subtitle.trim(),
  body: banner.description.trim(),
  image_url: banner.image || "/placeholder.svg",
  category: banner.tag.trim() || "Welcome to SJR",
  is_visible: banner.isVisible !== false,
  display_order: displayOrder,
  fields: {
    tag: banner.tag.trim() || "Welcome to SJR",
  },
});
