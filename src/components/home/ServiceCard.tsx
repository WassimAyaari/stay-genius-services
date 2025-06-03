
import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  
  return (
    <Link to={actionLink} className="block h-full">
      <Card className={`h-full overflow-hidden transition-all duration-300 hover:shadow-lg ${highlighted ? 'border-2 border-primary rounded-2xl' : 'rounded-2xl'} hover:scale-[1.02]`}>
        <div className="p-3 sm:p-4 flex flex-col h-full min-h-[140px] sm:min-h-[160px]">
          <div className="flex justify-between items-start mb-2 sm:mb-3">
            <div className="p-2 sm:p-2.5 bg-gray-100 rounded-lg flex-shrink-0">
              <div className="text-primary w-5 h-5 sm:w-6 sm:h-6">
                {icon}
              </div>
            </div>
            <span className="text-gray-500 text-xs sm:text-sm whitespace-nowrap ml-2">
              {status}
            </span>
          </div>
          
          <div className="flex-1 flex flex-col">
            <h3 className="text-base sm:text-xl font-bold text-secondary mb-1 group-hover:text-primary transition-colors leading-tight">
              {title}
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 flex-1 leading-relaxed">
              {description}
            </p>
            
            <div className="mt-auto">
              <span 
                className={`text-xs sm:text-sm font-medium flex items-center transition-colors ${highlighted ? 'text-[#e57373]' : 'text-primary'} hover:text-secondary`}
              >
                <span className="truncate">{actionText}</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1 flex-shrink-0">
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
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ServiceCard;
