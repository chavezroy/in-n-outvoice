import { BrandingSettings } from "@/types/user";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "./utils";

export interface UserSettings {
  branding?: BrandingSettings;
  preferences?: {
    theme?: "light" | "dark" | "system";
    autoSave?: boolean;
  };
}

/**
 * Get user settings from localStorage
 */
export function getUserSettings(): UserSettings {
  return getStorageItem<UserSettings>(STORAGE_KEYS.SETTINGS) || {};
}

/**
 * Save user settings to localStorage
 */
export function saveUserSettings(settings: UserSettings): boolean {
  const currentSettings = getUserSettings();
  const updatedSettings: UserSettings = {
    ...currentSettings,
    ...settings,
  };
  return setStorageItem(STORAGE_KEYS.SETTINGS, updatedSettings);
}

/**
 * Get branding settings
 */
export function getBrandingSettings(): BrandingSettings | undefined {
  const settings = getUserSettings();
  return settings.branding;
}

/**
 * Save branding settings
 */
export function saveBrandingSettings(branding: BrandingSettings): boolean {
  return saveUserSettings({ branding });
}

