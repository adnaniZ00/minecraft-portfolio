import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * WorldBorderWalls
 * 3D dark walls along the 4 outer perimeter boundaries.
 * North: Z = -187
 * South: Z = 60
 * West:  X = -179
 * East:  X = 104
 *
 * Each wall is completely opaque (#000000) with depthWrite=true,
 * and renders with renderOrder=999 to guarantee that everything
 * behind it is occluded without any see-through artifacts.
 */
export function WorldBorderWalls({ steveRef }) {
  const wallHeight = 400;
  const centerY = wallHeight / 2 - 50;

  // 4 Outer World Boundaries:
  const minX = -179;
  const maxX = 104;
  const minZ = -187;
  const maxZ = 60;

  // Extend outward to cover the entire landscape beyond the perimeter
  const OUTER_DEPTH = 1000;

  const widthX = maxX - minX;   // 283
  const depthZ = maxZ - minZ;   // 247
  const centerX = (minX + maxX) / 2; // -37.5
  const centerZ = (minZ + maxZ) / 2; // -63.5

  // Meshes for each of the 4 perimeter walls
  const northMeshRef = useRef();
  const southMeshRef = useRef();
  const westMeshRef = useRef();
  const eastMeshRef = useRef();

  // Materials for each of the 4 perimeter walls
  const northMatRef = useRef();
  const southMatRef = useRef();
  const westMatRef = useRef();
  const eastMatRef = useRef();

  // Distance at which the wall begins to fade in
  const FADE_DISTANCE = 35;

  useFrame(() => {
    if (!steveRef?.current) return;
    const px = steveRef.current.position.x;
    const pz = steveRef.current.position.z;

    // Helper to calculate opacity based on distance to a boundary plane
    const computeOpacity = (dist) => {
      if (dist <= 0) return 1;
      if (dist >= FADE_DISTANCE) return 0;
      const progress = 1 - (dist / FADE_DISTANCE);
      return Math.min(1, Math.max(0, progress * progress));
    };

    // Calculate distance from Steve to each boundary line
    const distNorth = pz - minZ; // Steve is at pz >= -187
    const distSouth = maxZ - pz; // Steve is at pz <= 60
    const distWest = px - minX;  // Steve is at px >= -179
    const distEast = maxX - px;  // Steve is at px <= 104

    const opNorth = computeOpacity(distNorth);
    const opSouth = computeOpacity(distSouth);
    const opWest = computeOpacity(distWest);
    const opEast = computeOpacity(distEast);

    if (northMatRef.current && northMeshRef.current) {
      northMeshRef.current.visible = opNorth > 0.001;
      northMatRef.current.opacity = opNorth;
      northMatRef.current.depthWrite = true;
      northMatRef.current.transparent = opNorth < 0.999;
    }

    if (southMatRef.current && southMeshRef.current) {
      southMeshRef.current.visible = opSouth > 0.001;
      southMatRef.current.opacity = opSouth;
      southMatRef.current.depthWrite = true;
      southMatRef.current.transparent = opSouth < 0.999;
    }

    if (westMatRef.current && westMeshRef.current) {
      westMeshRef.current.visible = opWest > 0.001;
      westMatRef.current.opacity = opWest;
      westMatRef.current.depthWrite = true;
      westMatRef.current.transparent = opWest < 0.999;
    }

    if (eastMatRef.current && eastMeshRef.current) {
      eastMeshRef.current.visible = opEast > 0.001;
      eastMatRef.current.opacity = opEast;
      eastMatRef.current.depthWrite = true;
      eastMatRef.current.transparent = opEast < 0.999;
    }
  });

  return (
    <group name="world-borders" renderOrder={999}>
      {/* North Wall: extends outward toward -Z */}
      <mesh ref={northMeshRef} position={[centerX, centerY, minZ - OUTER_DEPTH / 2]} visible={false} renderOrder={999}>
        <boxGeometry args={[widthX + OUTER_DEPTH * 2, wallHeight, OUTER_DEPTH]} />
        <meshBasicMaterial
          ref={northMatRef}
          color="#000000"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={true}
        />
      </mesh>

      {/* South Wall: extends outward toward +Z */}
      <mesh ref={southMeshRef} position={[centerX, centerY, maxZ + OUTER_DEPTH / 2]} visible={false} renderOrder={999}>
        <boxGeometry args={[widthX + OUTER_DEPTH * 2, wallHeight, OUTER_DEPTH]} />
        <meshBasicMaterial
          ref={southMatRef}
          color="#000000"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={true}
        />
      </mesh>

      {/* West Wall: extends outward toward -X */}
      <mesh ref={westMeshRef} position={[minX - OUTER_DEPTH / 2, centerY, centerZ]} visible={false} renderOrder={999}>
        <boxGeometry args={[OUTER_DEPTH, wallHeight, depthZ + OUTER_DEPTH * 2]} />
        <meshBasicMaterial
          ref={westMatRef}
          color="#000000"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={true}
        />
      </mesh>

      {/* East Wall: extends outward toward +X */}
      <mesh ref={eastMeshRef} position={[maxX + OUTER_DEPTH / 2, centerY, centerZ]} visible={false} renderOrder={999}>
        <boxGeometry args={[OUTER_DEPTH, wallHeight, depthZ + OUTER_DEPTH * 2]} />
        <meshBasicMaterial
          ref={eastMatRef}
          color="#000000"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={true}
        />
      </mesh>
    </group>
  );
}
