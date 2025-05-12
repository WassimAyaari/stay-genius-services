
import React from 'react';
import { cn } from "@/lib/utils";

interface SwipeIndicatorProps {
  selectedIndex: number;
  totalSlides: number;
  className?: string;
}

const SwipeIndicator = ({
  selectedIndex,
  totalSlides,
  className
}: SwipeIndicatorProps) => {
  return (
    <div className={cn("flex justify-center items-center gap-2 mt-6", className)}>
      {Array.from({length: totalSlides}).map((_, index) => (
        <div 
          key={index} 
          className={cn(
            "h-2 w-2 rounded-full transition-all duration-300",
            index === selectedIndex ? "bg-primary w-4" : "bg-gray-300"
          )}
        >
          {index === selectedIndex && (
            <div 
              className="absolute inset-0 bg-primary/10 rounded-full animate-ping" 
              style={{animationDuration: "2s"}} 
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default SwipeIndicator;
