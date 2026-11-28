import type { AdminContentItem, AdminContentPayload } from "@/lib/api";
import { staffMembers, type StaffMember, type StaffCategory } from "@/data/staff";

export interface Teacher {
  id?: string;
  adminId?: string;
  source?: "database" | "frontend";
  name: string;
  designation: string;
  subject: string;
  qualification: string;
  experience: string;
  image: string;
  category?: string;
  section?: string;
  note?: string;
  isFeatured?: boolean;
  isVisible?: boolean;
  displayOrder?: number;
}

export const defaultFeaturedTeacherNames = new Set([
  "mrs. jyothi shashidhar",
  "mrs. vanajakshi a n",
  "mrs. sunitha g",
  "mrs. kavya nair",
]);

export const frontendTeachers: Teacher[] = staffMembers.map((s, index) => ({
  id: `staff-${s.id}`,
  source: "frontend",
  name: s.name,
  designation: s.designation,
  subject: s.subject,
  qualification: s.qualification || "Educational Faculty",
  experience: s.experience || "Dedicated Educator",
  image: s.photo || "/placeholder.svg",
  category: s.category,
  section: s.category,
  note: s.note,
  isFeatured: defaultFeaturedTeacherNames.has(s.name.toLowerCase()) || index < 4,
  isVisible: true,
  displayOrder: index + 1,
}));

export const adminTeacherToDisplay = (item: AdminContentItem): Teacher => ({
  id: `database-${item.id}`,
  adminId: item.id,
  source: "database",
  name: item.title,
  designation: item.subtitle || "",
  subject: item.category || String(item.fields?.subject || ""),
  qualification: item.body || String(item.fields?.qualification || ""),
  experience: String(item.fields?.experience || ""),
  image: item.image_url || "/placeholder.svg",
  category: String(item.fields?.category || item.category || "Secondary and High School"),
  section: String(item.fields?.section || item.category || "Secondary and High School"),
  note: item.fields?.note ? String(item.fields.note) : undefined,
  isFeatured: item.fields?.featured === true,
  isVisible: item.is_visible,
  displayOrder: item.display_order || 0,
});

const deletedTeachersKey = "sjr_deleted_teachers";

export const getDeletedTeacherNames = (): string[] => {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(deletedTeachersKey) : null;
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const markTeacherDeleted = (name: string) => {
  try {
    const current = getDeletedTeacherNames();
    const clean = name.trim().toLowerCase();
    if (!current.includes(clean)) {
      current.push(clean);
      window.localStorage.setItem(deletedTeachersKey, JSON.stringify(current));
    }
  } catch {}
};

export const mergeTeacherItems = (adminItems: AdminContentItem[] = []): Teacher[] => {
  const byName = new Map<string, Teacher>();
  const deletedNames = new Set(getDeletedTeacherNames());

  // 1. Add all standard frontend staff
  frontendTeachers.forEach((teacher) => {
    byName.set(teacher.name.toLowerCase().trim(), teacher);
  });

  // 2. Database records take priority (including newly created ones)
  adminItems.forEach((item) => {
    const teacher = adminTeacherToDisplay(item);
    const key = teacher.name.toLowerCase().trim();
    const existing = byName.get(key);
    byName.set(key, {
      ...existing,
      ...teacher,
      displayOrder: teacher.displayOrder || existing?.displayOrder || 0,
    });
  });

  return Array.from(byName.values())
    .filter((t) => !deletedNames.has(t.name.toLowerCase().trim()))
    .sort((a, b) => {
      const aCreated = a.adminItem?.created_at ? new Date(a.adminItem.created_at).getTime() : 0;
      const bCreated = b.adminItem?.created_at ? new Date(b.adminItem.created_at).getTime() : 0;
      if (aCreated && bCreated && aCreated !== bCreated) return bCreated - aCreated;
      if (aCreated && !bCreated) return -1;
      if (!aCreated && bCreated) return 1;
      return (a.displayOrder || 0) - (b.displayOrder || 0);
    });
};

export const teacherOrderKey = (items: Teacher[]) => items.map((item) => item.name).join("|");

export const teacherToPayload = (teacher: Teacher, displayOrder = teacher.displayOrder || 0): AdminContentPayload => ({
  title: teacher.name.trim(),
  subtitle: teacher.designation.trim(),
  body: teacher.qualification.trim(),
  image_url: teacher.image || "/placeholder.svg",
  category: teacher.category || teacher.subject || "Secondary and High School",
  is_visible: teacher.isVisible !== false,
  display_order: displayOrder,
  fields: {
    subject: teacher.subject.trim(),
    qualification: teacher.qualification.trim(),
    experience: teacher.experience.trim(),
    category: teacher.category || "Secondary and High School",
    section: teacher.section || teacher.category || "Secondary and High School",
    featured: teacher.isFeatured === true,
  },
});
