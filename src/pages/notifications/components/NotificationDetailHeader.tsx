
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationDetailHeaderProps {
  title: string;
  type: string;
  onBack: () => void;
}

export const NotificationDetailHeader: React.FC<NotificationDetailHeaderProps> = ({
  title,
  type,
  onBack
}) => {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'request': return 'Demande de service';
      case 'reservation': return 'Réservation restaurant';
      case 'spa_booking': return 'Réservation spa';
      default: return 'Notification';
    }
  };

  return (
    <div className="mb-6">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onBack}
        className="mb-2 -ml-2"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Retour aux notifications
      </Button>
      
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="text-sm text-muted-foreground">
        {getTypeLabel(type)}
      </div>
    </div>
  );
};
