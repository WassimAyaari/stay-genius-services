
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
      className="p-6 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4">
        <div className="text-primary">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold mb-1">{label}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
