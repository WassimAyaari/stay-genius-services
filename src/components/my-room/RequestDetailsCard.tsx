
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ban } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ServiceRequest } from '@/features/rooms/types';
import { ServiceTypeIcon, getServiceTypeText } from './ServiceTypeIcon';
import { RequestStatusBadge } from './RequestStatusBadge';
import { StatusAlert } from './StatusAlert';

interface RequestDetailsCardProps {
  request: ServiceRequest;
  onCancel: () => void;
  onBackClick: () => void;
}

export const RequestDetailsCard = ({ request, onCancel, onBackClick }: RequestDetailsCardProps) => {
  const creationDate = new Date(request.created_at);
  const isPending = request.status === 'pending';
  const isInProgress = request.status === 'in_progress';
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-full">
              <ServiceTypeIcon type={request.type} />
            </div>
            <CardTitle>{getServiceTypeText(request.type)}</CardTitle>
          </div>
          <RequestStatusBadge status={request.status as 'pending' | 'in_progress' | 'completed' | 'cancelled'} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {request.description && (
          <div className="text-gray-600">
            <p>{request.description}</p>
          </div>
        )}
        
        <div className="text-sm text-gray-500">
          Demande créée {formatDistanceToNow(creationDate, { addSuffix: true, locale: fr })}
        </div>
        
        <div className="pt-4">
          <StatusAlert status={request.status as 'pending' | 'in_progress' | 'completed' | 'cancelled'} />
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex gap-3">
        <Button variant="outline" onClick={onBackClick}>
          Retour à ma chambre
        </Button>
        
        {(isPending || isInProgress) && (
          <Button 
            variant="destructive" 
            className="gap-2"
            onClick={onCancel}
          >
            <Ban className="h-4 w-4" />
            Annuler
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
