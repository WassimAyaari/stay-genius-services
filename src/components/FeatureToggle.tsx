
import React from 'react';
import { useHotel } from '@/context/HotelContext';

interface FeatureToggleProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const FeatureToggle: React.FC<FeatureToggleProps> = ({
  feature,
  children,
  fallback = (
    <div className="p-4 bg-gray-100 rounded-md">
      <p className="text-gray-500 text-center">Cette fonctionnalité n'est pas activée</p>
    </div>
  )
}) => {
  const { hotel } = useHotel();
  
  if (!hotel || !hotel.config || !hotel.config.enabled_features) {
    return null;
  }
  
  if (!hotel.config.enabled_features.includes(feature)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

export default FeatureToggle;
