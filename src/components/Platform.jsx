import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

export function Platform() {
  const { scene } = useGLTF("/platform/scene.gltf");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        // Fix transparency sorting:
        // Minecraft flora/leaves use cutout alpha (alphaTest), not blending.
        // alphaMode: "BLEND" in gltf causes Three.js to sort them after opaque objects,
        // which was causing them to draw on top of the world border walls!
        if (child.material.transparent) {
          child.material.alphaTest = 0.5;
          child.material.transparent = false;
          child.material.depthWrite = true;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={3} position={[0, 0, 0]} rotation={[0, 3.14, 0]} />;
}
