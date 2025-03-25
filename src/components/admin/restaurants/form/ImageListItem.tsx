
import React from 'react';
import { Image, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageListItemProps {
  url: string;
  index: number;
  onRemove: (index: number) => void;
}

const ImageListItem = ({ url, index, onRemove }: ImageListItemProps) => {
  // Check if it's a data URL or a regular URL
  const isDataUrl = url.startsWith('data:');
  
  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1 truncate border p-2 rounded text-sm bg-background">
        <div className="flex items-center gap-2">
          {isDataUrl ? (
            <div className="h-8 w-8 shrink-0 rounded overflow-hidden bg-muted">
              <img src={url} alt={`Image ${index + 1}`} className="h-full w-full object-cover" />
            </div>
          ) : (
            <Image className="h-4 w-4 shrink-0" />
          )}
          <span className="truncate">
            {isDataUrl ? `Image téléchargée ${index + 1} (WebP)` : url}
          </span>
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
