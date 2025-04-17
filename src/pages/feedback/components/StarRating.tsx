
import React from 'react';
import { Star } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
}

const StarRating = ({ rating, setRating }: StarRatingProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="rating">How would you rate your overall experience?</Label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(star => (
          <button 
            key={star} 
            type="button" 
            onClick={() => setRating(star)} 
            className="p-2 rounded-full transition-colors"
          >
            <Star className={`h-8 w-8 ${rating >= star ? 'fill-primary text-primary' : 'text-gray-300'}`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StarRating;
