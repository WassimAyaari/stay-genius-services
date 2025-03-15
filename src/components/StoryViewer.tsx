
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Story {
  id: number;
  title: string;
  image: string;
  category: string;
  description?: string;
  link?: string;
}

interface StoryViewerProps {
  stories: Story[];
  initialStoryIndex: number;
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ 
  stories, 
  initialStoryIndex, 
  onClose 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  
  const currentStory = stories[currentIndex];
  const storyDuration = 5000; // 5 seconds per story
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Move to next story when progress reaches 100%
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
  }, [currentIndex, stories.length, onClose]);
  
  useEffect(() => {
    // Reset progress when story changes
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
  
  const navigateToEventPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/events');
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
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 flex space-x-1 z-10">
        {stories.map((_, index) => (
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
      
      {/* Story Content */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex}
          className="w-full h-full relative"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.2 }}
        >
          <img 
            src={currentStory.image} 
            alt={currentStory.title}
            className="w-full h-full object-cover"
          />
          <div 
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" 
          />
          
          <div className="absolute bottom-20 left-4 right-4 text-white p-4">
            <h2 className="text-2xl font-bold mb-2">{currentStory.title}</h2>
            <p className="mb-6">{currentStory.description}</p>
            <div className="flex space-x-3">
              <Button 
                onClick={navigateToEventPage} 
                className="flex gap-2 items-center"
              >
                <ExternalLink className="w-4 h-4" />
                View Details
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation buttons */}
      <button 
        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white h-16 w-16 
          flex items-center justify-start"
        onClick={handlePrevious}
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      
      <button 
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white h-16 w-16 
          flex items-center justify-end"
        onClick={handleNext}
      >
        <ArrowRight className="w-6 h-6" />
      </button>
    </motion.div>
  );
};

export default StoryViewer;
