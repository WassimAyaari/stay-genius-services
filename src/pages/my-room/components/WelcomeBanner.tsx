
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Room } from '@/hooks/useRoom';

interface WelcomeBannerProps {
  room: Room | null;
}

const WelcomeBanner = ({ room }: WelcomeBannerProps) => {
  const [roomNumber, setRoomNumber] = useState<string>('');
  
  useEffect(() => {
    // Récupérer les données utilisateur du localStorage pour obtenir le numéro de chambre
    const userDataString = localStorage.getItem('user_data');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        if (userData.room_number) {
          setRoomNumber(userData.room_number);
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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">{displayRoomNumber}</h1>
          <p className="text-gray-600 text-lg">{room?.type}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-600">Check-out</p>
          <p className="text-lg font-semibold text-secondary">Tomorrow, 11:00 AM</p>
        </div>
      </div>
    </Card>
  );
};

export default WelcomeBanner;
