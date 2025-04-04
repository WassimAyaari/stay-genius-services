
import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

interface ReservationStatusSectionProps {
  status: string;
}

export const ReservationStatusSection: React.FC<ReservationStatusSectionProps> = ({ status }) => {
  const isPending = status === 'pending';
  const isConfirmed = status === 'confirmed';
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
              <h3 className="text-sm font-medium text-yellow-800">Réservation en attente</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Votre réservation est en attente de confirmation par le restaurant.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isConfirmed && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Réservation confirmée</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Votre réservation a été confirmée par le restaurant.</p>
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
              <h3 className="text-sm font-medium text-green-800">Réservation complétée</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Votre réservation a été honorée. Nous espérons que vous avez apprécié votre expérience.</p>
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
              <h3 className="text-sm font-medium text-red-800">Réservation annulée</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Cette réservation a été annulée.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
