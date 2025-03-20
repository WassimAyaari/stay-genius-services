
import { HotelHero } from '@/lib/types';
import { Card } from '@/components/ui/card';

interface PreviewProps {
  data: any;
  type: 'hero' | 'service' | 'experience' | 'event' | 'assistance';
}

export const Preview = ({ data, type }: PreviewProps) => {
  if (type === 'hero') {
    return <HeroPreview data={data as HotelHero} />;
  }
  
  return (
    <div className="p-4 border rounded-md bg-gray-50">
      <p className="text-sm text-center text-gray-500">Prévisualisation non disponible</p>
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
            <span className={`px-2 py-1 rounded ${data.status === 'active' ? 'bg-green-500' : 'bg-gray-500'} text-white`}>
              {data.status === 'active' ? 'Actif' : 'Inactif'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
