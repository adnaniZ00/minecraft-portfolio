import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useKeyboard } from "../hooks/useKeyboard";
import { WORLD_OBJECTS } from "../constants/worldObjects";
import { playStepSound, playJumpSound } from "../utils/sound";

export function Steve({ orbitRef, steveRef, joystickInput, isMobileJumping, onNearLandmarkChange, onInteractLandmark }) {
  const { scene, animations } = useGLTF("/steve/scene.gltf");
  const { actions } = useAnimations(animations, scene);
  const internalRef = useRef();
  const ref = steveRef || internalRef;
  const keys = useKeyboard();
  const speed = 1.2;
  const isJumping = useRef(false);
  const velocityY = useRef(0);

  // Footstep sound timing tracker
  const stepTimer = useRef(0);
  const wasInAir = useRef(false);

  // Track camera offset smoothly to prevent stretching/lagging when walking
  const currentOffset = useRef(new THREE.Vector3(10, 40, 70));
  // E-key debouncing to prevent multi-triggering per single press
  const eKeyWasPressed = useRef(false);
  const currentNearestRef = useRef(null);

  // Configure one-shot jump animation clamps once upon mount
  useEffect(() => {
    const jumpAction = actions?.["Armature|Jump"];
    if (jumpAction) {
      jumpAction.setLoop(THREE.LoopOnce, 1);
      // eslint-disable-next-line react-hooks/immutability
      jumpAction.clampWhenFinished = true;
    }
  }, [actions]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const dt = Math.min(delta, 0.1);

    let isMoving = false;
    let dx = 0;
    let dz = 0;

    // Check which keys are held down (WASD or Arrow Keys)
    if (keys.current.w || keys.current.arrowup) {
      dz -= speed;
      isMoving = true;
    }
    if (keys.current.s || keys.current.arrowdown) {
      dz += speed;
      isMoving = true;
    }
    if (keys.current.a || keys.current.arrowleft) {
      dx -= speed;
      isMoving = true;
    }
    if (keys.current.d || keys.current.arrowright) {
      dx += speed;
      isMoving = true;
    }

    // Touch Joystick Vector Input (Mobile / Tablet)
    if (joystickInput?.current && (Math.abs(joystickInput.current.x) > 0.05 || Math.abs(joystickInput.current.y) > 0.05)) {
      dx += joystickInput.current.x * speed;
      dz += joystickInput.current.y * speed;
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

    // --- 2. JUMP LOGIC (Space Bar or Mobile Jump Button) ---
    const jumpRequested = keys.current[" "] || isMobileJumping?.current;
    if (jumpRequested && !isJumping.current) {
      isJumping.current = true;
      wasInAir.current = true;
      velocityY.current = 0.35; // Jump Power!
      actions["Armature|Idle"]?.stop();
      actions["Armature|Walk"]?.stop();
      actions["Armature|Jump"]?.reset().setLoop(THREE.LoopOnce, 1).play();

      // Play jump footstep sound
      playJumpSound(0.45);
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

      // Play rhythmic walking sound while on the ground
      if (!isJumping.current) {
        stepTimer.current += dt;
        // Interval between footsteps (~0.35s is typical for Minecraft walk cycle)
        if (stepTimer.current >= 0.35) {
          playStepSound(0.35);
          stepTimer.current = 0;
        }
      } else {
        stepTimer.current = 0.2; // Ready to step shortly after landing
      }
    } else {
      stepTimer.current = 0.25; // Reset step timer so first step plays promptly
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
      wasInAir.current = true;
      velocityY.current -= 0.02;
      ref.current.position.y += velocityY.current;

      // When feet hit the ground
      if (ref.current.position.y <= currentGround) {
        ref.current.position.y = currentGround; // Snap to top of the block
        isJumping.current = false;
        velocityY.current = 0;

        // Play landing step sound
        if (wasInAir.current) {
          playJumpSound(0.4);
          wasInAir.current = false;
        }
      }
    }

    // --- 5. CAMERA FOLLOW WITH DYNAMIC BOUNDARY ANGLE ADJUSTMENT ---
    if (orbitRef?.current) {
      orbitRef.current.target.copy(ref.current.position);

      // Check proximity to borders:
      // X = 104 (East) and Z = 60 (South)
      const BORDER_X = 104;
      const BORDER_Z = 60;
      const BLEND_ZONE = 40;

      const distToX = Math.max(0, BORDER_X - ref.current.position.x);
      const factorX = distToX < BLEND_ZONE ? 1 - (distToX / BLEND_ZONE) : 0;

      const distToZ = Math.max(0, BORDER_Z - ref.current.position.z);
      const factorZ = distToZ < BLEND_ZONE ? 1 - (distToZ / BLEND_ZONE) : 0;

      // Target relative camera offset:
      // Default: [10, 40, 70]
      // Near X = 104 -> [-10, 40, 70]
      // Near Z = 60  -> [10, 40, -70]
      const targetOffsetX = THREE.MathUtils.lerp(10, -10, factorX);
      const targetOffsetY = 40;
      const targetOffsetZ = THREE.MathUtils.lerp(70, -70, factorZ);

      // Smoothly rotate the offset vector only (prevents stretching/lag during player movement)
      currentOffset.current.x = THREE.MathUtils.lerp(currentOffset.current.x, targetOffsetX, 0.05);
      currentOffset.current.y = THREE.MathUtils.lerp(currentOffset.current.y, targetOffsetY, 0.05);
      currentOffset.current.z = THREE.MathUtils.lerp(currentOffset.current.z, targetOffsetZ, 0.05);

      // Lock camera position synchronously with Steve's position using the smooth offset
      state.camera.position.x = ref.current.position.x + currentOffset.current.x;
      state.camera.position.y = ref.current.position.y + currentOffset.current.y;
      state.camera.position.z = ref.current.position.z + currentOffset.current.z;
    }

    // --- 6. PROXIMITY CHECK TO LANDMARKS (PORTAL, CHEST, ENCHANTING TABLE) ---
    const landmarks = [
      { id: "about", name: "Enchanting Table", x: 12, z: -112, targetCamera: [12, 6, -112], threshold: 14 },
      { id: "projects", name: "Chest", x: -72, z: -116, targetCamera: [-72, 7.8, -116], threshold: 12 },
      { id: "contact", name: "Nether Portal", x: -72, z: -64, targetCamera: [-72, 6, -64], threshold: 14 },
    ];

    let nearest = null;
    let minDist = Infinity;
    for (const lm of landmarks) {
      const d = Math.hypot(ref.current.position.x - lm.x, ref.current.position.z - lm.z);
      if (d <= lm.threshold && d < minDist) {
        minDist = d;
        nearest = lm;
      }
    }

    if (currentNearestRef.current?.id !== nearest?.id) {
      currentNearestRef.current = nearest;
      if (onNearLandmarkChange) {
        onNearLandmarkChange(nearest);
      }
    }

    // --- 7. PRESS "E" KEY TO INTERACT ---
    if (keys.current.e) {
      if (!eKeyWasPressed.current) {
        eKeyWasPressed.current = true;
        if (nearest && onInteractLandmark) {
          onInteractLandmark(nearest);
        }
      }
    } else {
      eKeyWasPressed.current = false;
    }

    const tracker = document.getElementById("coord-tracker");
    if (tracker) {
      tracker.innerText = `X: ${ref.current.position.x.toFixed(1)} | Y: ${ref.current.position.y.toFixed(1)} | Z: ${ref.current.position.z.toFixed(1)}`;
    }
  });

  return <primitive ref={ref} object={scene} scale={2.5} position={[0, 6, 0]} />;
}
