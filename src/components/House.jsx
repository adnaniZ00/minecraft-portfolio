import { useGLTF } from "@react-three/drei";

export function House() {
  const { scene } = useGLTF("/house/scene.gltf");
  return <primitive object={scene} scale={45} position={[-65, 6, -215]} rotation={[0, 3.14, 0]} />;
}
