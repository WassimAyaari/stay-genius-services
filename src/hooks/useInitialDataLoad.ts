
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useInitialDataLoad(handleRefresh: () => Promise<void>) {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    console.log('RequestsTab mounted, forcing aggressive refresh of data');
    
    // Actualisation immédiate
    handleRefresh();
    
    // Planifier plusieurs cycles d'actualisation pour s'assurer que les données sont chargées
    const refreshTimes = [500, 1500, 3000, 5000];
    const refreshTimers = refreshTimes.map(delay => 
      setTimeout(() => {
        console.log(`Performing delayed refresh after ${delay}ms`);
        queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
        queryClient.refetchQueries({ queryKey: ['serviceRequests'] });
      }, delay)
    );
    
    return () => {
      refreshTimers.forEach(clearTimeout);
    };
  }, [queryClient, handleRefresh]);
}
