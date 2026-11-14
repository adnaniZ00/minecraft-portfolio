import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useKeyboard } from "../hooks/useKeyboard";
import { WORLD_OBJECTS } from "../constants/worldObjects";
import { playStepSound, playJumpSound } from "../utils/sound";

function getGroundHeight(x, z) {
  let ground = 6;
  const len = WORLD_OBJECTS.length;
  for (let i = 0; i < len; i++) {
    const obj = WORLD_OBJECTS[i];
    if (x >= obj.minX && x <= obj.maxX && z >= obj.minZ && z <= obj.maxZ) {
      if (obj.groundHeight > ground) {
        ground = obj.groundHeight;
      }
    }
  }
  return ground;
}

export function Steve({
  orbitRef,
  steveRef,
  joystickInput,
  isMobileJumping,
  isModalOpen,
  onNearLandmarkChange,
  onInteractLandmark,
}) {
  const { scene, animations } = useGLTF("/steve/scene.gltf");
  const { actions } = useAnimations(animations, scene);
  const internalRef = useRef();
  const ref = steveRef || internalRef;
  const keys = useKeyboard();
  const speed = 0.7;       // Desktop / PC keyboard speed
  const mobileSpeed = 0.7; // Mobile touch joystick speed (adjust this number manually anytime)
  const isJumping = useRef(false);
  const velocityY = useRef(0);

  // Footstep sound timing tracker
  const stepTimer = useRef(0);
  const wasInAir = useRef(false);

  // Track camera offset smoothly to prevent stretching/lagging when walking
  const currentOffset = useRef(new THREE.Vector3(10, 40, 70));
  // Locked control orientation: only updates when the user stops holding movement inputs
  const isControlFlippedRef = useRef(false);
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
    // Frame-rate normalization factor (1.0 at 60 FPS) to prevent 90Hz/120Hz mobile devices from running at 2x speed
    const timeScale = dt * 60;

    let isMoving = false;
    let dx = 0;
    let dz = 0;

    // Check if the user is currently holding any movement keys or joystick
    const hasMovementInput = Boolean(
      keys.current.w ||
      keys.current.s ||
      keys.current.a ||
      keys.current.d ||
      keys.current.arrowup ||
      keys.current.arrowdown ||
      keys.current.arrowleft ||
      keys.current.arrowright ||
      (joystickInput?.current && Math.hypot(joystickInput.current.x, joystickInput.current.y) > 0.05)
    );

    // Only update the control orientation when the user STOPS holding movement keys/inputs
    // This guarantees controls never abruptly reverse mid-stride while actively holding a direction
    if (!hasMovementInput) {
      isControlFlippedRef.current = currentOffset.current.z < 0;
    }

    // Dynamic camera-relative direction signs (locked during active movement):
    // When camera is facing North (default, currentOffset.z >= 0):
    //   Forward (W / Joystick Up) moves toward North (-Z)
    //   Right (D / Joystick Right) moves toward East (+X)
    // When camera changes to face South near the South boundary (currentOffset.z < 0):
    //   Forward (W / Joystick Up) moves toward South (+Z)
    //   Right (D / Joystick Right) moves toward West (-X)
    const isCameraSouth = isControlFlippedRef.current;
    const forwardSign = isCameraSouth ? 1 : -1;
    const rightSign = isCameraSouth ? -1 : 1;

    // Check which keys are held down (WASD or Arrow Keys)
    if (keys.current.w || keys.current.arrowup) {
      dz += forwardSign * speed;
      isMoving = true;
    }
    if (keys.current.s || keys.current.arrowdown) {
      dz -= forwardSign * speed;
      isMoving = true;
    }
    if (keys.current.a || keys.current.arrowleft) {
      dx -= rightSign * speed;
      isMoving = true;
    }
    if (keys.current.d || keys.current.arrowright) {
      dx += rightSign * speed;
      isMoving = true;
    }

    // Touch Joystick Vector Input (Mobile / Tablet)
    // Decreased speed elevation for touch wheel so mobile navigation is steady, smooth, and easily controllable
    if (joystickInput?.current) {
      const jx = joystickInput.current.x;
      const jy = joystickInput.current.y;
      const mag = Math.hypot(jx, jy);
      if (mag > 0.05) {
        const clampedMag = Math.min(1, mag);
        // Uses the dedicated mobileSpeed setting directly (scaled by touch tilt distance)
        const mobileSpeedFactor = mobileSpeed * clampedMag;
        // Map joystick axes to camera-relative movement (Up = Forward, Right = Right)
        dx += rightSign * (jx / mag) * mobileSpeedFactor;
        dz += -forwardSign * (jy / mag) * mobileSpeedFactor;
        isMoving = true;
      }
    }

    // Apply frame-rate normalization to movement steps
    dx *= timeScale;
    dz *= timeScale;

    // --- 1. COLLISION PREDICTION ---
    // Calculate where Steve is trying to walk
    const nextX = ref.current.position.x + dx;
    const nextZ = ref.current.position.z + dz;

    // Find the height of the ground at that exact spot
    const targetGround = getGroundHeight(nextX, nextZ);

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
    const currentGround = getGroundHeight(ref.current.position.x, ref.current.position.z);

    // Apply gravity if he is jumping, or if he walked off a ledge!
    if (isJumping.current || ref.current.position.y > currentGround) {
      wasInAir.current = true;
      velocityY.current -= 0.02 * timeScale;
      ref.current.position.y += velocityY.current * timeScale;

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
    const isModalActive = Boolean(
      isModalOpen ||
      (typeof document !== "undefined" && document.querySelector(".mc-modal-backdrop, .mc-welcome-backdrop"))
    );

    if (keys.current.e) {
      if (!eKeyWasPressed.current) {
        eKeyWasPressed.current = true;
        // Only trigger interaction and sound if a modal is not already open
        if (!isModalActive && nearest && onInteractLandmark) {
          onInteractLandmark(nearest);
        }
      }
    } else {
      eKeyWasPressed.current = false;
    }

    // const tracker = document.getElementById("coord-tracker");
    // if (tracker) {
    //   tracker.innerText = `X: ${ref.current.position.x.toFixed(1)} | Y: ${ref.current.position.y.toFixed(1)} | Z: ${ref.current.position.z.toFixed(1)}`;
    // }
  });

  return <primitive ref={ref} object={scene} scale={2.5} position={[0, 6, 0]} />;
}

useGLTF.preload("/steve/scene.gltf");
