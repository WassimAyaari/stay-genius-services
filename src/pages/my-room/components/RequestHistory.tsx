
import React from 'react';
import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle2, Timer, XCircle, Clock } from 'lucide-react';
import { ServiceRequest } from '@/features/rooms/types';
import { Service } from '../types';

interface RequestHistoryProps {
  isLoading: boolean;
  requests: ServiceRequest[];
  services: Service[];
}

const RequestHistory = ({ isLoading, requests, services }: RequestHistoryProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Timer className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-secondary mb-6">Recent Requests</h2>
      <Card className="rounded-2xl overflow-hidden">
        <div className="p-6 space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : requests.length > 0 ? (
            requests.map((request) => (
              <div 
                key={request.id} 
                className="flex items-center gap-4 p-4 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-colors"
              >
                <div className="p-2 bg-white rounded-lg">
                  {services.find(s => s.type === request.type)?.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium capitalize">{request.type.replace('_', ' ')}</p>
                    {getStatusIcon(request.status)}
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(request.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 py-4">No recent requests</p>
          )}
        </div>
      </Card>
    </>
  );
};

export default RequestHistory;
