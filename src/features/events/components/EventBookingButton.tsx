
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Event } from '@/types/event';
import EventReservationDialog from './EventReservationDialog';
import { useAuth } from '@/features/auth/hooks/useAuthContext';

interface EventBookingButtonProps {
  event: Event;
  onSuccess?: () => void;
  className?: string;
}

const EventBookingButton: React.FC<EventBookingButtonProps> = ({
  event,
  onSuccess,
  className = '',
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleOpenDialog = () => {
    if (!isAuthenticated) {
      // Rediriger vers la page de login
      window.location.href = `/auth/login?redirect=/events/${event.id}`;
      return;
    }
    setIsDialogOpen(true);
  };

  const handleSuccess = () => {
    setIsDialogOpen(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <>
      <Button 
        onClick={handleOpenDialog} 
        className={className}
        size="lg"
      >
        Réserver
      </Button>
      
      <EventReservationDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        event={event}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default EventBookingButton;
