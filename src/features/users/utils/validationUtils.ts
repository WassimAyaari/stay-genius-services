
import { v4 as uuidv4 } from 'uuid';

/**
 * Convertit une date en chaîne de caractères formatée
 * @param dateValue Date à convertir
 * @returns Chaîne de caractères formatée YYYY-MM-DD ou undefined
 */
export const formatDateToString = (dateValue: Date | string | undefined): string | undefined => {
  if (!dateValue) return undefined;
  if (dateValue instanceof Date) {
    return dateValue.toISOString().split('T')[0];
  }
  return String(dateValue);
};

/**
 * Vérifie si un UUID est valide
 * @param uuid UUID à vérifier
 * @returns true si l'UUID est valide, false sinon
 */
export const isValidUuid = (uuid: string): boolean => {
  return Boolean(uuid && uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i));
};

/**
 * Génère un nouvel UUID en cas d'ID invalide
 * @param id ID à vérifier
 * @returns ID valide (original ou nouveau)
 */
export const ensureValidUuid = (id?: string): string => {
  if (!id || !isValidUuid(id)) {
    return uuidv4();
  }
  return id;
};
