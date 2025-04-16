
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Story, Event } from '@/types/event';

interface StoryContentPresentationProps {
  story: Story;
  linkedEvent: Event | null;
  onNavigateToEvents: (e: React.MouseEvent) => void;
  onBookEvent: (e: React.MouseEvent) => void;
}

export const StoryContentPresentation: React.FC<StoryContentPresentationProps> = ({
  story,
  linkedEvent,
  onNavigateToEvents,
  onBookEvent
}) => {
  return (
    <motion.div 
      className="w-full h-full relative"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2 }}
    >
      <img 
        src={story.image} 
        alt={story.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      
      <div className="absolute bottom-20 left-4 right-4 text-white p-4">
        <h2 className="text-2xl font-bold mb-2">{story.title}</h2>
        <p className="mb-6">{story.description}</p>
        <div className="flex flex-wrap space-x-3">
          <Button 
            onClick={onNavigateToEvents} 
            className="flex gap-2 items-center mb-2"
          >
            <ExternalLink className="w-4 h-4" />
            Voir événements
          </Button>
          
          {linkedEvent && (
            <Button 
              variant="secondary"
              onClick={onBookEvent} 
              className="flex gap-2 items-center mb-2"
            >
              <Calendar className="w-4 h-4" />
              Réserver {linkedEvent.title}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
