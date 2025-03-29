
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShowerHead, 
  WashingMachine, 
  Wrench, 
  Utensils,
  Wifi,
  Plug,
  Car,
  Plus
} from 'lucide-react';

interface RequestPresetProps {
  onSelectPreset: (preset: {category: string, description: string, type: string}) => void;
  onBrowseAll: () => void;
}

const RequestPresetList = ({ onSelectPreset, onBrowseAll }: RequestPresetProps) => {
  const commonRequests = [
    {
      icon: <ShowerHead className="h-5 w-5" />,
      title: "Fresh Towels",
      category: "Housekeeping",
      description: "Request for fresh towels",
      type: "housekeeping"
    },
    {
      icon: <ShowerHead className="h-5 w-5" />,
      title: "Room Cleaning",
      category: "Housekeeping",
      description: "Request for room cleaning service",
      type: "housekeeping"
    },
    {
      icon: <WashingMachine className="h-5 w-5" />,
      title: "Laundry Pickup",
      category: "Laundry",
      description: "Request for laundry pickup",
      type: "laundry"
    },
    {
      icon: <Wrench className="h-5 w-5" />,
      title: "Maintenance Issue",
      category: "Maintenance",
      description: "Request for maintenance assistance",
      type: "maintenance"
    },
    {
      icon: <Utensils className="h-5 w-5" />,
      title: "Room Service",
      category: "Room Service",
      description: "Request for room service",
      type: "room_service"
    },
    {
      icon: <Wifi className="h-5 w-5" />,
      title: "WiFi Assistance",
      category: "Technical",
      description: "Request for WiFi connection help",
      type: "wifi"
    },
    {
      icon: <Plug className="h-5 w-5" />,
      title: "Additional Adaptors",
      category: "Amenities",
      description: "Request for additional power adaptors",
      type: "custom"
    },
    {
      icon: <Car className="h-5 w-5" />,
      title: "Valet/Parking",
      category: "Concierge",
      description: "Request for valet or parking assistance",
      type: "concierge"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {commonRequests.map((request, index) => (
          <Card 
            key={index}
            className="p-3 hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={() => onSelectPreset(request)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {request.icon}
              </div>
              <div>
                <h3 className="font-medium">{request.title}</h3>
                <p className="text-xs text-muted-foreground">{request.category}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center mt-6">
        <Button 
          variant="outline" 
          onClick={onBrowseAll}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Browse All Categories
        </Button>
      </div>
    </div>
  );
};

export default RequestPresetList;
