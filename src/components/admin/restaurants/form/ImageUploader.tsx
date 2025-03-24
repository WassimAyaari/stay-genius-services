
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import ImageListItem from './ImageListItem';

interface ImageUploaderProps {
  form: UseFormReturn<any>;
}

const ImageUploader = ({ form }: ImageUploaderProps) => {
  const [newImageUrl, setNewImageUrl] = useState("");

  const handleAddImage = () => {
    if (newImageUrl) {
      const currentImages = form.getValues("images") || [];
      form.setValue("images", [...currentImages, newImageUrl]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = form.getValues("images") || [];
    form.setValue("images", currentImages.filter((_, i) => i !== index));
  };

  return (
    <FormField
      control={form.control}
      name="images"
      render={() => (
        <FormItem>
          <FormLabel>Images</FormLabel>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="Image URL" 
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
              />
              <Button 
                type="button"
                variant="outline"
                onClick={handleAddImage}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {form.watch("images")?.map((url: string, index: number) => (
                <ImageListItem 
                  key={index} 
                  url={url} 
                  index={index} 
                  onRemove={handleRemoveImage} 
                />
              ))}
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ImageUploader;
