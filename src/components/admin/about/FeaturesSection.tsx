
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, History, Building2, Users, Award } from 'lucide-react';
import { FeatureItem } from '@/lib/types';

interface FeaturesSectionProps {
  features: FeatureItem[];
  addFeature: () => void;
  removeFeature: (index: number) => void;
  handleFeatureChange: (index: number, field: string, value: string) => void;
}

const FeaturesSection = ({
  features,
  addFeature,
  removeFeature,
  handleFeatureChange
}: FeaturesSectionProps) => {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'History': return <History />;
      case 'Building2': return <Building2 />;
      case 'Users': return <Users />;
      case 'Award': return <Award />;
      default: return <History />;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Features Grid</h2>
        <Button type="button" variant="outline" onClick={addFeature}>
          <Plus className="h-4 w-4 mr-1" /> Add Feature
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <Card key={index} className="p-4 relative">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2"
              onClick={() => removeFeature(index)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>

            <div className="flex flex-col items-center gap-2 mt-4">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                {getIconComponent(feature.icon)}
              </div>
              
              <Input 
                placeholder="Title"
                value={feature.title || ''} 
                onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                className="text-center"
              />
              
              <Textarea 
                placeholder="Description"
                value={feature.description || ''} 
                onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                className="text-center text-sm"
                rows={2}
              />
              
              <div className="w-full mt-2">
                <Label htmlFor={`icon-${index}`}>Icon</Label>
                <select 
                  id={`icon-${index}`}
                  value={feature.icon || 'History'} 
                  onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="History">History</option>
                  <option value="Building2">Building</option>
                  <option value="Users">Team</option>
                  <option value="Award">Award</option>
                </select>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default FeaturesSection;
