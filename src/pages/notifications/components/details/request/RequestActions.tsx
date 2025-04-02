
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Ban } from 'lucide-react';

interface RequestActionsProps {
  status: string;
  onCancelRequest: () => void;
}

export const RequestActions: React.FC<RequestActionsProps> = ({ status, onCancelRequest }) => {
  const navigate = useNavigate();
  const canCancel = ['pending', 'in_progress'].includes(status);
  
  return (
    <div className="pt-2 flex gap-3">
      <Button variant="outline" onClick={() => navigate('/my-room')}>
        Retour à ma chambre
      </Button>
      
      {canCancel && (
        <Button 
          variant="destructive" 
          className="gap-2"
          onClick={onCancelRequest}
        >
          <Ban className="h-4 w-4" />
          Annuler
        </Button>
      )}
    </div>
  );
};
