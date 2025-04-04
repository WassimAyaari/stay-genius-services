
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Ban } from 'lucide-react';
import { CardFooter } from '@/components/ui/card';

interface ReservationActionsProps {
  notificationId: string;
  status: string;
  onCancelClick: () => void;
}

export const ReservationActions: React.FC<ReservationActionsProps> = ({ 
  notificationId, 
  status, 
  onCancelClick 
}) => {
  const navigate = useNavigate();
  const canCancel = ['pending', 'confirmed'].includes(status);
  const canModify = status === 'pending';

  return (
    <CardFooter className="pt-2 flex gap-3">
      <Button variant="outline" onClick={() => navigate('/dining')}>
        Voir les restaurants
      </Button>
      
      {canModify && (
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => navigate(`/dining/edit-reservation/${notificationId}`)}
        >
          Modifier
        </Button>
      )}
      
      {canCancel && (
        <Button 
          variant="destructive" 
          className="gap-2"
          onClick={onCancelClick}
        >
          <Ban className="h-4 w-4" />
          Annuler
        </Button>
      )}
    </CardFooter>
  );
};
