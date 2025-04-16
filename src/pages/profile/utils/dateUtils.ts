
import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDate = (dateString?: string | Date) => {
  if (!dateString) return 'Non défini';
  
  try {
    const date = new Date(dateString);
    
    // Vérifier si la date est valide
    if (!isValid(date)) {
      console.error('Date invalide:', dateString);
      return 'Date invalide';
    }
    
    return format(date, 'dd MMMM yyyy', { locale: fr });
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error, 'Valeur originale:', dateString);
    return 'Date invalide';
  }
};

export const calculateStayDuration = (checkInDate?: string | Date, checkOutDate?: string | Date) => {
  if (!checkInDate || !checkOutDate) return null;
  
  try {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    // Vérifier si les dates sont valides
    if (!isValid(checkIn) || !isValid(checkOut)) {
      console.error('Dates invalides lors du calcul de la durée de séjour:', { checkInDate, checkOutDate });
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
