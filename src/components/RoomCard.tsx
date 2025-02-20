
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BedDouble, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RoomCardProps {
  id: string;
  name: string;
  price: number;
  capacity: number;
  size: string;
  image: string;
}

const RoomCard = ({ id, name, price, capacity, size, image }: RoomCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="w-[300px] overflow-hidden flex-shrink-0 animate-fade-in">
      <div className="relative h-[200px]">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-primary text-white text-sm rounded-full">
            ${price}/night
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{name}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <BedDouble className="w-4 h-4" />
            <span>{size}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>Up to {capacity}</span>
          </div>
        </div>
        <Button 
          onClick={() => navigate(`/rooms/${id}`)}
          className="w-full flex items-center justify-between"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default RoomCard;
