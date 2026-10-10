import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { ZOMBIE_TRIGGER_ZONES } from "../constants/zombieZones";

export function Zombie({ steveRef }) {
  const { scene, animations } = useGLTF("/zombie/scene.gltf");
  const { actions } = useAnimations(animations, scene);
  const zombieRef = useRef();
  const animState = useRef("idle");

  useFrame(() => {
    if (!steveRef?.current || !zombieRef.current) return;

    const stevePos = steveRef.current.position;
    let isNear = false;

    // Check if Steve is in any trigger zone (expanded by +3 coordinates on all sides)
    for (const zone of ZOMBIE_TRIGGER_ZONES) {
      if (
        stevePos.x >= zone.minX - 3 &&
        stevePos.x <= zone.maxX + 3 &&
        stevePos.z >= zone.minZ - 3 &&
        stevePos.z <= zone.maxZ + 3
      ) {
        isNear = true;
        break;
      }
    }

    const animName = "animation.juhih.attack_bare_hand";

    if (isNear) {
      // Calculate angle to Steve
      const dx = stevePos.x - zombieRef.current.position.x;
      const dz = stevePos.z - zombieRef.current.position.z;

      // Smoothly rotate towards Steve
      const targetRotation = Math.atan2(dx, dz) + Math.PI;
      zombieRef.current.rotation.y = THREE.MathUtils.lerp(
        zombieRef.current.rotation.y,
        targetRotation,
        0.1
      );

      // Play the requested animation smoothly
      if (animState.current !== "playing") {
        animState.current = "playing";
        if (actions[animName]) {
          actions[animName].reset().fadeIn(0.5).play();
        }
      }
    } else {
      // Smoothly return to default rotation
      zombieRef.current.rotation.y = THREE.MathUtils.lerp(
        zombieRef.current.rotation.y,
        0,
        0.05
      );

      // Stop animation smoothly when Steve is away
      if (animState.current !== "idle") {
        animState.current = "idle";
        if (actions[animName]) {
          actions[animName].fadeOut(0.5);
        }
      }
    }
  });

  return (
    <primitive
      ref={zombieRef}
      object={scene}
      scale={2}
      position={[-37, 3, 24]}
      rotation={[0, 0, 0]}
    />
  );
}
