
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  error: unknown;
}

export const ErrorAlert = ({ error }: ErrorAlertProps) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erreur</AlertTitle>
      <AlertDescription>
        Impossible de charger les données des requêtes. Veuillez réessayer.
        {error && <div className="mt-2 text-xs opacity-80">{String(error)}</div>}
      </AlertDescription>
    </Alert>
  );
};
