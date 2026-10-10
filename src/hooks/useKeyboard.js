import { useRef, useEffect } from "react";

export const useKeyboard = () => {
  const keys = useRef({ w: false, a: false, s: false, d: false, " ": false });

  useEffect(() => {
    const handleKeyDown = (e) => {
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
      keys.current = { w: false, a: false, s: false, d: false, " ": false };
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
