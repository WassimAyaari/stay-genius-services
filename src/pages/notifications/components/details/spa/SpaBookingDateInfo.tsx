
import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SpaBookingDateInfoProps {
  date: string;
  time: string;
}

export const SpaBookingDateInfo: React.FC<SpaBookingDateInfoProps> = ({ date, time }) => {
  let formattedDate;
  
  try {
    if (!date) {
      throw new Error('Date is undefined or null');
    }
    formattedDate = format(parseISO(date), 'PPPP', { locale: fr });
  } catch (error) {
    console.error('Error parsing date:', error, 'Original date value:', date);
    formattedDate = date || 'Date non disponible';
  }
  
  return (
    <div className="space-y-3">
      <h3 className="font-medium">Détails de la réservation</h3>
      <ul className="space-y-2">
        <li className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>Date: {formattedDate}</span>
        </li>
        {time && (
          <li className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>Heure: {time}</span>
          </li>
        )}
      </ul>
    </div>
  );
};
