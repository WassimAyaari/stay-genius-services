
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  className?: string;
}

const ServiceCard = ({ icon, title, description, onClick, className }: ServiceCardProps) => {
  return (
    <Card 
      className={cn(
        "p-4 cursor-pointer hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-primary/20 animate-fade-in", 
        className
      )} 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Request ${title}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/10 text-primary rounded-lg">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-secondary mb-1">{title}</h3>
          <p className="text-gray-600 text-sm mb-2">{description}</p>
          <div className="flex items-center text-primary text-sm font-medium">
            <span>Request</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
