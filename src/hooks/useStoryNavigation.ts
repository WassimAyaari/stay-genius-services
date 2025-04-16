
import { useState, useEffect } from 'react';
import { Story } from '@/types/event';

interface UseStoryNavigationProps {
  stories: Story[];
  initialStoryIndex: number;
  storyDuration: number;
  onClose: () => void;
}

export const useStoryNavigation = ({
  stories,
  initialStoryIndex,
  storyDuration,
  onClose
}: UseStoryNavigationProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1);
            return 0;
          } else {
            clearInterval(timer);
            onClose();
            return 100;
          }
        }
        return prev + (100 / (storyDuration / 100));
      });
    }, 100);
    
    return () => clearInterval(timer);
  }, [currentIndex, stories.length, onClose, storyDuration]);

  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        setProgress(0);
      }
    } else if (e.key === 'ArrowRight') {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setProgress(0);
      } else {
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return {
    currentIndex,
    progress,
    handlePrevious,
    handleNext,
    handleKeyDown
  };
};
