
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BellOff } from 'lucide-react';

export const EmptyState = () => {
  return (
    <Card className="border-dashed bg-gray-50/50">
      <CardContent className="py-12 flex flex-col items-center justify-center">
        <BellOff className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Aucune notification</h3>
        <p className="text-sm text-gray-500 text-center max-w-md">
          Vous n'avez pas encore de notifications. Les notifications apparaîtront ici lorsque vous ferez des réservations de table ou des demandes de service.
        </p>
      </CardContent>
    </Card>
  );
};
