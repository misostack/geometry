import { useState, useEffect } from "react";

function useWindowSize() {
  // Initialize state with current window size
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set up a ResizeObserver to listen to size changes
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(document.body);

    // Clean up observer on component unmount
    return () => resizeObserver.disconnect();
  }, []);

  return size;
}

export default useWindowSize;
