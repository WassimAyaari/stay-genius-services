import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { SpaService } from '../types';
interface SpaServiceCardProps {
  service: SpaService;
  onBook: () => void;
}
const SpaServiceCard = ({
  service,
  onBook
}: SpaServiceCardProps) => {
  return <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-40 bg-gray-200">
        {service.image ? <img src={service.image} alt={service.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            
          </div>}
      </div>
      
    </Card>;
};
export default SpaServiceCard;