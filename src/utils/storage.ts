import { StoredQRItem } from '../types';

const STORAGE_KEY = 'qr-studio-recent-qrs';
const MAX_RECENT_ITEMS = 10;

/**
 * Safely retrieves stored recent QR codes from the current browser's localStorage.
 * Completely client-side and isolated to the active browser profile.
 * Falls back to [] if localStorage is empty, unavailable, or corrupted.
 */
export function getRecentQRCodes(): StoredQRItem[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    // Filter and sanitize items to prevent schema drift or corrupted entries
    return parsed.filter((item): item is StoredQRItem => {
      return (
        item &&
        typeof item.id === 'string' &&
        typeof item.type === 'string' &&
        typeof item.payload === 'string' &&
        item.formData &&
        item.settings &&
        typeof item.timestamp === 'number'
      );
    });
  } catch (err) {
    console.warn('Failed to parse recent QR codes from browser localStorage:', err);
    return [];
  }
}

/**
 * Saves a new or updated item into recent list, keeping at most MAX_RECENT_ITEMS.
 */
export function saveRecentQRCode(item: Omit<StoredQRItem, 'id' | 'timestamp'> & { id?: string }): StoredQRItem[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const current = getRecentQRCodes();
    const newItem: StoredQRItem = {
      ...item,
      id: item.id || `qr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
    };

    // Remove duplicates with the same payload and type to keep recent list fresh
    const filtered = current.filter(
      (existing) => !(existing.type === newItem.type && existing.payload === newItem.payload)
    );

    const updated = [newItem, ...filtered].slice(0, MAX_RECENT_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to save recent QR code to browser localStorage:', err);
    return getRecentQRCodes();
  }
}

/**
 * Deletes a single item from recent history in current browser
 */
export function deleteRecentQRCode(id: string): StoredQRItem[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const current = getRecentQRCodes();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to delete recent QR item from browser localStorage:', err);
    return getRecentQRCodes();
  }
}

/**
 * Clears all recent QR codes from current browser
 */
export function clearRecentQRCodes(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear recent QR codes from browser localStorage:', err);
  }
}
