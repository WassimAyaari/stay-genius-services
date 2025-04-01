
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDate = (dateString?: string | Date) => {
  if (!dateString) return 'Non défini';
  try {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy', { locale: fr });
  } catch (error) {
    return 'Date invalide';
  }
};

export const calculateStayDuration = (checkInDate?: string | Date, checkOutDate?: string | Date) => {
  if (!checkInDate || !checkOutDate) return null;
  
  try {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (error) {
    console.error('Error calculating stay duration:', error);
    return null;
  }
};
