import { useEffect } from 'react';

export const useScript = (url: string[]) => {
  useEffect(() => {
    url.map((u) => {
      const unit = document.createElement('script');

      unit.src = u;
      unit.async = true;

      document.head.appendChild(unit);

      return () => {
        document.head.removeChild(unit);
      };
    });
  }, [url]);
};
