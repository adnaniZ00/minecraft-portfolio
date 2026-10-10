import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { gsap } from "gsap";

export function CameraController({ targetPosition }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!targetPosition) return;

    gsap.to(camera.position, {
      x: targetPosition[0],
      y: targetPosition[1] + 5,
      z: targetPosition[2] + 15,
      duration: 1,
      ease: "power2.out",
    });

    gsap.to(camera, {
      duration: 1,
      onUpdate: () => {
        camera.lookAt(...targetPosition);
      },
    });
  }, [targetPosition, camera]);

  return null;
}
