
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionText: string;
  onAction: () => void;
}

const ServiceCard = ({ title, description, icon: Icon, actionText, onAction }: ServiceCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <Icon className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">
            {description}
          </p>
          <Button variant="outline" onClick={onAction}>{actionText}</Button>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
