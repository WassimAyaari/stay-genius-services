
import React from 'react';
import { Story, Event } from '@/types/event';
import { StoryContentContainer } from './StoryContentContainer';

interface StoryContentProps {
  story: Story;
  linkedEvent: Event | null;
  onNavigateToEvents: (e: React.MouseEvent) => void;
  onBookEvent: (e: React.MouseEvent) => void;
}

export const StoryContent: React.FC<StoryContentProps> = ({
  story,
  linkedEvent,
  onNavigateToEvents,
  onBookEvent
}) => {
  return (
    <StoryContentContainer
      story={story}
      linkedEvent={linkedEvent}
    />
  );
};
