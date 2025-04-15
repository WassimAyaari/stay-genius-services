
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Image, Upload } from 'lucide-react';

interface WelcomeSectionProps {
  welcomeTitle: string;
  welcomeDescription: string;
  welcomeDescriptionExtended: string;
  heroImage?: string;
  handleTextChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isEditing?: boolean;
  onSave?: (data: { 
    welcome_title: string; 
    welcome_description: string; 
    welcome_description_extended: string;
    hero_image?: string;
  }) => void;
}

const WelcomeSection = ({
  welcomeTitle,
  welcomeDescription,
  welcomeDescriptionExtended,
  heroImage,
  handleTextChange,
  isEditing = false,
  onSave
}: WelcomeSectionProps) => {
  const [editableTitle, setEditableTitle] = React.useState(welcomeTitle);
  const [editableDesc, setEditableDesc] = React.useState(welcomeDescription);
  const [editableExtDesc, setEditableExtDesc] = React.useState(welcomeDescriptionExtended);
  const [editableImage, setEditableImage] = React.useState(heroImage || '');

  // Only used in editing mode if handleTextChange is not provided
  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'welcome_title') setEditableTitle(value);
    if (name === 'welcome_description') setEditableDesc(value);
    if (name === 'welcome_description_extended') setEditableExtDesc(value);
    if (name === 'hero_image') setEditableImage(value);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        welcome_title: editableTitle,
        welcome_description: editableDesc,
        welcome_description_extended: editableExtDesc,
        hero_image: editableImage
      });
    }
  };

  if (isEditing) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome Section</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="welcome_title">Section Title</Label>
            <Input 
              id="welcome_title" 
              name="welcome_title" 
              value={editableTitle} 
              onChange={handleTextChange || handleLocalChange}
            />
          </div>

          <div>
            <Label htmlFor="welcome_description">Main Description</Label>
            <Textarea 
              id="welcome_description" 
              name="welcome_description" 
              value={editableDesc} 
              onChange={handleTextChange || handleLocalChange}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="welcome_description_extended">Extended Description</Label>
            <Textarea 
              id="welcome_description_extended" 
              name="welcome_description_extended" 
              value={editableExtDesc} 
              onChange={handleTextChange || handleLocalChange}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="hero_image">Hero Image URL</Label>
            <div className="flex gap-2">
              <Input 
                id="hero_image" 
                name="hero_image" 
                value={editableImage} 
                onChange={handleTextChange || handleLocalChange}
                placeholder="https://example.com/image.jpg"
                className="flex-1"
              />
              {editableImage && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => window.open(editableImage, '_blank')}
                >
                  <Image className="h-4 w-4" />
                </Button>
              )}
            </div>
            {editableImage && (
              <div className="mt-4 relative rounded-md overflow-hidden h-40">
                <img 
                  src={editableImage}
                  alt="Hero Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          
          {onSave && !handleTextChange && (
            <Button type="button" onClick={handleSave} className="mt-4">
              Save Changes
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-6">
      {heroImage && (
        <div className="relative h-64 overflow-hidden rounded-md mb-6">
          <img 
            src={heroImage} 
            alt="Hotel" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{welcomeTitle}</h1>
            <p className="text-xl">{welcomeDescription}</p>
          </div>
        </div>
      )}
      {!heroImage && <h2 className="text-2xl font-bold mb-4">{welcomeTitle}</h2>}
      
      {!heroImage && <p className="text-lg mb-4">{welcomeDescription}</p>}
      
      {welcomeDescriptionExtended && (
        <p className="text-gray-600">{welcomeDescriptionExtended}</p>
      )}
    </Card>
  );
};

export default WelcomeSection;
