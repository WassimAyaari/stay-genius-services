
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Room } from '@/hooks/useRoom';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface WelcomeBannerProps {
  room: Room | null;
}

const WelcomeBanner = ({ room }: WelcomeBannerProps) => {
  // Utiliser useMemo pour calculer les valeurs une seule fois
  const userData = useMemo(() => {
    try {
      const userDataString = localStorage.getItem('user_data');
      return userDataString ? JSON.parse(userDataString) : null;
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return null;
    }
  }, []);
  
  // Calculer les valeurs dérivées une seule fois
  const displayRoomNumber = useMemo(() => {
    return userData?.room_number || room?.room_number || 'Suite 401';
  }, [userData, room]);
  
  const userName = useMemo(() => {
    if (!userData) return '';
    return `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
  }, [userData]);
  
  const checkInDate = useMemo(() => {
    if (!userData?.check_in_date) return '';
    try {
      return format(new Date(userData.check_in_date), 'dd MMMM yyyy', { locale: enUS });
    } catch (e) {
      return '';
    }
  }, [userData]);
  
  const checkOutDate = useMemo(() => {
    if (!userData?.check_out_date) return '';
    try {
      return format(new Date(userData.check_out_date), 'dd MMMM yyyy', { locale: enUS });
    } catch (e) {
      return '';
    }
  }, [userData]);

  return (
    <Card className="mb-8 p-8 bg-gradient-to-r from-primary-light via-white to-white border-none shadow-lg rounded-3xl">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-secondary mb-2">{displayRoomNumber}</h1>
            <p className="text-gray-600 text-lg">{room?.type}</p>
            {userName && <p className="text-gray-700 mt-1">Welcome, {userName}</p>}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">Check-out</p>
            <p className="text-lg font-semibold text-secondary">{checkOutDate || 'Not set'}</p>
          </div>
        </div>
        
        {(checkInDate || checkOutDate) && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Arrival</p>
                <p className="text-md font-medium">{checkInDate || 'Not set'}</p>
              </div>
              <div className="h-8 border-l border-gray-300"></div>
              <div>
                <p className="text-sm font-medium text-gray-600">Departure</p>
                <p className="text-md font-medium">{checkOutDate || 'Not set'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default WelcomeBanner;
