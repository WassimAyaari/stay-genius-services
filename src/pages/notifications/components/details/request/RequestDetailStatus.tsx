import React from 'react';
import { CheckCircle2, Clock, Loader2, XCircle, Pause } from 'lucide-react';

interface RequestDetailStatusProps {
  status: string;
}

export const RequestDetailStatus: React.FC<RequestDetailStatusProps> = ({ status }) => {
  const isPending = status === 'pending';
  const isOnHold = status === 'on_hold';
  const isInProgress = status === 'in_progress';
  const isCompleted = status === 'completed';
  const isCancelled = status === 'cancelled';

  return (
    <div className="pt-4">
      {isPending && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Demande en attente</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Votre demande est en cours de traitement. Notre équipe s'en occupera dans les plus brefs délais.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isOnHold && (
        <div className="rounded-md bg-orange-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Pause className="h-5 w-5 text-orange-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">Demande en attente</h3>
              <div className="mt-2 text-sm text-orange-700">
                <p>Votre demande est temporairement en attente. Notre équipe la traitera dès que possible.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isInProgress && (
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Demande en cours</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Notre équipe est en train de traiter votre demande.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isCompleted && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Demande complétée</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Votre demande a été traitée avec succès.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isCancelled && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Demande annulée</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Cette demande a été annulée.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
