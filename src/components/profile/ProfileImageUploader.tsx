
import React, { useState, useRef, ChangeEvent } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, Camera, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { compressAndConvertToWebP } from '@/lib/imageUtils';

interface ProfileImageUploaderProps {
  initialImage?: string;
  firstName: string;
  lastName: string;
  onImageChange: (imageData: string | null) => void;
}

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  initialImage,
  firstName,
  lastName,
  onImageChange
}) => {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getInitials = () => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Veuillez sélectionner une image valide."
        });
        return;
      }
      
      // Vérifier la taille du fichier (max 5MB avant compression)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Fichier trop volumineux",
          description: "L'image ne doit pas dépasser 5 Mo."
        });
        return;
      }

      // Compresser l'image
      const compressedImage = await compressAndConvertToWebP(file, 100); // max 100KB après compression
      
      setImage(compressedImage);
      onImageChange(compressedImage);
      
      toast({
        title: "Image téléchargée",
        description: "Votre photo de profil a été mise à jour."
      });
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement de l'image."
      });
    } finally {
      setIsUploading(false);
      // Réinitialiser l'input pour permettre de télécharger la même image à nouveau
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    onImageChange(null);
    toast({
      title: "Image supprimée",
      description: "Votre photo de profil a été supprimée."
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-24 w-24 border-2 border-white shadow-md">
          {image ? (
            <AvatarImage src={image} alt="Photo de profil" />
          ) : null}
          <AvatarFallback className="text-xl bg-primary text-primary-foreground">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        
        <div className="absolute -bottom-2 -right-2 flex gap-1">
          <Button 
            onClick={triggerFileInput} 
            size="icon" 
            className="h-8 w-8 rounded-full shadow"
            disabled={isUploading}
          >
            <Camera className="h-4 w-4" />
          </Button>
          
          {image && (
            <Button 
              onClick={handleRemoveImage} 
              size="icon" 
              variant="destructive"
              className="h-8 w-8 rounded-full shadow"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div className="text-center text-sm text-muted-foreground">
        <p>Cliquez sur l'icône pour changer votre photo</p>
        <p>PNG, JPG ou WebP, max 5MB</p>
      </div>
    </div>
  );
};

export default ProfileImageUploader;
