import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

// Camera shake effect — triggered by external events (lightning, etc.)
// Uses damped spring physics for realistic motion decay
export default function ScreenShake({ shakeRef }) {
  const { camera } = useThree();
  const originalPos = useRef({ x: 0, y: 0, z: 0 });
  const initialized = useRef(false);

  useFrame((_, delta) => {
    if (!initialized.current) {
      originalPos.current = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
      initialized.current = true;
    }

    if (!shakeRef?.current) return;
    const clampedDelta = Math.min(delta, 0.05);

    if (shakeRef.current.intensity > 0.001) {
      const intensity = shakeRef.current.intensity;

      // Random displacement scaled by intensity
      camera.position.x = originalPos.current.x + (Math.random() - 0.5) * intensity * 0.5;
      camera.position.y = originalPos.current.y + (Math.random() - 0.5) * intensity * 0.3;

      // Exponential decay — smooth falloff
      shakeRef.current.intensity *= Math.pow(0.05, clampedDelta);
    } else {
      // Smoothly return to original position
      camera.position.x += (originalPos.current.x - camera.position.x) * clampedDelta * 8;
      camera.position.y += (originalPos.current.y - camera.position.y) * clampedDelta * 8;
      shakeRef.current.intensity = 0;
    }
  });

  return null;
}
