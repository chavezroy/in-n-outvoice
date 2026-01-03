import { Template } from "@/types/template";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "./utils";
import { getDefaultTemplates } from "./default-templates";

/**
 * Get all templates from localStorage
 */
export function getTemplates(): Template[] {
  const templates = getStorageItem<Template[]>(STORAGE_KEYS.TEMPLATES);
  
  // If no templates exist, initialize with defaults
  if (!templates || templates.length === 0) {
    const defaultTemplates = getDefaultTemplates();
    setStorageItem(STORAGE_KEYS.TEMPLATES, defaultTemplates);
    return defaultTemplates;
  }
  
  return templates;
}

/**
 * Get a single template by ID
 */
export function getTemplate(id: string): Template | null {
  const templates = getTemplates();
  return templates.find((t) => t.id === id) || null;
}

/**
 * Save a template to localStorage
 */
export function saveTemplate(template: Template): boolean {
  const templates = getTemplates();
  const existingIndex = templates.findIndex((t) => t.id === template.id);

  if (existingIndex >= 0) {
    templates[existingIndex] = template;
  } else {
    templates.push(template);
  }

  return setStorageItem(STORAGE_KEYS.TEMPLATES, templates);
}

/**
 * Initialize templates if they don't exist
 */
export function initializeTemplates(): void {
  const templates = getStorageItem<Template[]>(STORAGE_KEYS.TEMPLATES);
  if (!templates || templates.length === 0) {
    const defaultTemplates = getDefaultTemplates();
    setStorageItem(STORAGE_KEYS.TEMPLATES, defaultTemplates);
  }
}

