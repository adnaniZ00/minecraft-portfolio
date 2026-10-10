export function Overlay({ isDay, onToggleTime }) {
  return (
    <>
      <div id="coord-tracker" className="coord-tracker">
        X: 0.0 | Y: 0.0 | Z: 0.0
      </div>

      <button
        className="time-toggle"
        onClick={onToggleTime}
        aria-label="Toggle Day and Night"
      >
        {isDay ? "Switch to Night 🌙" : "Switch to Day ☀️"}
      </button>
    </>
  );
}
