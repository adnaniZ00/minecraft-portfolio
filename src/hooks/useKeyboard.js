import { useRef, useEffect } from "react";

export const useKeyboard = () => {
  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    " ": false,
    e: false,
    arrowup: false,
    arrowdown: false,
    arrowleft: false,
    arrowright: false,
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent spacebar from clicking focused buttons or scrolling the page
      if (e.key === " " || e.code === "Space") {
        if (document.activeElement && document.activeElement.tagName === "BUTTON") {
          document.activeElement.blur();
        }
        e.preventDefault();
      }

      const key = e.key.toLowerCase();
      if (key in keys.current) {
        keys.current[key] = true;
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (key in keys.current) {
        keys.current[key] = false;
      }
    };

    const handleBlur = () => {
      keys.current = {
        w: false,
        a: false,
        s: false,
        d: false,
        " ": false,
        e: false,
        arrowup: false,
        arrowdown: false,
        arrowleft: false,
        arrowright: false,
      };
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  return keys;
};
