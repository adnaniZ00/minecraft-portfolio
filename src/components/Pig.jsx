import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { WORLD_OBJECTS } from "../constants/worldObjects";

export function Pig({ initialPosition = [36, 6, -45] }) {
  const groupRef = useRef();
  const { scene, animations } = useGLTF("/pig/scene.gltf");
  const { actions } = useAnimations(animations, groupRef);

  // AI State: "idle" | "walking"
  const aiState = useRef({
    state: "idle",
    timer: 2.5, // Time remaining in current state (seconds)
    targetAngle: 0,
    speed: 2.2, // Walking speed in units/second
  });

  // Start with idle animation upon mounting
  useEffect(() => {
    if (actions?.idle) {
      actions.idle.reset().fadeIn(0.2).play();
    }
    return () => {
      actions?.idle?.stop();
      actions?.walk?.stop();
    };
  }, [actions]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Cap delta to prevent large physics jumps during lag/frame drops
    const dt = Math.min(delta, 0.1);
    const pig = groupRef.current;
    const ai = aiState.current;

    ai.timer -= dt;

    if (ai.state === "idle") {
      // Transition from IDLE to WALKING
      if (ai.timer <= 0) {
        ai.state = "walking";
        // Walk for 2.5 to 5.0 seconds
        ai.timer = 2.5 + Math.random() * 2.5;

        // Choose a random direction (angle in radians)
        ai.targetAngle = Math.random() * Math.PI * 2;

        // Switch to walk animation
        actions?.idle?.fadeOut(0.2);
        actions?.walk?.reset().fadeIn(0.2).play();
      }
    } else if (ai.state === "walking") {
      // 1. Smoothly rotate toward target walking angle
      let angleDiff = ai.targetAngle - pig.rotation.y;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      pig.rotation.y += angleDiff * Math.min(1, 6 * dt);

      // 2. Compute potential step in the facing direction
      // Since model faces -Z at rotation 0:
      // dx = sin(rotation + PI) = -sin(rotation)
      // dz = cos(rotation + PI) = -cos(rotation)
      const moveDist = ai.speed * dt;
      const dx = -Math.sin(pig.rotation.y) * moveDist;
      const dz = -Math.cos(pig.rotation.y) * moveDist;

      const nextX = pig.position.x + dx;
      const nextZ = pig.position.z + dz;

      // 3. Collision and ground check with WORLD_OBJECTS
      let targetGround = 6;
      for (const obj of WORLD_OBJECTS) {
        if (nextX >= obj.minX && nextX <= obj.maxX && nextZ >= obj.minZ && nextZ <= obj.maxZ) {
          if (obj.groundHeight > targetGround) {
            targetGround = obj.groundHeight;
          }
        }
      }

      // Check if obstacle/barrier is in front (too steep or impassable edge/lava/water)
      const isBlocked = targetGround > pig.position.y + 0.5 || targetGround >= 100;

      if (isBlocked) {
        // Hit a boundary, hill, water, or lava: Stop and return to idle
        ai.state = "idle";
        ai.timer = 1.5 + Math.random() * 2.0; // Idle pause before picking another direction
        actions?.walk?.fadeOut(0.2);
        actions?.idle?.reset().fadeIn(0.2).play();
      } else {
        // Safe to advance
        pig.position.x = nextX;
        pig.position.z = nextZ;

        // Check ground directly underneath to snap smoothly to terrain height
        let currentGround = 6;
        for (const obj of WORLD_OBJECTS) {
          if (
            pig.position.x >= obj.minX &&
            pig.position.x <= obj.maxX &&
            pig.position.z >= obj.minZ &&
            pig.position.z <= obj.maxZ
          ) {
            if (obj.groundHeight > currentGround && obj.groundHeight < 100) {
              currentGround = obj.groundHeight;
            }
          }
        }
        // Smoothly adjust height to the terrain
        pig.position.y += (currentGround - pig.position.y) * Math.min(1, 10 * dt);
      }

      // Transition from WALKING to IDLE when walk timer finishes
      if (ai.timer <= 0 && ai.state === "walking") {
        ai.state = "idle";
        ai.timer = 2.0 + Math.random() * 3.0; // Idle for 2 to 5 seconds
        actions?.walk?.fadeOut(0.2);
        actions?.idle?.reset().fadeIn(0.2).play();
      }
    }
  });

  return (
    <primitive
      ref={groupRef}
      object={scene}
      scale={4}
      position={initialPosition}
      rotation={[0, 0, 0]}
    />
  );
}
