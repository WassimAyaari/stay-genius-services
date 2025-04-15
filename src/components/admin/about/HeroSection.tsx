
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ui/image-upload';

interface HeroSectionProps {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  isEditing?: boolean;
  onSave?: (data: { hero_image: string; hero_title: string; hero_subtitle: string }) => void;
}

const HeroSection = ({
  heroImage,
  heroTitle,
  heroSubtitle,
  isEditing = false,
  onSave
}: HeroSectionProps) => {
  const [editableImage, setEditableImage] = React.useState(heroImage);
  const [editableTitle, setEditableTitle] = React.useState(heroTitle);
  const [editableSubtitle, setEditableSubtitle] = React.useState(heroSubtitle);

  const handleImageUpload = (url: string) => {
    setEditableImage(url);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        hero_image: editableImage,
        hero_title: editableTitle,
        hero_subtitle: editableSubtitle
      });
    }
  };

  if (isEditing) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="hero_image">Image du hero</Label>
            <ImageUpload
              id="hero_image"
              value={editableImage}
              onChange={handleImageUpload}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="hero_title">Titre principal</Label>
            <Input 
              id="hero_title"
              value={editableTitle}
              onChange={(e) => setEditableTitle(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="hero_subtitle">Sous-titre</Label>
            <Input 
              id="hero_subtitle"
              value={editableSubtitle}
              onChange={(e) => setEditableSubtitle(e.target.value)}
            />
          </div>

          <Button type="button" onClick={handleSave} className="mt-4">
            Enregistrer les modifications
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative h-64 mb-8 overflow-hidden rounded-lg">
      <img 
        src={heroImage} 
        alt={heroTitle}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
        <h1 className="text-3xl font-bold mb-2">{heroTitle}</h1>
        <p className="text-xl">{heroSubtitle}</p>
      </div>
    </div>
  );
};

export default HeroSection;
