
import React from 'react';
import { Card } from '@/components/ui/card';
import { ServiceType } from '@/features/rooms/types';

interface ServiceCardProps {
  icon: React.ReactNode;
  label: string;
  type: ServiceType;
  description: string;
  onRequest: (type: ServiceType) => void;
}

const ServiceCard = ({ 
  icon, 
  label, 
  type, 
  description, 
  onRequest
}: ServiceCardProps) => {
  const handleClick = () => {
    onRequest(type);
  };

  return (
    <Card 
      onClick={handleClick}
      className="p-4 hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="flex flex-col gap-3">
        <div className="text-primary text-xl">{icon}</div>
        <div>
          <h3 className="font-medium text-secondary">{label}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          <span className="text-sm text-primary mt-2 inline-block group-hover:underline">
            Request now
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
