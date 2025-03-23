
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InfoItem } from '@/lib/types';
import InfoItemSection from './InfoItemSection';

interface DirectorySectionProps {
  directoryTitle: string;
  importantNumbers: InfoItem[];
  hotelPolicies: InfoItem[];
  facilities: InfoItem[];
  additionalInfo: InfoItem[];
  handleTextChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  addInfoItem: (type: string) => void;
  removeInfoItem: (type: string, index: number) => void;
  handleInfoItemChange: (type: string, index: number, field: string, value: string) => void;
}

const DirectorySection = ({
  directoryTitle,
  importantNumbers,
  hotelPolicies,
  facilities,
  additionalInfo,
  handleTextChange,
  addInfoItem,
  removeInfoItem,
  handleInfoItemChange
}: DirectorySectionProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Directory & Information</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="directory_title">Section Title</Label>
          <Input 
            id="directory_title" 
            name="directory_title" 
            value={directoryTitle || ''} 
            onChange={handleTextChange}
          />
        </div>

        <div className="space-y-4">
          <InfoItemSection
            title="Important Numbers"
            items={importantNumbers}
            type="important_numbers"
            addInfoItem={addInfoItem}
            removeInfoItem={removeInfoItem}
            handleInfoItemChange={handleInfoItemChange}
          />

          <InfoItemSection
            title="Hotel Policies"
            items={hotelPolicies}
            type="hotel_policies"
            addInfoItem={addInfoItem}
            removeInfoItem={removeInfoItem}
            handleInfoItemChange={handleInfoItemChange}
          />

          <InfoItemSection
            title="Facilities & Amenities"
            items={facilities}
            type="facilities"
            addInfoItem={addInfoItem}
            removeInfoItem={removeInfoItem}
            handleInfoItemChange={handleInfoItemChange}
          />

          <InfoItemSection
            title="Additional Information"
            items={additionalInfo}
            type="additional_info"
            addInfoItem={addInfoItem}
            removeInfoItem={removeInfoItem}
            handleInfoItemChange={handleInfoItemChange}
          />
        </div>
      </div>
    </Card>
  );
};

export default DirectorySection;
