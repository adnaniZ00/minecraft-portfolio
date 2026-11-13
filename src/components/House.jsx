import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

export function House() {
  const { scene } = useGLTF("/house/scene.gltf");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.raycast = () => {};
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={45} position={[-65, 6, -215]} rotation={[0, 3.14, 0]} />;
}

useGLTF.preload("/house/scene.gltf");
