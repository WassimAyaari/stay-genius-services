
import React from 'react';
import { Image, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageListItemProps {
  url: string;
  index: number;
  onRemove: (index: number) => void;
}

const ImageListItem = ({ url, index, onRemove }: ImageListItemProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1 truncate border p-2 rounded text-sm">
        <div className="flex items-center gap-2">
          <Image className="h-4 w-4 shrink-0" />
          <span className="truncate">{url}</span>
        </div>
      </div>
      <Button 
        type="button"
        variant="destructive"
        size="sm"
        onClick={() => onRemove(index)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ImageListItem;
