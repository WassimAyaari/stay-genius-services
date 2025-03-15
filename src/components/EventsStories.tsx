
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface StoryProps {
  id: number;
  title: string;
  image: string;
  category: 'event' | 'promo';
  seen?: boolean;
}

const stories: StoryProps[] = [
  {
    id: 1,
    title: "Wine Tasting",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "event"
  },
  {
    id: 2,
    title: "Chef's Special",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "event"
  },
  {
    id: 3,
    title: "Spa Day",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "promo",
    seen: true
  },
  {
    id: 4,
    title: "Stay Discount",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "promo"
  },
  {
    id: 5,
    title: "Cocktail Hour",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "event"
  },
  {
    id: 6,
    title: "Weekend Deal",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "promo"
  }
];

const EventsStories: React.FC = () => {
  const [viewedStories, setViewedStories] = useState<number[]>([]);
  
  const markAsSeen = (id: number) => {
    if (!viewedStories.includes(id)) {
      setViewedStories([...viewedStories, id]);
    }
  };
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-secondary">Events & Promos</h2>
        <Link to="/events" className="text-primary text-sm font-medium">View all</Link>
      </div>
      <ScrollArea className="w-full pb-4">
        <div className="flex space-x-4 pb-2">
          {stories.map((story) => (
            <Link 
              key={story.id} 
              to={`/events`} 
              className="flex flex-col items-center space-y-1"
              onClick={() => markAsSeen(story.id)}
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
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default EventsStories;
