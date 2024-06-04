import { useEffect, useRef } from "react";

const useHideOnAdd = () => {
  const targetElementRef = useRef(null);

  useEffect(() => {
    const observerCallback = (mutationsList, observer) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          // Check if the added node has the expected styles
          const addedNode = mutation.addedNodes[0];
          if (
            addedNode.nodeType === 1 && // Node is an element
            addedNode.style && // Check if it has a style property
            addedNode.style.position === "fixed" // Add other style checks as needed
          ) {
            console.log("Element added:", addedNode);
            addedNode.style.display = "none";
            observer.disconnect(); // Disconnect the observer once the element is found and hidden
          }
        }
      });
    };

    const observer = new MutationObserver(observerCallback);

    if (targetElementRef.current) {
      observer.observe(targetElementRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect(); // Disconnect the observer on cleanup
    };
  }, []); // Empty dependency array ensures that the effect runs once after the initial render

  return targetElementRef;
};

export default useHideOnAdd;
