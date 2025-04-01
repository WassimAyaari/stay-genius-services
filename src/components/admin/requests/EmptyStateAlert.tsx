
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateAlertProps {
  onCreateRequest: () => Promise<void>;
}

export const EmptyStateAlert = ({ onCreateRequest }: EmptyStateAlertProps) => {
  return (
    <Alert className="mb-4">
      <Info className="h-4 w-4" />
      <AlertTitle>Aucune requête trouvée</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>Aucune requête n'est disponible dans la base de données.</p>
        <Button 
          variant="outline" 
          onClick={onCreateRequest}
          className="w-fit"
        >
          Créer une requête réaliste
        </Button>
      </AlertDescription>
    </Alert>
  );
};
