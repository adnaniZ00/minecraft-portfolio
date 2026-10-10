import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import "./App.css";

// 3D Scene Components
import { CameraController } from "./components/CameraController";
import { Lights } from "./components/Lights";
import { Platform } from "./components/Platform";
import { House } from "./components/House";
import { Steve } from "./components/Steve";
import { Pig } from "./components/Pig";
import { Zombie } from "./components/Zombie";
import { Skeleton } from "./components/Skeleton";
import { InteractiveModel } from "./components/InteractiveModel";

// UI Overlay Components
import { Overlay } from "./components/Overlay";
import { PortfolioModal } from "./components/PortfolioModal";

export default function App() {
  const orbitRef = useRef();
  const steveRef = useRef();

  const [activeSection, setActiveSection] = useState(null);
  const [cameraTarget, setCameraTarget] = useState(null);
  const [isDay, setIsDay] = useState(true);

  const handleOpenSection = (section, targetCoords) => {
    setActiveSection(section);
    setCameraTarget(targetCoords);
  };

  const handleCloseSection = () => {
    setActiveSection(null);
  };

  return (
    <>
      <PortfolioModal
        activeSection={activeSection}
        onClose={handleCloseSection}
      />

      <Overlay
        isDay={isDay}
        onToggleTime={() => setIsDay((prev) => !prev)}
      />

      <Canvas camera={{ position: [50, 50, 50], fov: 50 }}>
        {/* Dynamic sky and fog reflecting day/night */}
        <color attach="background" args={[isDay ? "#87ceeb" : "#0d172e"]} />
        <fog
          attach="fog"
          args={[isDay ? "#87ceeb" : "#0d172e", isDay ? 80 : 120, isDay ? 400 : 500]}
        />

        {/* Twinkling starry night sky */}
        {!isDay && (
          <Stars
            radius={160}
            depth={60}
            count={4500}
            factor={5}
            saturation={0}
            fade
            speed={1.5}
          />
        )}

        <Lights isDay={isDay} />
        <OrbitControls ref={orbitRef} target={[0, 0, 0]} />
        <CameraController targetPosition={cameraTarget} />

        {/* Interactive Landmarks */}
        <InteractiveModel
          path="/enchanting_table/scene.gltf"
          position={[12, 6, -112]}
          scale={0.02}
          rotation={[0, 4.7, 0]}
          labelHeight={6.4}
          label="About"
          hitboxSize={[7, 9, 7]}
          onClick={() => handleOpenSection("about", [30, 6, -112])}
        />

        <InteractiveModel
          path="/chest/scene.gltf"
          position={[-72, 7.8, -116]}
          scale={0.02}
          rotation={[0, 4.8, 0]}
          labelHeight={3}
          label="Projects"
          hitboxSize={[5, 5, 5]}
          onClick={() => handleOpenSection("projects", [-61, 7.8, -23])}
        />

        <InteractiveModel
          path="/portal/scene.gltf"
          position={[-72, 6, -64]}
          scale={2}
          rotation={[0, 1.6, 0]}
          labelHeight={15}
          label="Contact"
          labelRotation={[0, 1.6, 0]}
          hitboxSize={[12, 18, 8]}
          onClick={() => handleOpenSection("contact", [-88, 6, -64])}
        />

        {/* Mobs & Environment */}
        <Pig />
        <Zombie steveRef={steveRef} />
        <Skeleton steveRef={steveRef} position={[48, 6, 12]} />
        <Platform />
        <Steve orbitRef={orbitRef} steveRef={steveRef} />
        <House />
      </Canvas>
    </>
  );
}
