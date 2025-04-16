
import { format, isValid } from 'date-fns';
import { enUS } from 'date-fns/locale';

export const formatDate = (dateString?: string | Date) => {
  if (!dateString) return 'Not defined';
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (!isValid(date)) {
      console.error('Invalid date:', dateString);
      return 'Invalid date';
    }
    
    return format(date, 'dd MMMM yyyy', { locale: enUS });
  } catch (error) {
    console.error('Error formatting date:', error, 'Original value:', dateString);
    return 'Invalid date';
  }
};

export const calculateStayDuration = (checkInDate?: string | Date, checkOutDate?: string | Date) => {
  if (!checkInDate || !checkOutDate) return null;
  
  try {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    // Check if dates are valid
    if (!isValid(checkIn) || !isValid(checkOut)) {
      console.error('Invalid dates when calculating stay duration:', { checkInDate, checkOutDate });
      return null;
    }
    
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (error) {
    console.error('Error calculating stay duration:', error);
    return null;
  }
};
