import { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, AdaptiveDpr, AdaptiveEvents, useGLTF } from "@react-three/drei";
import "./App.css";

// 3D Scene Components
import { Lights } from "./components/Lights";
import { Platform } from "./components/Platform";
import { House } from "./components/House";
import { Steve } from "./components/Steve";
import { Pig } from "./components/Pig";
import { Zombie } from "./components/Zombie";
import { Skeleton } from "./components/Skeleton";
import { InteractiveModel } from "./components/InteractiveModel";
import { WorldBorderWalls } from "./components/WorldBorderWalls";

// UI Overlay Components
import { Overlay } from "./components/Overlay";
import { PortfolioModal } from "./components/PortfolioModal";
import { ControlsWelcomeModal } from "./components/ControlsWelcomeModal";
import { playSound } from "./utils/sound";

export default function App() {
  const orbitRef = useRef();
  const steveRef = useRef();
  const joystickInput = useRef({ x: 0, y: 0 });
  const isMobileJumping = useRef(false);

  const [activeSection, setActiveSection] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isDay, setIsDay] = useState(true);
  const [nearLandmark, setNearLandmark] = useState(null);

  // Ensure right-click context menu (Inspect / DevTools) is not blocked by Canvas or OrbitControls
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.stopImmediatePropagation();
    };
    window.addEventListener("contextmenu", handleContextMenu, true);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu, true);
    };
  }, []);

  const handleOpenSection = (section) => {
    setActiveSection(section);
  };

  const handleCloseSection = () => {
    setActiveSection(null);
  };

  // Triggered when user presses "E" near a landmark (or clicks the prompt banner)
  const handleInteractLandmark = (landmark) => {
    if (!landmark) return;

    // Specific audio requirements for each landmark
    if (landmark.id === "contact") {
      // Portal: trigger.ogg followed by travel.ogg
      playSound("portalTrigger", { volume: 0.5 });
      setTimeout(() => {
        playSound("portalTravel", { volume: 0.5 });
      }, 350);
    } else if (landmark.id === "projects") {
      playSound("chest", { volume: 0.6 });
    } else if (landmark.id === "about") {
      playSound("enchant", { volume: 0.6 });
    }

    handleOpenSection(landmark.id);
  };

  return (
    <>
      <ControlsWelcomeModal
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
      />

      <PortfolioModal
        activeSection={activeSection}
        onClose={handleCloseSection}
      />

      <Overlay
        isDay={isDay}
        onToggleTime={() => setIsDay((prev) => !prev)}
        onOpenCredits={() => handleOpenSection("credits")}
        nearLandmark={nearLandmark}
        onInteractLandmark={handleInteractLandmark}
        onJoystickMove={(vec) => {
          joystickInput.current = vec;
        }}
        onMobileJump={(jumping) => {
          isMobileJumping.current = jumping;
        }}
      />

      <Canvas
        camera={{ position: [10, 40, 70], fov: 50 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        gl={{
          powerPreference: "high-performance",
          antialias: true,
          stencil: false,
          depth: true,
        }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

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
            count={1200}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
        )}

        <Lights isDay={isDay} />
        <OrbitControls
          ref={orbitRef}
          target={[0, 0, 0]}
          enablePan={false}
          mouseButtons={{
            LEFT: 0,
            MIDDLE: 1,
          }}
        />

        {/* Interactive Landmarks */}
        <InteractiveModel
          path="/enchanting_table/scene.gltf"
          position={[12, 6, -112]}
          scale={0.02}
          rotation={[0, 4.7, 0]}
          labelHeight={8}
          label="About Me"
          hitboxSize={[7, 9, 7]}
          onClick={() => handleOpenSection("about")}
        />

        <InteractiveModel
          path="/chest/scene.gltf"
          position={[-72, 7.8, -116]}
          scale={0.02}
          rotation={[0, 4.8, 0]}
          labelHeight={6}
          label="Projects"
          hitboxSize={[5, 5, 5]}
          onClick={() => handleOpenSection("projects")}
        />

        <InteractiveModel
          path="/portal/scene.gltf"
          position={[-72, 6, -64]}
          scale={2}
          rotation={[0, 1.6, 0]}
          labelHeight={16.5}
          label="Contact"
          hitboxSize={[12, 18, 8]}
          onClick={() => handleOpenSection("contact")}
        />

        {/* Mobs & Environment */}
        <Pig />
        <Zombie steveRef={steveRef} />
        {!isDay && <Skeleton steveRef={steveRef} position={[48, 6, 12]} />}
        <Platform />
        <WorldBorderWalls steveRef={steveRef} />
        <Steve
          orbitRef={orbitRef}
          steveRef={steveRef}
          joystickInput={joystickInput}
          isMobileJumping={isMobileJumping}
          onNearLandmarkChange={setNearLandmark}
          onInteractLandmark={handleInteractLandmark}
        />
        <House />
      </Canvas>
    </>
  );
}

// Preload interactive landmarks and mobs for instantaneous rendering
useGLTF.preload("/enchanting_table/scene.gltf");
useGLTF.preload("/chest/scene.gltf");
useGLTF.preload("/portal/scene.gltf");
useGLTF.preload("/pig/scene.gltf");
useGLTF.preload("/zombie/scene.gltf");
