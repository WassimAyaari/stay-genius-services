
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText: string;
  actionLink: string;
  status: string;
  highlighted?: boolean;
}

const ServiceCard = ({ 
  icon, 
  title, 
  description, 
  actionText, 
  actionLink, 
  status,
  highlighted = false 
}: ServiceCardProps) => {
  return (
    <Link to={actionLink} className="block h-full">
      <Card className={`h-full overflow-hidden transition-all duration-300 hover:shadow-lg ${highlighted ? 'border-2 border-primary rounded-2xl' : 'rounded-2xl'} hover:scale-[1.02]`}>
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-2">
            <div className="p-2.5 bg-gray-100 rounded-lg">
              {icon}
            </div>
            <span className="text-gray-500 text-sm">{status}</span>
          </div>
          <h3 className="text-xl font-bold text-secondary mb-1 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-gray-600 text-sm mb-3 flex-grow">{description}</p>
          <span 
            className={`text-sm font-medium flex items-center transition-colors ${highlighted ? 'text-[#e57373]' : 'text-primary'} hover:text-secondary mt-auto`}
          >
            {actionText}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
              <path 
                d="M6 12L10 8L6 4" 
                stroke="currentColor"
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </Card>
    </Link>
  );
};

export default ServiceCard;
