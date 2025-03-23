
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface WelcomeSectionProps {
  welcomeTitle: string;
  welcomeDescription: string;
  welcomeDescriptionExtended: string;
  handleTextChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const WelcomeSection = ({
  welcomeTitle,
  welcomeDescription,
  welcomeDescriptionExtended,
  handleTextChange
}: WelcomeSectionProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Welcome Section</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="welcome_title">Section Title</Label>
          <Input 
            id="welcome_title" 
            name="welcome_title" 
            value={welcomeTitle || ''} 
            onChange={handleTextChange}
          />
        </div>

        <div>
          <Label htmlFor="welcome_description">Main Description</Label>
          <Textarea 
            id="welcome_description" 
            name="welcome_description" 
            value={welcomeDescription || ''} 
            onChange={handleTextChange}
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="welcome_description_extended">Extended Description</Label>
          <Textarea 
            id="welcome_description_extended" 
            name="welcome_description_extended" 
            value={welcomeDescriptionExtended || ''} 
            onChange={handleTextChange}
            rows={3}
          />
        </div>
      </div>
    </Card>
  );
};

export default WelcomeSection;
