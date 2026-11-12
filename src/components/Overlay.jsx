import { playSound } from "../utils/sound";
import { TouchJoystick } from "./TouchJoystick";

export function Overlay({
  isDay,
  onToggleTime,
  onOpenCredits,
  nearLandmark,
  onInteractLandmark,
  onJoystickMove,
  onMobileJump,
}) {
  const handleHudButtonClick = (e, action) => {
    playSound("button", { volume: 0.5 });
    // Remove focus from HUD buttons so spacebar jump doesn't re-trigger them
    e?.currentTarget?.blur();
    action?.();
  };

  const handleHudButtonKeyDown = (e) => {
    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <>
      {/* <div id="coord-tracker" className="coord-tracker">
        X: 0.0 | Y: 0.0 | Z: 0.0
      </div> */}

      <div className="hud-top-right">
        <button
          className="hud-btn time-toggle"
          onClick={(e) => handleHudButtonClick(e, onToggleTime)}
          onPointerDown={(e) => e.currentTarget.blur()}
          onKeyDown={handleHudButtonKeyDown}
          aria-label="Toggle Day and Night"
        >
          {isDay ? "Switch to Night 🌙" : "Switch to Day ☀️"}
        </button>

        <button
          className="hud-btn credits-toggle"
          onClick={(e) => handleHudButtonClick(e, onOpenCredits)}
          onPointerDown={(e) => e.currentTarget.blur()}
          onKeyDown={handleHudButtonKeyDown}
          aria-label="View 3D Model Credits"
        >
          📜 Credits
        </button>
      </div>

      {/* Minecraft-style Proximity Prompt when near a landmark */}
      {nearLandmark && (
        <div
          className="interaction-prompt"
          onClick={() => onInteractLandmark && onInteractLandmark(nearLandmark)}
        >
          <span className="key-badge">E</span>
          <span className="prompt-text">
            Interact with {nearLandmark.name}
          </span>
        </div>
      )}
      {/* Mobile / Tablet Touch Joystick & Controls */}
      <TouchJoystick onMove={onJoystickMove} onJump={onMobileJump} />
    </>
  );
}
