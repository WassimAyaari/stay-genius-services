
import React from 'react';
import { Card } from '@/components/ui/card';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status?: string;
  action?: string;
  onClick?: () => void;
  image?: string;
}

const ServiceCard = ({ 
  icon, 
  title, 
  description, 
  status, 
  action, 
  onClick,
  image 
}: ServiceCardProps) => {
  return (
    <Card 
      onClick={onClick}
      className="group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg animate-fade-in"
    >
      {image && (
        <div className="relative h-40 overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}
      <div className="p-4">
        <div className="flex flex-col gap-3">
          <div className="text-primary text-xl">{icon}</div>
          <div>
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-secondary">{title}</h3>
              {status && (
                <span className="text-xs px-2 py-1 bg-primary-light text-primary rounded-full">
                  {status}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
            {action && (
              <span className="text-sm text-primary mt-2 inline-block hover:underline">
                {action}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
