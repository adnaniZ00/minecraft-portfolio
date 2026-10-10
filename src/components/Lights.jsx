export function Lights({ isDay = true }) {
  return (
    <>
      <ambientLight
        intensity={isDay ? 1.8 : 1.1}
        color={isDay ? "#ffffff" : "#9bb5d4"}
      />
      <directionalLight
        position={isDay ? [6, 10, 6] : [-6, 14, -6]}
        intensity={isDay ? 1.2 : 0.85}
        color={isDay ? "#fff8e7" : "#bcd7ff"}
        castShadow
      />
      {/* Subtle moonlit fill light at night so objects and terrain remain clearly visible */}
      {!isDay && (
        <directionalLight
          position={[6, 8, 6]}
          intensity={0.4}
          color="#8ea9cc"
        />
      )}
    </>
  );
}
