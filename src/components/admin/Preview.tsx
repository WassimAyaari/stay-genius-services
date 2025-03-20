
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
  return (
    <Card className="overflow-hidden">
      <div 
        className="relative h-[300px] w-full bg-cover bg-center" 
        style={{ backgroundImage: `url(${data.background_image})` }}
      >
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-6">
          <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
          <p className="text-xl mb-8">{data.subtitle}</p>
          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder={data.search_placeholder}
              className="w-full px-4 py-2 rounded-lg text-gray-800"
              readOnly
            />
          </div>
          <div className="mt-4 text-sm">
            <span className="px-2 py-1 rounded bg-green-500 text-white">
              {data.status === 'active' ? 'Actif' : 'Inactif'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
