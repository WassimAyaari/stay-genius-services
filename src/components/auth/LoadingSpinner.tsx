
import React from 'react';

/**
 * Composant d'indicateur de chargement
 */
const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></span>
    </div>
  );
};

export default LoadingSpinner;
