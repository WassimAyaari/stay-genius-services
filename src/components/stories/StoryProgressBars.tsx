
import React from 'react';

interface StoryProgressBarsProps {
  storiesCount: number;
  currentIndex: number;
  progress: number;
}

export const StoryProgressBars: React.FC<StoryProgressBarsProps> = ({
  storiesCount,
  currentIndex,
  progress
}) => {
  return (
    <div className="absolute top-4 left-4 right-4 flex space-x-1 z-10">
      {Array.from({ length: storiesCount }).map((_, index) => (
        <div 
          key={index} 
          className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
        >
          <div 
            className="h-full bg-white"
            style={{ 
              width: index === currentIndex 
                ? `${progress}%` 
                : index < currentIndex 
                  ? '100%' 
                  : '0%'
            }}
          />
        </div>
      ))}
    </div>
  );
};
