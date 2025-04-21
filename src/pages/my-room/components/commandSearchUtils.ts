
/**
 * Utilities for CommandSearch functionality.
 */
import { useAuth } from "@/features/auth/hooks/useAuthContext";

/**
 * Normalize a string by lowering case and removing accents.
 */
export function normalizeText(str?: string) {
  return (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Get the guest's actual name, prioritizing the user context, then localStorage.
 */
export function getActualGuestName(userData?: any) {
  let name = '';
  if (userData) {
    const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
    if (fullName && fullName.toLowerCase() !== 'guest') name = fullName;
  }
  if (!name) {
    const stored = localStorage.getItem('user_data');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const localFullName = `${parsed.first_name || ''} ${parsed.last_name || ''}`.trim();
        if (localFullName && localFullName.toLowerCase() !== 'guest') name = localFullName;
      } catch {}
    }
  }
  return name;
}

/**
 * Filter the items based on a search term (normalized).
 */
export function filterItemsBySearch<T extends { name: string; description?: string }>(
  items: T[],
  searchTerm: string
): T[] {
  if (!searchTerm) return items;
  const search = normalizeText(searchTerm);
  return items.filter(item => {
    const name = normalizeText(item.name);
    const desc = normalizeText(item.description);
    return name.includes(search) || desc.includes(search);
  });
}
