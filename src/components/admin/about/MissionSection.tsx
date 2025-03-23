
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface MissionSectionProps {
  mission: string;
  handleTextChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const MissionSection = ({
  mission,
  handleTextChange
}: MissionSectionProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Mission Statement</h2>
      
      <div>
        <Label htmlFor="mission">Mission</Label>
        <Textarea 
          id="mission" 
          name="mission" 
          value={mission || ''} 
          onChange={handleTextChange}
          rows={5}
          className="mb-2"
        />
        <p className="text-sm text-gray-500">
          A concise statement that defines the purpose and values of the hotel.
        </p>
      </div>
    </Card>
  );
};

export default MissionSection;
