
import React from 'react';
import { Button } from '@/components/ui/button';
import RequestPresetList from '@/features/services/components/RequestPresetList';

interface RequestPresetViewProps {
  onSelectPreset: (preset: {category: string, description: string, type: string}) => void;
  onBrowseAllCategories: () => void;
}

const RequestPresetView = ({ 
  onSelectPreset, 
  onBrowseAllCategories 
}: RequestPresetViewProps) => {
  return (
    <div>
      <RequestPresetList 
        onSelectPreset={onSelectPreset} 
        onBrowseAll={onBrowseAllCategories} 
      />
    </div>
  );
};

export default RequestPresetView;
