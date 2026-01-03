/**
 * LocalStorage utility functions
 */

const STORAGE_PREFIX = "outvoice:";
const DATA_VERSION = "1.0.0";

export const STORAGE_KEYS = {
  PROPOSALS: `${STORAGE_PREFIX}proposals`,
  TEMPLATES: `${STORAGE_PREFIX}templates`,
  USERS: `${STORAGE_PREFIX}users`,
  CURRENT_USER: `${STORAGE_PREFIX}currentUser`,
  SETTINGS: `${STORAGE_PREFIX}settings`,
  VERSION: `${STORAGE_PREFIX}version`,
} as const;

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get item from localStorage with error handling
 */
export function getStorageItem<T>(key: string): T | null {
  if (!isStorageAvailable()) {
    console.warn("localStorage is not available");
    return null;
  }

  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
}

/**
 * Set item in localStorage with error handling
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  if (!isStorageAvailable()) {
    console.warn("localStorage is not available");
    return false;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      console.error("localStorage quota exceeded");
    } else {
      console.error(`Error writing to localStorage (${key}):`, error);
    }
    return false;
  }
}

/**
 * Remove item from localStorage
 */
export function removeStorageItem(key: string): boolean {
  if (!isStorageAvailable()) return false;

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Initialize storage with version
 */
export function initializeStorage(): void {
  const currentVersion = getStorageItem<string>(STORAGE_KEYS.VERSION);
  if (!currentVersion) {
    setStorageItem(STORAGE_KEYS.VERSION, DATA_VERSION);
  }
  // Future: Add migration logic here when version changes
}

/**
 * Clear all app data from localStorage
 */
export function clearAllStorage(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    removeStorageItem(key);
  });
}

/**
 * SessionStorage utility functions
 * Used for temporary session-specific data (like view preferences)
 */

/**
 * Get item from sessionStorage with error handling
 */
export function getSessionItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  
  try {
    const item = sessionStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from sessionStorage (${key}):`, error);
    return null;
  }
}

/**
 * Set item in sessionStorage with error handling
 */
export function setSessionItem<T>(key: string, value: T): boolean {
  if (typeof window === "undefined") return false;
  
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to sessionStorage (${key}):`, error);
    return false;
  }
}

/**
 * Remove item from sessionStorage
 */
export function removeSessionItem(key: string): boolean {
  if (typeof window === "undefined") return false;
  
  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from sessionStorage (${key}):`, error);
    return false;
  }
}

