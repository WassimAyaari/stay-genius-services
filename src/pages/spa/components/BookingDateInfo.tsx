
import React from 'react';
import { Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface BookingDateInfoProps {
  date: string;
  time: string;
}

const BookingDateInfo: React.FC<BookingDateInfoProps> = ({ date, time }) => {
  let formattedDate;
  try {
    formattedDate = format(parseISO(date), 'PPPP', { locale: fr });
  } catch (error) {
    console.error('Error parsing date:', error, date);
    formattedDate = date;
  }
  
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

export default BookingDateInfo;
