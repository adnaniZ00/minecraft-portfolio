import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useKeyboard } from "../hooks/useKeyboard";
import { WORLD_OBJECTS } from "../constants/worldObjects";

export function Steve({ orbitRef, steveRef }) {
  const { scene, animations } = useGLTF("/steve/scene.gltf");
  const { actions } = useAnimations(animations, scene);
  const internalRef = useRef();
  const ref = steveRef || internalRef;
  const keys = useKeyboard();
  const speed = 0.8;
  const isJumping = useRef(false);
  const velocityY = useRef(0);

  // Configure one-shot jump animation clamps once upon mount
  useEffect(() => {
    const jumpAction = actions?.["Armature|Jump"];
    if (jumpAction) {
      jumpAction.setLoop(THREE.LoopOnce, 1);
      // eslint-disable-next-line react-hooks/immutability
      jumpAction.clampWhenFinished = true;
    }
  }, [actions]);

  useFrame((state) => {
    if (!ref.current) return;

    let isMoving = false;
    let dx = 0;
    let dz = 0;

    // Check which keys are held down
    if (keys.current.w) {
      dz -= speed;
      isMoving = true;
    }
    if (keys.current.s) {
      dz += speed;
      isMoving = true;
    }
    if (keys.current.a) {
      dx -= speed;
      isMoving = true;
    }
    if (keys.current.d) {
      dx += speed;
      isMoving = true;
    }

    // --- 1. COLLISION PREDICTION ---
    // Calculate where Steve is trying to walk
    const nextX = ref.current.position.x + dx;
    const nextZ = ref.current.position.z + dz;

    // Find the height of the ground at that exact spot
    let targetGround = 6; // Default grass level
    for (const obj of WORLD_OBJECTS) {
      if (nextX >= obj.minX && nextX <= obj.maxX && nextZ >= obj.minZ && nextZ <= obj.maxZ) {
        if (obj.groundHeight > targetGround) {
          targetGround = obj.groundHeight;
        }
      }
    }

    // If the ground in front of him is taller than his knees, he hits a wall!
    if (targetGround > ref.current.position.y + 0.5) {
      dx = 0;
      dz = 0;
      isMoving = false;
    }

    // --- 2. JUMP LOGIC ---
    if (keys.current[" "] && !isJumping.current) {
      isJumping.current = true;
      velocityY.current = 0.35; // Jump Power!
      actions["Armature|Idle"]?.stop();
      actions["Armature|Walk"]?.stop();
      actions["Armature|Jump"]?.reset().setLoop(THREE.LoopOnce, 1).play();
    }

    // --- 3. MOVEMENT & ANIMATION ---
    if (isMoving) {
      ref.current.position.x += dx;
      ref.current.position.z += dz;
      ref.current.rotation.y = Math.atan2(dx, dz);

      if (!isJumping.current && actions["Armature|Walk"] && !actions["Armature|Walk"].isRunning()) {
        actions["Armature|Idle"]?.stop();
        actions["Armature|Jump"]?.stop();
        actions["Armature|Walk"].play();
      }
    } else {
      if (!isJumping.current && actions["Armature|Idle"] && !actions["Armature|Idle"].isRunning()) {
        actions["Armature|Walk"]?.stop();
        actions["Armature|Jump"]?.stop();
        actions["Armature|Idle"].play();
      }
    }

    // --- 4. DYNAMIC GRAVITY ---
    let currentGround = 6;
    for (const obj of WORLD_OBJECTS) {
      if (
        ref.current.position.x >= obj.minX &&
        ref.current.position.x <= obj.maxX &&
        ref.current.position.z >= obj.minZ &&
        ref.current.position.z <= obj.maxZ
      ) {
        if (obj.groundHeight > currentGround) {
          currentGround = obj.groundHeight;
        }
      }
    }

    // Apply gravity if he is jumping, or if he walked off a ledge!
    if (isJumping.current || ref.current.position.y > currentGround) {
      velocityY.current -= 0.02;
      ref.current.position.y += velocityY.current;

      // When feet hit the ground
      if (ref.current.position.y <= currentGround) {
        ref.current.position.y = currentGround; // Snap to top of the block
        isJumping.current = false;
        velocityY.current = 0;
      }
    }

    // --- 5. CAMERA FOLLOW ---
    if (orbitRef?.current) {
      orbitRef.current.target.copy(ref.current.position);
      state.camera.position.x += dx;
      state.camera.position.z += dz;
    }

    const tracker = document.getElementById("coord-tracker");
    if (tracker) {
      tracker.innerText = `X: ${ref.current.position.x.toFixed(1)} | Y: ${ref.current.position.y.toFixed(1)} | Z: ${ref.current.position.z.toFixed(1)}`;
    }
  });

  return <primitive ref={ref} object={scene} scale={2.5} position={[0, 6, 0]} />;
}
