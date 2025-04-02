
import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center p-8">
      <div className="animate-spin h-10 w-10 border-4 border-primary rounded-full border-t-transparent"></div>
    </div>
  );
};
