
import React from 'react';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionText: string;
  onAction: () => void;
  highlighted?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon: Icon,
  actionText,
  onAction,
  highlighted = false
}) => {
  return (
    <Card 
      className={`p-6 hover:shadow-md transition-shadow cursor-pointer h-full ${
        highlighted ? 'border-primary' : ''
      }`}
      onClick={onAction}
    >
      <div className="flex items-start mb-4">
        <div className="p-2 bg-primary/10 rounded-md">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-secondary">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="mt-auto">
        <span className="text-primary font-medium flex items-center">
          {actionText}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1"
          >
            <path
              d="M7.5 15L12.5 10L7.5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Card>
  );
};

export default ServiceCard;
