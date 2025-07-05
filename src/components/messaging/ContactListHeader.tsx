
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ContactListHeaderProps {
  onGoBack: () => void;
}

export const ContactListHeader: React.FC<ContactListHeaderProps> = ({ onGoBack }) => {
  return (
    <div className="h-16 border-b bg-card flex items-center px-4 flex-shrink-0">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onGoBack} 
        className="mr-2"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h1 className="text-xl font-semibold">Guest Services</h1>
    </div>
  );
};
