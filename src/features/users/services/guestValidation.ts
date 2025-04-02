
import { isValidUuid } from '../utils/validationUtils';

/**
 * Validates guest-related data and checks if user ID is valid
 */
export const validateGuestId = (userId: string): boolean => {
  if (!isValidUuid(userId)) {
    console.error('Invalid user ID format:', userId);
    return false;
  }
  return true;
};

/**
 * Helper function to log guest data operations
 */
export const logGuestOperation = (operation: string, userId: string, result: boolean | any): void => {
  if (result) {
    console.log(`Guest ${operation} successful for user ID:`, userId);
  } else {
    console.error(`Guest ${operation} failed for user ID:`, userId);
  }
};
