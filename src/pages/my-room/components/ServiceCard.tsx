
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ServiceType } from '@/features/rooms/controllers/roomService';

interface ServiceCardProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  type: ServiceType;
  onRequest: (type: ServiceType) => void;
}

const ServiceCard = ({ icon, label, description, type, onRequest }: ServiceCardProps) => {
  return (
    <Card className="p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary/10 rounded-xl">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{label}</h3>
          <p className="text-gray-600 text-sm mb-4">{description}</p>
          <Button 
            variant="outline"
            className="w-full rounded-xl"
            onClick={() => onRequest(type)}
          >
            Request Service
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
