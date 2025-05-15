import { PLAY_FEATURE_BUTTON_PREFIX } from "libnostrsite";
import { useState, useEffect } from "react";

function useImageLoader(src: string | null) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setHasError] = useState(false);

  // libnostrsite uses this hack to format video previews for Ghost themes,
  // such images are fake and shouldn't be used
  if (src?.startsWith(PLAY_FEATURE_BUTTON_PREFIX)) src = null;

  useEffect(() => {
    if (!src || src === null) {
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
