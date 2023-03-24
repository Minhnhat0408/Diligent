import { useEffect } from "react";

function useUnload(handler) {
    useEffect(() => {
      window.addEventListener('unload', handler);
  
      return () => {
        window.removeEventListener('unload', handler);
      };
    }, [handler]);
  }

export default useUnload