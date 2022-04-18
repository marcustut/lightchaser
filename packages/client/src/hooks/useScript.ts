import { useEffect } from 'react';

export const useScript = (url: string[], type: string) => {
  useEffect(() => {
    url.map((u) => {
      const unit = document.createElement('script');

      unit.src = u;
      unit.async = true;
      unit.type = type;

      document.head.appendChild(unit);

      return () => {
        document.head.removeChild(unit);
      };
    });
  }, [type, url]);
};
