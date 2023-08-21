import { useEffect } from "react";

function useUnload(handler) {
    useEffect(() => {
      window.addEventListener('beforeunload', handler);
      
      return () => {
        window.removeEventListener('beforeunload', handler);
      };
    }, [handler]);
  }

export default useUnload