
import React from 'react';
import { Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SpaBookingDateInfoProps {
  date: string;
  time: string;
}

export const SpaBookingDateInfo: React.FC<SpaBookingDateInfoProps> = ({ date, time }) => {
  // Add a safety check for date format
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'PPPP', { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return dateString;
    }
  };
  
  const formattedDate = formatDate(date);
  
  return (
    <div className="space-y-3">
      <h3 className="font-medium">Détails de la réservation</h3>
      <div className="flex items-center gap-2 text-sm">
        <Calendar className="h-4 w-4 text-gray-500" />
        <div>
          <p className="font-medium">Date et heure</p>
          <p className="text-gray-600">{formattedDate} à {time}</p>
        </div>
      </div>
    </div>
  );
};
