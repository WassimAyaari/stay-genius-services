
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';
import { InfoItem } from '@/lib/types';

interface InfoItemSectionProps {
  title: string;
  items: InfoItem[];
  type: string;
  addInfoItem: (type: string) => void;
  removeInfoItem: (type: string, index: number) => void;
  handleInfoItemChange: (type: string, index: number, field: string, value: string) => void;
}

const InfoItemSection = ({
  title,
  items,
  type,
  addInfoItem,
  removeInfoItem,
  handleInfoItemChange
}: InfoItemSectionProps) => {
  return (
    <div className="border-t pt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">{title}</h3>
        <Button type="button" variant="outline" size="sm" onClick={() => addInfoItem(type)}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
      
      {items.map((item, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <Input 
            placeholder="Label"
            value={item.label || ''} 
            onChange={(e) => handleInfoItemChange(type, index, 'label', e.target.value)}
            className="flex-1"
          />
          <Input 
            placeholder="Value"
            value={String(item.value || '')} 
            onChange={(e) => handleInfoItemChange(type, index, 'value', e.target.value)}
            className="flex-1"
          />
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={() => removeInfoItem(type, index)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default InfoItemSection;
