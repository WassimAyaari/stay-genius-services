
import React from 'react';
import { Card } from '@/components/ui/card';
import { ShowerHead, Wrench, Bell } from 'lucide-react';

interface RequestCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface RequestCategoriesViewProps {
  onSelectCategory: (category: RequestCategory) => void;
}

const RequestCategoriesView = ({ onSelectCategory }: RequestCategoriesViewProps) => {
  // Fixed categories
  const categories: RequestCategory[] = [
    {
      id: 'housekeeping',
      name: 'Housekeeping',
      description: 'Room cleaning, fresh towels, and other room services',
      icon: <ShowerHead className="h-5 w-5 text-primary" />
    },
    {
      id: 'maintenance',
      name: 'Maintenance',
      description: 'Technical issues, repairs, and facility maintenance',
      icon: <Wrench className="h-5 w-5 text-primary" />
    },
    {
      id: 'reception',
      name: 'Reception',
      description: 'Check-in/out, information, and general assistance',
      icon: <Bell className="h-5 w-5 text-primary" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map((category) => (
        <Card 
          key={category.id}
          className="p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onSelectCategory(category)}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {category.icon}
            </div>
            <div>
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RequestCategoriesView;
