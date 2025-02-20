
import React from 'react';
import { Card } from '@/components/ui/card';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status?: string;
  action?: string;
  onClick?: () => void;
}

const ServiceCard = ({ icon, title, description, status, action, onClick }: ServiceCardProps) => {
  return (
    <Card 
      onClick={onClick}
      className="p-4 cursor-pointer transition-all duration-300 hover:shadow-lg animate-fade-in"
    >
      <div className="flex flex-col gap-3">
        <div className="text-primary text-xl">{icon}</div>
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-secondary text-sm">{title}</h3>
            {status && (
              <span className="text-xs px-2 py-1 bg-primary-light text-primary rounded-full">
                {status}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 mt-1">{description}</p>
          {action && (
            <span className="text-xs text-primary mt-2 inline-block hover:underline">
              {action}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
