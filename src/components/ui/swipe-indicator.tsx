
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
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {Array.from({ length: totalSlides }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            index === selectedIndex 
              ? "w-4 bg-primary" 
              : "w-2 bg-primary/30"
          )}
        />
      ))}
    </div>
  );
};

export default SwipeIndicator;
