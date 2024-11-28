import { useState, useEffect } from "react";

function useImageLoader(src: string) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setHasError] = useState(false);

  useEffect(() => {
    if (!Boolean(src)) {
      setIsLoaded(false);
      setHasError(true);
    } else {
      const img = new Image();
      img.src = src;

      img.onload = () => {
        setIsLoaded(true);
        setHasError(false);
      };

      img.onerror = () => {
        setIsLoaded(false);
        setHasError(true);
      };
    }
  }, [src]);

  return { isLoaded, isError };
}

export default useImageLoader;
