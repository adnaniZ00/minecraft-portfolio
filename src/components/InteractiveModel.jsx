import { useRef, useEffect, useState } from "react";
import { useGLTF, Text, useAnimations } from "@react-three/drei";
import { gsap } from "gsap";

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
  labelRotation = [0, 0, 0],
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
      onClick={onClick}
    >
      {/* Generous hitbox to guarantee hover & click even from distances and thin angles */}
      <mesh visible={false} position={[0, (hitboxSize[1] || 4) / 2, 0]}>
        <boxGeometry args={hitboxSize} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <primitive
        ref={modelRef}
        object={scene}
        scale={scale}
        rotation={rotation}
      />

      {label && (
        <group
          ref={labelRef}
          position={[labelOffSet, labelHeight, labelRightSet]}
          rotation={labelRotation}
        >
          <Text
            fontSize={0.65}
            color={isHovered ? "#ffd700" : "white"}
            outlineWidth={0.06}
            outlineColor="#000000"
          >
            {label}
          </Text>
        </group>
      )}

      {/* Special portal aura glow when hovered */}
      {path.includes("portal") && (
        <pointLight
          color="#c084fc"
          intensity={isHovered ? 6 : 1.5}
          distance={18}
          position={[0, 4, 0]}
        />
      )}

      {/* Special enchanting table magical glow when hovered */}
      {path.includes("enchanting_table") && (
        <pointLight
          color="#60a5fa"
          intensity={isHovered ? 4 : 1}
          distance={12}
          position={[0, 2, 0]}
        />
      )}
    </group>
  );
}
