
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, ExternalLink, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
}

const ImageUploader = ({ value, onChange }: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Lecture du fichier pour prévisualisation
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      
      // Dans un cas réel, on ferait un upload vers un service de stockage
      // Pour cette démo, on va juste simuler un upload en utilisant l'URL du fichier
      setIsUploading(true);
      setTimeout(() => {
        onChange(result);
        setIsUploading(false);
      }, 1000);
    };
    reader.readAsDataURL(file);
  };
  
  const handleClear = () => {
    onChange('');
    setPreview(null);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Input 
          type="text" 
          placeholder="URL de l'image" 
          value={value} 
          onChange={(e) => {
            onChange(e.target.value);
            setPreview(e.target.value);
          }}
          className="flex-grow"
        />
        <Button 
          type="button" 
          variant="outline" 
          className="shrink-0"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      
      {isUploading && (
        <div className="w-full h-12 flex items-center justify-center bg-muted rounded-md">
          <div className="animate-pulse">Téléchargement en cours...</div>
        </div>
      )}
      
      {preview && !isUploading && (
        <div className="relative">
          <div className="aspect-video relative rounded-md overflow-hidden bg-muted">
            <img 
              src={preview} 
              alt="Preview" 
              className={cn(
                "w-full h-full object-contain",
                /^data:/.test(preview) ? "" : "object-cover"
              )}
              onError={() => {
                // Fallback si l'image ne charge pas
                setPreview(null);
              }}
            />
            <button
              type="button"
              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {!(/^data:/.test(preview)) && (
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <ExternalLink className="h-3 w-3 mr-1" />
              Image externe
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
