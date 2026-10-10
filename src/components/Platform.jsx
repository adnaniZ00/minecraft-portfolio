import { useGLTF } from "@react-three/drei";

export function Platform() {
  const { scene } = useGLTF("/platform/scene.gltf");
  return <primitive object={scene} scale={3} position={[0, 0, 0]} rotation={[0, 3.14, 0]} />;
}
