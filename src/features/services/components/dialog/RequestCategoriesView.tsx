
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import RequestCategoryList from '@/features/services/components/RequestCategoryList';
import { RequestCategory } from '@/features/rooms/types';

interface RequestCategoriesViewProps {
  onSelectCategory: (category: RequestCategory) => void;
  onGoBackToPresets: () => void;
}

const RequestCategoriesView = ({ 
  onSelectCategory, 
  onGoBackToPresets 
}: RequestCategoriesViewProps) => {
  return (
    <div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4"
        onClick={onGoBackToPresets}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Common Requests
      </Button>
      <RequestCategoryList onSelectCategory={onSelectCategory} />
    </div>
  );
};

export default RequestCategoriesView;
