
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RequestDetailContentProps {
  description?: string;
  roomNumber?: string;
  creationDate: Date;
}

export const RequestDetailContent: React.FC<RequestDetailContentProps> = ({ 
  description, 
  roomNumber, 
  creationDate 
}) => {
  return (
    <div className="space-y-4">
      {description && (
        <div className="text-gray-600">
          <p>{description}</p>
        </div>
      )}
      
      {roomNumber && (
        <div className="text-sm">
          <span className="font-medium">Chambre:</span> {roomNumber}
        </div>
      )}
      
      <div className="text-sm text-gray-500">
        Demande créée {formatDistanceToNow(creationDate, { addSuffix: true, locale: fr })}
      </div>
    </div>
  );
};
