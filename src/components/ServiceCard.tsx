
import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  
  return (
    <Card 
      onClick={onClick}
      className="group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg animate-fade-in h-full"
    >
      {image && (
        <div className="relative h-32 sm:h-40 overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}
      <div className="p-3 sm:p-4 h-full flex flex-col">
        <div className="flex flex-col gap-2 sm:gap-3 h-full">
          <div className="flex items-start justify-between gap-2">
            <div className="text-primary text-lg sm:text-xl flex-shrink-0">{icon}</div>
            {status && (
              <span className="text-xs px-2 py-1 bg-primary-light text-primary rounded-full whitespace-nowrap">
                {status}
              </span>
            )}
          </div>
          <div className="flex-1 flex flex-col">
            <h3 className="font-medium text-secondary text-sm sm:text-base leading-tight mb-1 sm:mb-2">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed flex-1">
              {description}
            </p>
            {action && (
              <span className="text-xs sm:text-sm text-primary mt-2 sm:mt-3 inline-block hover:underline font-medium">
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
