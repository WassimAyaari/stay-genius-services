import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';

interface UserQuickTemplatesProps {
  onSelectTemplate: (message: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const quickTemplates = [
  { category: 'Room Requests', templates: [
    'Can I get extra pillows for my room?',
    'I need more towels in my room',
    'My room is too hot/cold, can you help?',
    'Can I get some water bottles delivered?'
  ]},
  { category: 'Dining', templates: [
    'Can you help me make a restaurant reservation?',
    'Can I see the room service menu?',
    'What are the restaurant hours?'
  ]},
  { category: 'Hotel Info', templates: [
    'What are the pool hours?',
    'What time is checkout?',
    'What amenities does the hotel have?',
    'Can I get a late checkout?'
  ]},
  { category: 'Technical Help', templates: [
    'How do I connect to WiFi?',
    'My TV is not working properly',
    'My room key is not working'
  ]},
  { category: 'Local Info', templates: [
    'What restaurants are nearby?',
    'What attractions should I visit?',
    'How do I get to the airport?'
  ]}
];

const UserQuickTemplates = ({ onSelectTemplate, isOpen, onClose }: UserQuickTemplatesProps) => {
  if (!isOpen) return null;

  const handleTemplateSelect = (message: string) => {
    onSelectTemplate(message);
    onClose();
  };

  return (
    <div className="fixed bottom-20 left-2 right-2 bg-card border rounded-lg shadow-lg max-h-80 z-50">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-medium">Quick Questions</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="h-64 p-2">
        <div className="space-y-4">
          {quickTemplates.map((category) => (
            <div key={category.category} className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground px-2">
                {category.category}
              </h4>
              <div className="grid gap-2">
                {category.templates.map((template, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="justify-start text-left h-auto p-2 whitespace-normal"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    {template}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UserQuickTemplates;