
import { HotelHero } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Mail, ChevronLeft, MessageCircle, Info, UtensilsCrossed, BedDouble, PhoneCall } from 'lucide-react';

interface PreviewProps {
  data: any;
  type: 'hero' | 'service' | 'experience' | 'event' | 'assistance';
}

export const Preview = ({ data, type }: PreviewProps) => {
  if (!data) {
    return (
      <div className="p-4 border rounded-md bg-gray-50">
        <p className="text-sm text-center text-gray-500">Aucune donnée à prévisualiser</p>
      </div>
    );
  }
  
  if (type === 'hero') {
    return <HeroPreview data={data as HotelHero} />;
  }
  
  return (
    <div className="p-4 border rounded-md bg-gray-50">
      <p className="text-sm text-center text-gray-500">Prévisualisation non disponible pour ce type</p>
    </div>
  );
};

const HeroPreview = ({ data }: { data: HotelHero }) => {
  // Make sure we have valid data object
  if (!data) {
    return (
      <Card className="overflow-hidden">
        <div className="h-[300px] w-full bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Aucune donnée disponible</p>
        </div>
      </Card>
    );
  }
  
  // Use a placeholder image if the background_image is not set or invalid
  const backgroundImage = data.background_image && data.background_image.trim() !== '' 
    ? data.background_image 
    : '/placeholder.svg';
  
  return (
    <Card className="overflow-hidden">
      {/* Mock Header */}
      <div className="bg-white/80 backdrop-blur-md border-b shadow-sm p-4">
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center gap-2 w-[100px]">
            <span className="p-2.5 rounded-full bg-gray-100">
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </span>
          </div>

          <div className="flex-1 flex justify-center items-center">
            <span className="text-xl font-bold text-gray-700">Hotel Genius</span>
          </div>
          
          <div className="flex items-center gap-3 w-[100px] justify-end">
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            <div className="relative p-2.5 rounded-full bg-gray-100">
              <MessageCircle className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-purple-500 rounded-full text-[10px] text-white flex items-center justify-center font-medium border border-white">
                2
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div 
        className="relative h-[300px] w-full bg-cover bg-center" 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-6">
          <h1 className="text-3xl font-bold mb-2">{data.title || 'Titre'}</h1>
          <p className="text-xl mb-8">{data.subtitle || 'Sous-titre'}</p>
          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder={data.search_placeholder || 'Rechercher...'}
              className="w-full px-4 py-2 rounded-lg text-gray-800"
              readOnly
            />
          </div>
          <div className="mt-4 text-sm">
            <span className={cn(
              "px-2 py-1 rounded text-white",
              data.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
            )}>
              {data.status === 'active' ? 'Actif' : 'Inactif'}
            </span>
          </div>
        </div>
      </div>

      {/* Mock Hotel Info */}
      <div className="bg-white py-4 px-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Hotel Information</h2>
        <div className="flex flex-wrap gap-4 mt-2 text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>123 Example Street</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>+123 456 7890</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>contact@hotel.com</span>
          </div>
        </div>
      </div>

      {/* Mock Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 flex justify-around">
        <div className="flex flex-col items-center">
          <Info className="h-6 w-6 text-gray-400" />
          <span className="text-xs mt-1 text-gray-600">About Us</span>
        </div>
        <div className="flex flex-col items-center">
          <UtensilsCrossed className="h-6 w-6 text-gray-400" />
          <span className="text-xs mt-1 text-gray-600">Dining</span>
        </div>
        <div className="flex flex-col items-center">
          <BedDouble className="h-6 w-6 text-gray-400" />
          <span className="text-xs mt-1 text-gray-600">My Room</span>
        </div>
        <div className="flex flex-col items-center">
          <PhoneCall className="h-6 w-6 text-gray-400" />
          <span className="text-xs mt-1 text-gray-600">Request</span>
        </div>
      </div>
    </Card>
  );
};
