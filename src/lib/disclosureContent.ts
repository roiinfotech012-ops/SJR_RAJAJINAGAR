import type { AdminContentItem, AdminContentPayload } from "@/lib/api";
import { mandatoryDocuments, type MandatoryDocument as BaseMandatoryDocument } from "@/data/disclosures";

export interface MandatoryDocument {
  id?: string | number;
  adminId?: string;
  source?: "database" | "frontend";
  title: string;
  category: "Affiliation & Society" | "Safety & Infrastructure" | "Academic & Compliance" | string;
  filename: string;
  fileSize: string;
  pdfUrl: string;
  description: string;
  isAvailable: boolean;
  isVisible?: boolean;
  displayOrder?: number;
}

export const DISCLOSURE_CATEGORIES = [
  "Affiliation & Society",
  "Safety & Infrastructure",
  "Academic & Compliance",
] as const;

export const frontendDisclosures: MandatoryDocument[] = mandatoryDocuments.map((doc, index) => ({
  id: `doc-${doc.id}`,
  source: "frontend",
  title: doc.title,
  category: doc.category,
  filename: doc.filename,
  fileSize: doc.fileSize,
  pdfUrl: doc.pdfUrl,
  description: doc.description,
  isAvailable: doc.isAvailable !== false,
  isVisible: true,
  displayOrder: index + 1,
}));

export const adminDisclosureToDisplay = (item: AdminContentItem): MandatoryDocument => ({
  id: `database-${item.id}`,
  adminId: item.id,
  source: "database",
  title: item.title,
  category: item.category || String(item.fields?.category || "Affiliation & Society"),
  filename: String(item.fields?.filename || item.subtitle || `${item.title}.pdf`),
  fileSize: String(item.fields?.fileSize || "PDF Document"),
  pdfUrl: item.image_url || String(item.fields?.pdfUrl || ""),
  description: item.body || String(item.fields?.description || ""),
  isAvailable: item.fields?.isAvailable !== false,
  isVisible: item.is_visible,
  displayOrder: item.display_order || 0,
});

const deletedDisclosuresKey = "sjr_deleted_disclosures";

export const getDeletedDisclosureTitles = (): string[] => {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(deletedDisclosuresKey) : null;
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const markDisclosureDeleted = (title: string) => {
  try {
    const current = getDeletedDisclosureTitles();
    const clean = title.trim().toLowerCase();
    if (!current.includes(clean)) {
      current.push(clean);
      window.localStorage.setItem(deletedDisclosuresKey, JSON.stringify(current));
    }
  } catch {}
};

export const mergeDisclosureItems = (adminItems: AdminContentItem[] = []): MandatoryDocument[] => {
  const byTitle = new Map<string, MandatoryDocument>();
  const deletedTitles = new Set(getDeletedDisclosureTitles());

  // 1. Add standard frontend documents
  frontendDisclosures.forEach((doc) => {
    byTitle.set(doc.title.toLowerCase().trim(), doc);
  });

  // 2. Database records take priority
  adminItems.forEach((item) => {
    const doc = adminDisclosureToDisplay(item);
    const key = doc.title.toLowerCase().trim();
    const existing = byTitle.get(key);
    byTitle.set(key, {
      ...existing,
      ...doc,
      displayOrder: doc.displayOrder || existing?.displayOrder || 999,
    });
  });

  return Array.from(byTitle.values())
    .filter((doc) => !deletedTitles.has(doc.title.toLowerCase().trim()))
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
};

export const disclosureToPayload = (doc: MandatoryDocument, displayOrder = doc.displayOrder || 0): AdminContentPayload => ({
  title: doc.title.trim(),
  subtitle: doc.filename ? `${doc.filename} (${doc.fileSize || "PDF"})` : doc.fileSize || "Official Document",
  body: (doc.description || "").trim(),
  image_url: doc.pdfUrl.trim(),
  category: doc.category || "Affiliation & Society",
  is_visible: doc.isVisible !== false,
  display_order: displayOrder,
  fields: {
    filename: doc.filename || `${doc.title}.pdf`,
    fileSize: doc.fileSize || "PDF Document",
    pdfUrl: doc.pdfUrl.trim(),
    description: (doc.description || "").trim(),
    category: doc.category || "Affiliation & Society",
    isAvailable: doc.isAvailable !== false,
  },
});

export const disclosureOrderKey = (items: MandatoryDocument[]) => items.map((i) => i.title).join("|");
