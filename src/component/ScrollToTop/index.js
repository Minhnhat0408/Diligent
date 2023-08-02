import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  // State to store the scroll position
  const [scrollPosition, setScrollPosition] = useState({});

  // Save the scroll position when the component is unmounted (before navigating away)

  useEffect(() =>{
    setScrollPosition((prevScrollPosition) => ({
      ...prevScrollPosition,
      [pathname]: window.scrollY
    }));
  },[window.scrollY,pathname])
  // Restore the scroll position when the component is mounted (when navigating back to the page)
  useEffect(() => {
    const currentPosition = scrollPosition[pathname];
    if (currentPosition !== undefined) {
      window.scrollTo(0, currentPosition);
    }
  }, [scrollPosition, pathname]);


  return null;
}

export default ScrollToTop;