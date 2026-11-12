import { useRef, useState, useEffect } from "react";

/**
 * TouchJoystick
 * Virtual on-screen touch joystick and action buttons designed for mobile/tablet.
 * Outputs normalized { x, y } movement vector and jump action.
 */
export function TouchJoystick({ onMove, onJump }) {
  const containerRef = useRef(null);
  const [active, setActive] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const touchIdRef = useRef(null);
  const originRef = useRef({ x: 0, y: 0 });

  const RADIUS = 45; // max joystick drag radius in px

  const handleTouchStart = (e) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    originRef.current = { x: centerX, y: centerY };

    setActive(true);
    updatePosition(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    if (touchIdRef.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        updatePosition(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const updatePosition = (clientX, clientY) => {
    const dx = clientX - originRef.current.x;
    const dy = clientY - originRef.current.y;
    const distance = Math.hypot(dx, dy);

    let clampedX = dx;
    let clampedY = dy;

    if (distance > RADIUS) {
      clampedX = (dx / distance) * RADIUS;
      clampedY = (dy / distance) * RADIUS;
    }

    setKnobPos({ x: clampedX, y: clampedY });

    // Normalized outputs between -1 and 1
    const normX = clampedX / RADIUS;
    const normY = clampedY / RADIUS;

    if (onMove) {
      onMove({ x: normX, y: normY });
    }
  };

  const handleTouchEnd = (e) => {
    if (touchIdRef.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setActive(false);
        setKnobPos({ x: 0, y: 0 });
        if (onMove) {
          onMove({ x: 0, y: 0 });
        }
        break;
      }
    }
  };

  useEffect(() => {
    const handleGlobalTouchMove = (e) => {
      if (touchIdRef.current !== null) {
        if (e.cancelable) e.preventDefault();
        handleTouchMove(e);
      }
    };
    const handleGlobalTouchEnd = (e) => {
      if (touchIdRef.current !== null) {
        handleTouchEnd(e);
      }
    };

    window.addEventListener("touchmove", handleGlobalTouchMove, { passive: false });
    window.addEventListener("touchend", handleGlobalTouchEnd);
    window.addEventListener("touchcancel", handleGlobalTouchEnd);

    return () => {
      window.removeEventListener("touchmove", handleGlobalTouchMove);
      window.removeEventListener("touchend", handleGlobalTouchEnd);
      window.removeEventListener("touchcancel", handleGlobalTouchEnd);
    };
  }, []);

  return (
    <div className="mobile-touch-controls">
      {/* Joystick Base */}
      <div
        ref={containerRef}
        className={`touch-joystick-base ${active ? "active" : ""}`}
        onTouchStart={handleTouchStart}
      >
        <div className="touch-joystick-dpad-indicator">
          <span className="dpad-arrow up">▲</span>
          <span className="dpad-arrow left">◀</span>
          <span className="dpad-arrow right">▶</span>
          <span className="dpad-arrow down">▼</span>
        </div>
        {/* Joystick Thumb Knob */}
        <div
          className="touch-joystick-knob"
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          }}
        />
      </div>

      {/* Mobile Jump Button */}
      <button
        className="mobile-action-btn mobile-jump-btn"
        onTouchStart={(e) => {
          e.preventDefault();
          onJump && onJump(true);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          onJump && onJump(false);
        }}
        onClick={(e) => e.preventDefault()}
        aria-label="Jump"
      >
        <span>JUMP</span>
      </button>
    </div>
  );
}

