import { playSound } from "../utils/sound";

const SIMPLE_CONTROLS = [
  {
    id: "pc",
    label: "PC:",
    text: "For movement use WASD or Arrow keys, and for jump use Spacebar.",
  },
  {
    id: "mobile",
    label: "Mobile:",
    text: "Use the Joystick to move and the Jump button to jump.",
  },
];

/**
 * Translucent black landing popup explaining basic PC and mobile controls in simple terms.
 */
export function ControlsWelcomeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleConfirm = (e) => {
    e?.currentTarget?.blur();
    playSound("button", { volume: 0.5 });
    onClose?.();
  };

  return (
    <div
      className="mc-welcome-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
    >
      <div className="mc-welcome-dialog" onClick={(e) => e.stopPropagation()}>
        <h2 className="mc-welcome-title" id="welcome-modal-title">
          Controls
        </h2>

        <div className="mc-welcome-body">
          {SIMPLE_CONTROLS.map((item) => (
            <p key={item.id} className="mc-welcome-line">
              <strong>{item.label}</strong> {item.text}
            </p>
          ))}
        </div>

        <div className="mc-welcome-footer">
          <button
            type="button"
            className="mc-welcome-ok-btn"
            onClick={handleConfirm}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
