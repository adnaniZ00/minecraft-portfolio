import { useRef, useEffect, useState } from "react";
import { useGLTF, Text, Billboard, useAnimations } from "@react-three/drei";
import { gsap } from "gsap";
import { playSound } from "../utils/sound";

export function InteractiveModel({
  path,
  position,
  scale = 0.5,
  rotation = [0, 0, 0],
  onClick,
  label,
  labelHeight = 3,
  labelOffSet = 0,
  labelRightSet = 0,
  hitboxSize = [5, 6, 5],
}) {
  const { scene, animations } = useGLTF(path);
  const { actions } = useAnimations(animations, scene);
  const modelRef = useRef();
  const labelRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerOver = (e) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
    setIsHovered(true);

    // 1. Spring scale-up animation on model
    if (modelRef.current) {
      gsap.to(modelRef.current.scale, {
        x: scale * 1.25,
        y: scale * 1.25,
        z: scale * 1.25,
        duration: 0.35,
        ease: "back.out(2)",
      });
    }

    // 2. Scale-up label with visual bounce
    if (labelRef.current) {
      gsap.to(labelRef.current.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: 0.25,
        ease: "back.out(1.7)",
      });
    }

    // 3. Play model built-in GLTF animation (e.g. enchanting book opening, chest opening)
    if (actions) {
      Object.values(actions).forEach((action) => {
        if (action) {
          action.reset().fadeIn(0.2).play();
        }
      });
    }

    // 4. Play ambient landmark sound on hover (portal plays only portal.ogg)
    if (path.includes("chest")) {
      playSound("chest", { volume: 0.45 });
    } else if (path.includes("enchanting_table")) {
      playSound("enchant", { volume: 0.45 });
    } else if (path.includes("portal")) {
      playSound("portal", { volume: 0.45 });
    }
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    document.body.style.cursor = "auto";
    setIsHovered(false);

    // 1. Return model back to original scale
    if (modelRef.current) {
      gsap.to(modelRef.current.scale, {
        x: scale,
        y: scale,
        z: scale,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    // 2. Return label back to original scale
    if (labelRef.current) {
      gsap.to(labelRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.25,
        ease: "power2.out",
      });
    }

    // 3. Fade out model built-in GLTF animation
    if (actions) {
      Object.values(actions).forEach((action) => {
        if (action) {
          action.fadeOut(0.3);
        }
      });
    }
  };

  const handleClick = (e) => {
    if (e?.stopPropagation) {
      e.stopPropagation();
    }

    // Do not trigger landmark interaction sounds if a modal is already open
    if (typeof document !== "undefined" && document.querySelector(".mc-modal-backdrop, .mc-welcome-backdrop")) {
      return;
    }

    // Trigger visual bounce on model tap
    if (modelRef.current) {
      gsap.to(modelRef.current.scale, {
        x: scale * 1.25,
        y: scale * 1.25,
        z: scale * 1.25,
        duration: 0.25,
        ease: "back.out(2)",
        yoyo: true,
        repeat: 1,
      });
    }

    // Play interaction sound on click
    if (path.includes("portal")) {
      playSound("portalTrigger", { volume: 0.5 });
      setTimeout(() => {
        playSound("portalTravel", { volume: 0.5 });
      }, 400);
    } else if (path.includes("chest")) {
      playSound("chest", { volume: 0.6 });
    } else if (path.includes("enchanting_table")) {
      playSound("enchant", { volume: 0.6 });
    } else {
      playSound("button", { volume: 0.5 });
    }

    if (onClick) {
      onClick(e);
    }
  };

  useEffect(() => {
    if (!modelRef.current) return;
    const floatAnim = gsap.to(modelRef.current.position, {
      y: "+=0.35",
      yoyo: true,
      repeat: -1,
      duration: 1.5,
      ease: "sine.inOut",
    });

    return () => {
      floatAnim.kill();
    };
  }, []);

  return (
    <group
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Generous invisible hitbox to guarantee tap & click detection even from distances and thin angles */}
      <mesh position={[0, (hitboxSize[1] || 4) / 2, 0]}>
        <boxGeometry args={hitboxSize} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <primitive
        ref={modelRef}
        object={scene}
        scale={scale}
        rotation={rotation}
      />

      {label && (
        <Billboard
          ref={labelRef}
          position={[labelOffSet, labelHeight, labelRightSet]}
          follow={true}
          lockX={false}
          lockY={false}
          lockZ={false}
        >
          {/* Minecraft Nametag dark plate container */}
          <mesh position={[0, 0, -0.05]}>
            <planeGeometry args={[Math.max(2.8, label.length * 0.42 + 0.8), 1.2]} />
            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={isHovered ? 0.85 : 0.65}
            />
          </mesh>

          {/* Minecraft Nametag Border */}
          <mesh position={[0, 0, -0.04]}>
            <planeGeometry args={[Math.max(2.9, label.length * 0.42 + 0.9), 1.3]} />
            <meshBasicMaterial
              color={isHovered ? "#ffd700" : "#444444"}
              transparent
              opacity={isHovered ? 0.95 : 0.45}
            />
          </mesh>

          <Text
            fontSize={0.85}
            color={isHovered ? "#ffff55" : "#ffffff"}
            outlineWidth={0.08}
            outlineColor="#000000"
            anchorX="center"
            anchorY="middle"
          >
            {label}
          </Text>
        </Billboard>
      )}

      {/* Special portal aura glow only when hovered to avoid shading 300k vertices when idle */}
      {path.includes("portal") && isHovered && (
        <pointLight
          color="#c084fc"
          intensity={5}
          distance={16}
          position={[0, 4, 0]}
        />
      )}

      {/* Special enchanting table magical glow only when hovered */}
      {path.includes("enchanting_table") && isHovered && (
        <pointLight
          color="#60a5fa"
          intensity={3.5}
          distance={10}
          position={[0, 2, 0]}
        />
      )}
    </group>
  );
}
