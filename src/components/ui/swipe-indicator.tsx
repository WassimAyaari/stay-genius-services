
import React from 'react';
import { cn } from "@/lib/utils";

interface SwipeIndicatorProps {
  selectedIndex: number;
  totalSlides: number;
  className?: string;
}

const SwipeIndicator = ({ selectedIndex, totalSlides, className }: SwipeIndicatorProps) => {
  return (
    <div className={cn("flex justify-center items-center gap-1 mt-4", className)}>
      {Array.from({ length: totalSlides }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-1 rounded-full transition-all duration-300",
            index === selectedIndex 
              ? "w-12 bg-primary animate-pulse h-1.5" 
              : "w-2 bg-primary/30"
          )}
        />
      ))}
    </div>
  );
};

export default SwipeIndicator;
