
import React from 'react';
import RequestCategoryList from '@/features/services/components/RequestCategoryList';
import { RequestCategory } from '@/features/rooms/types';

interface RequestCategoriesViewProps {
  onSelectCategory: (category: RequestCategory) => void;
}

const RequestCategoriesView = ({ 
  onSelectCategory
}: RequestCategoriesViewProps) => {
  return (
    <div className="space-y-4">
      <RequestCategoryList onSelectCategory={onSelectCategory} />
    </div>
  );
};

export default RequestCategoriesView;
