import { Template, templates as staticTemplates } from "@/data/templates";

// Runtime template store — starts with static templates, admin can add/edit/delete
// In production: replace with MongoDB / Supabase
const templateStore = new Map<string, Template>(
  staticTemplates.map((t) => [t.id, t])
);

export function getAllTemplates(): Template[] {
  return Array.from(templateStore.values());
}

export function getTemplateById(id: string): Template | undefined {
  return templateStore.get(id);
}

export function getTemplateBySlug(slug: string): Template | undefined {
  return Array.from(templateStore.values()).find((t) => t.slug === slug);
}

export function createTemplate(data: Omit<Template, "id">): Template {
  const id = `t${Date.now()}`;
  const template: Template = { id, ...data };
  templateStore.set(id, template);
  return template;
}

export function updateTemplate(id: string, data: Partial<Template>): Template | null {
  const existing = templateStore.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...data, id };
  templateStore.set(id, updated);
  return updated;
}

export function deleteTemplate(id: string): boolean {
  return templateStore.delete(id);
}

export function getFeaturedTemplates(): Template[] {
  return Array.from(templateStore.values()).filter((t) => t.isFeatured);
}