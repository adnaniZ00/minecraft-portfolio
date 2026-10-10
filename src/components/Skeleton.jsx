import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

export function Skeleton({
  steveRef,
  position = [48, 6, 12],
  detectionRadius = 26,
}) {
  const { scene, animations } = useGLTF("/skeleton/scene.gltf");
  const { actions } = useAnimations(animations, scene);
  const skeletonRef = useRef();
  const combatState = useRef("idle"); // "idle" | "aiming" | "firing"
  const fireTimer = useRef(0);

  // Initialize animations once upon mount
  useEffect(() => {
    if (actions?.aim) {
      actions.aim.setLoop(THREE.LoopOnce, 1);
      // eslint-disable-next-line react-hooks/immutability
      actions.aim.clampWhenFinished = true;
    }
    if (actions?.fire) {
      actions.fire.setLoop(THREE.LoopOnce, 1);
    }
    if (actions?.idle) {
      actions.idle.reset().fadeIn(0.3).play();
    }

    return () => {
      Object.values(actions || {}).forEach((action) => action?.stop());
    };
  }, [actions]);

  useFrame((_, delta) => {
    if (!skeletonRef.current) return;
    const dt = Math.min(delta, 0.1);

    if (steveRef?.current) {
      const stevePos = steveRef.current.position;
      const skelPos = skeletonRef.current.position;

      const dx = stevePos.x - skelPos.x;
      const dz = stevePos.z - skelPos.z;
      const dist = Math.hypot(dx, dz);

      if (dist <= detectionRadius) {
        // --- 1. TRACK & AIM AT STEVE ---
        const targetRotation = Math.atan2(dx, dz);

        // Smoothly rotate toward Steve using shortest angular path
        let angleDiff = targetRotation - skeletonRef.current.rotation.y;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        skeletonRef.current.rotation.y += angleDiff * 0.1;

        fireTimer.current -= dt;

        // Enter AIM state
        if (combatState.current === "idle") {
          combatState.current = "aiming";
          fireTimer.current = 2.0; // Draw and aim bow before firing
          actions?.idle?.fadeOut(0.3);
          actions?.aim?.reset().fadeIn(0.2).play();
        } else if (combatState.current === "aiming" && fireTimer.current <= 0) {
          // Trigger bow release animation
          combatState.current = "firing";
          actions?.aim?.stop();
          actions?.fire?.reset().play();

          // Reset back to aim after releasing arrow
          fireTimer.current = 2.2;
          setTimeout(() => {
            if (combatState.current === "firing") {
              combatState.current = "aiming";
              actions?.aim?.reset().fadeIn(0.15).play();
            }
          }, 350);
        }
      } else {
        // --- 2. OUT OF RANGE: RETURN TO IDLE ---
        if (combatState.current !== "idle") {
          combatState.current = "idle";
          actions?.aim?.fadeOut(0.3);
          actions?.fire?.stop();
          actions?.idle?.reset().fadeIn(0.4).play();
        }

        // Return smoothly to rest orientation
        skeletonRef.current.rotation.y = THREE.MathUtils.lerp(
          skeletonRef.current.rotation.y,
          0,
          0.03
        );
      }
    }
  });

  return (
    <primitive
      ref={skeletonRef}
      object={scene}
      scale={2.2}
      position={position}
      rotation={[0, 0, 0]}
    />
  );
}
