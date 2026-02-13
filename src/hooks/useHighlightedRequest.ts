import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useHighlightedRequest = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightedId = searchParams.get('requestId');
  const highlightRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (highlightedId && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Clear the param after 4 seconds so the highlight fades
      const timer = setTimeout(() => {
        searchParams.delete('requestId');
        setSearchParams(searchParams, { replace: true });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [highlightedId]);

  return { highlightedId, highlightRef };
};
