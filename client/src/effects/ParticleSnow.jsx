import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Floating snow particles with natural drift and wobble
export default function ParticleSnow({ count = 3000, speed = 0.25, areaSize = 50, height = 35, opacity = 0.7 }) {
  const pointsRef = useRef();

  const { positions, velocities, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    const ph = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * areaSize;
      pos[i * 3 + 1] = Math.random() * height;
      pos[i * 3 + 2] = (Math.random() - 0.5) * areaSize;
      vel[i] = speed * (0.5 + Math.random() * 0.5);
      ph[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, velocities: vel, phases: ph };
  }, [count, areaSize, height, speed]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;
    const clampedDelta = Math.min(delta, 0.05);
    const posAttr = pointsRef.current.geometry.attributes.position;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Gravity — gentle downward
      posAttr.array[i3 + 1] -= velocities[i] * clampedDelta * 8;

      // Horizontal drift — sine wave for natural wobble
      const wobble = Math.sin(time * 0.6 + phases[i]) * 0.015;
      const drift = Math.cos(time * 0.3 + phases[i] * 0.7) * 0.008;
      posAttr.array[i3] += wobble;
      posAttr.array[i3 + 2] += drift;

      // Recycle
      if (posAttr.array[i3 + 1] < -2) {
        posAttr.array[i3 + 1] = height;
        posAttr.array[i3] = (Math.random() - 0.5) * areaSize;
        posAttr.array[i3 + 2] = (Math.random() - 0.5) * areaSize;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        color="#d8e8f5"
        size={0.12}
        transparent
        opacity={opacity}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
