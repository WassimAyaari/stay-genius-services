
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Room } from '@/hooks/useRoom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface WelcomeBannerProps {
  room: Room | null;
}

const WelcomeBanner = ({ room }: WelcomeBannerProps) => {
  const [roomNumber, setRoomNumber] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  
  useEffect(() => {
    // Récupérer les données utilisateur du localStorage pour obtenir le numéro de chambre
    const userDataString = localStorage.getItem('user_data');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        if (userData.room_number) {
          setRoomNumber(userData.room_number);
        }
        
        // Récupérer le nom de l'utilisateur
        const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
        if (fullName) {
          setUserName(fullName);
        }
        
        // Récupérer les dates de séjour
        if (userData.check_in_date) {
          const checkIn = new Date(userData.check_in_date);
          setCheckInDate(format(checkIn, 'dd MMMM yyyy', { locale: fr }));
        }
        
        if (userData.check_out_date) {
          const checkOut = new Date(userData.check_out_date);
          setCheckOutDate(format(checkOut, 'dd MMMM yyyy', { locale: fr }));
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  // Utiliser le numéro de chambre du localStorage s'il existe, sinon utiliser celui du room object
  const displayRoomNumber = roomNumber || (room?.room_number || 'Suite 401');

  return (
    <Card className="mb-8 p-8 bg-gradient-to-r from-primary-light via-white to-white border-none shadow-lg rounded-3xl">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-secondary mb-2">{displayRoomNumber}</h1>
            <p className="text-gray-600 text-lg">{room?.type}</p>
            {userName && <p className="text-gray-700 mt-1">Bienvenue, {userName}</p>}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">Check-out</p>
            <p className="text-lg font-semibold text-secondary">{checkOutDate || 'Non défini'}</p>
          </div>
        </div>
        
        {(checkInDate || checkOutDate) && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Arrivée</p>
                <p className="text-md font-medium">{checkInDate || 'Non défini'}</p>
              </div>
              <div className="h-8 border-l border-gray-300"></div>
              <div>
                <p className="text-sm font-medium text-gray-600">Départ</p>
                <p className="text-md font-medium">{checkOutDate || 'Non défini'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default WelcomeBanner;
