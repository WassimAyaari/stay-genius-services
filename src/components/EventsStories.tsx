import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import StoryViewer from './StoryViewer';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem 
} from '@/components/ui/carousel';
import SwipeIndicator from '@/components/ui/swipe-indicator';

export interface StoryProps {
  id: number;
  title: string;
  image: string;
  category: 'event' | 'promo';
  description?: string;
  seen?: boolean;
}

export const stories: StoryProps[] = [
  {
    id: 1,
    title: "Wine Tasting",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "event",
    description: "Join our sommelier for an exclusive wine tasting event featuring premium selections from around the world."
  },
  {
    id: 2,
    title: "Chef's Special",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "event",
    description: "Experience a culinary journey with our executive chef's special tasting menu featuring seasonal ingredients."
  },
  {
    id: 3,
    title: "Spa Day",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "promo",
    description: "Enjoy 20% off on our signature spa treatments. Package includes a 60-minute massage and facial.",
    seen: true
  },
  {
    id: 4,
    title: "Stay Discount",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "promo",
    description: "Book 5 nights and get 15% off your entire stay, plus complimentary breakfast and spa access."
  },
  {
    id: 5,
    title: "Cocktail Hour",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "event",
    description: "Learn how to make signature cocktails with our expert mixologists. Includes tastings and recipe cards."
  },
  {
    id: 6,
    title: "Weekend Deal",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "promo",
    description: "Book our weekend package and enjoy special amenities including spa credits and dining discounts."
  }
];

const EventsStories: React.FC = () => {
  const [viewedStories, setViewedStories] = useState<number[]>([]);
  const [storyViewerOpen, setStoryViewerOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useIsMobile();
  
  const markAsSeen = (id: number, index: number) => {
    if (!viewedStories.includes(id)) {
      setViewedStories([...viewedStories, id]);
    }
    setSelectedStoryIndex(index);
    setStoryViewerOpen(true);
  };
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-secondary">Events & Promos</h2>
        <Link to="/events" className="text-primary text-sm font-medium">View all</Link>
      </div>
      
      {isMobile ? (
        <div className="relative">
          <Carousel 
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
            onSelect={(api) => {
              const selectedIndex = api?.selectedScrollSnap() || 0;
              setActiveIndex(selectedIndex);
            }}
          >
            <CarouselContent className="py-2">
              {stories.map((story, index) => (
                <CarouselItem key={story.id} className="basis-auto pl-4 pr-2">
                  <button 
                    className="flex flex-col items-center space-y-1 bg-transparent border-none"
                    onClick={() => markAsSeen(story.id, index)}
                  >
                    <div className={cn(
                      "p-1 rounded-full", 
                      viewedStories.includes(story.id) || story.seen 
                        ? "bg-gray-300" 
                        : "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500"
                    )}>
                      <div className="p-0.5 bg-white rounded-full">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={story.image} alt={story.title} className="object-cover" />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {story.title.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    <span className="text-xs text-center w-16 truncate">{story.title}</span>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <SwipeIndicator 
            selectedIndex={activeIndex} 
            totalSlides={stories.length} 
            className="mt-2" 
          />
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-4 pb-2">
            {stories.map((story, index) => (
              <button 
                key={story.id} 
                className="flex flex-col items-center space-y-1 bg-transparent border-none"
                onClick={() => markAsSeen(story.id, index)}
              >
                <div className={cn(
                  "p-1 rounded-full", 
                  viewedStories.includes(story.id) || story.seen 
                    ? "bg-gray-300" 
                    : "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500"
                )}>
                  <div className="p-0.5 bg-white rounded-full">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={story.image} alt={story.title} className="object-cover" />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {story.title.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <span className="text-xs text-center w-16 truncate">{story.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {storyViewerOpen && (
        <StoryViewer 
          stories={stories} 
          initialStoryIndex={selectedStoryIndex}
          onClose={() => setStoryViewerOpen(false)}
        />
      )}
    </div>
  );
};

export default EventsStories;
