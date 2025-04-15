
import React from 'react';
import { Input } from './input';
import { Button } from './button';
import { Image, X } from 'lucide-react';

interface ImageUploadProps {
  id: string;
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export const ImageUpload = ({ id, value, onChange, className }: ImageUploadProps) => {
  const [preview, setPreview] = React.useState(value);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    setPreview('');
    onChange('');
  };

  return (
    <div className={className}>
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-40 object-cover rounded-lg"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label 
          htmlFor={id}
          className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Image className="w-8 h-8 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez
            </p>
          </div>
          <Input
            id={id}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
      )}
    </div>
  );
};
