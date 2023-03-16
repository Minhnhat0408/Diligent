import { useEffect, useState } from 'react';

function useDebounce(value, delay) {
    const [debounce, setDebounce] = useState(value);
    useEffect(() => {
        const time = setTimeout(() => setDebounce(value), delay);
        return () => clearTimeout(time);
    }, [value]);

    return debounce;
}

export default useDebounce;
