import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// GPU-instanced rain particles for realistic rainfall
export default function ParticleRain({ count = 8000, speed = 1.2, areaSize = 60, height = 40, opacity = 0.4, windStrength = 0.15 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-compute random positions and velocities
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * areaSize,
        y: Math.random() * height,
        z: (Math.random() - 0.5) * areaSize,
        speed: speed * (0.8 + Math.random() * 0.4),
        drift: (Math.random() - 0.5) * windStrength,
      });
    }
    return arr;
  }, [count, areaSize, height, speed, windStrength]);

  // Rain drop geometry — thin elongated shape
  const geometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.003, 0.003, 0.25, 3);
    geo.rotateX(Math.PI * 0.05); // Slight angle for realism
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(0.6, 0.7, 0.85),
        transparent: true,
        opacity: opacity,
        depthWrite: false,
      }),
    [opacity]
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const clampedDelta = Math.min(delta, 0.05);

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      p.y -= p.speed * clampedDelta * 30;
      p.x += p.drift * clampedDelta * 10;

      // Reset when below ground
      if (p.y < -2) {
        p.y = height;
        p.x = (Math.random() - 0.5) * areaSize;
        p.z = (Math.random() - 0.5) * areaSize;
      }

      dummy.position.set(p.x, p.y, p.z);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, count]} frustumCulled={false}>
    </instancedMesh>
  );
}
