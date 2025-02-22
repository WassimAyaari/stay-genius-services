
import React from 'react';
import { cn } from "@/lib/utils";

interface SwipeIndicatorProps {
  selectedIndex: number;
  totalSlides: number;
  className?: string;
}

const SwipeIndicator = ({ selectedIndex, totalSlides, className }: SwipeIndicatorProps) => {
  return (
    <div className={cn("flex justify-center items-center gap-2 mt-6", className)}>
      {Array.from({ length: totalSlides }).map((_, index) => (
        <div
          key={index}
          className="relative"
        >
          <div
            className={cn(
              "transition-all duration-300 transform",
              index === selectedIndex 
                ? "bg-primary/20 backdrop-blur-sm p-4 rounded-full scale-100" 
                : "bg-transparent p-3 rounded-full scale-90"
            )}
          >
            <div 
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                index === selectedIndex 
                  ? "bg-primary scale-100" 
                  : index < selectedIndex
                  ? "bg-primary/30 scale-75 -translate-x-1"
                  : "bg-primary/30 scale-75 translate-x-1"
              )}
              style={{
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            />
          </div>
          {index === selectedIndex && (
            <div 
              className="absolute inset-0 bg-primary/10 rounded-full animate-ping"
              style={{ animationDuration: "2s" }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default SwipeIndicator;
