import { useRef, useState, useCallback, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural lightning bolt with realistic branching and fade
function LightningBolt({ startPoint, endPoint, segments = 12, spread = 3, branchChance = 0.3, opacity = 1 }) {
  const points = useMemo(() => {
    const pts = [];
    const dir = new THREE.Vector3().subVectors(endPoint, startPoint);

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const pos = new THREE.Vector3().lerpVectors(startPoint, endPoint, t);

      if (i > 0 && i < segments) {
        // Jagged displacement — stronger in the middle
        const midFactor = Math.sin(t * Math.PI);
        pos.x += (Math.random() - 0.5) * spread * midFactor;
        pos.z += (Math.random() - 0.5) * spread * midFactor * 0.5;
        pos.y += (Math.random() - 0.5) * spread * midFactor * 0.3;
      }
      pts.push(pos);
    }
    return pts;
  }, [startPoint, endPoint, segments, spread]);

  // Generate branches
  const branches = useMemo(() => {
    const b = [];
    for (let i = 2; i < points.length - 2; i++) {
      if (Math.random() < branchChance) {
        const origin = points[i].clone();
        const branchEnd = origin.clone();
        branchEnd.x += (Math.random() - 0.5) * spread * 2;
        branchEnd.y -= Math.random() * spread * 1.5;
        branchEnd.z += (Math.random() - 0.5) * spread;

        const branchPts = [];
        const subSegments = 4 + Math.floor(Math.random() * 4);
        for (let j = 0; j <= subSegments; j++) {
          const t = j / subSegments;
          const p = new THREE.Vector3().lerpVectors(origin, branchEnd, t);
          if (j > 0 && j < subSegments) {
            p.x += (Math.random() - 0.5) * spread * 0.4;
            p.z += (Math.random() - 0.5) * spread * 0.2;
          }
          branchPts.push(p);
        }
        b.push(branchPts);
      }
    }
    return b;
  }, [points, branchChance, spread]);

  const mainGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <group>
      {/* Main bolt */}
      <line geometry={mainGeo}>
        <lineBasicMaterial color="#e8e0ff" transparent opacity={opacity} linewidth={2} />
      </line>
      {/* Glow bolt (slightly larger) */}
      <line geometry={mainGeo}>
        <lineBasicMaterial color="#b8a0ff" transparent opacity={opacity * 0.4} linewidth={4} />
      </line>
      {/* Branches */}
      {branches.map((branchPts, idx) => {
        const geo = new THREE.BufferGeometry().setFromPoints(branchPts);
        return (
          <line key={idx} geometry={geo}>
            <lineBasicMaterial color="#d0c0ff" transparent opacity={opacity * 0.6} linewidth={1} />
          </line>
        );
      })}
    </group>
  );
}

// Lightning controller — manages timing, flash, and bolt lifecycle
export default function Lightning({ minInterval = 1.5, maxInterval = 5, onFlash }) {
  const [bolts, setBolts] = useState([]);
  const flashLightRef = useRef();
  const timerRef = useRef(0);
  const nextStrikeRef = useRef(minInterval + Math.random() * (maxInterval - minInterval));

  const createBolt = useCallback(() => {
    const x = (Math.random() - 0.5) * 40;
    const z = (Math.random() - 0.5) * 30 - 10;
    const start = new THREE.Vector3(x, 35, z);
    const end = new THREE.Vector3(x + (Math.random() - 0.5) * 8, -2, z + (Math.random() - 0.5) * 5);

    const bolt = {
      id: Date.now() + Math.random(),
      start,
      end,
      born: 0,
      lifetime: 0.15 + Math.random() * 0.1,
      opacity: 1,
    };
    return bolt;
  }, []);

  useFrame((state, delta) => {
    const clampedDelta = Math.min(delta, 0.05);
    timerRef.current += clampedDelta;

    // Trigger new strike
    if (timerRef.current >= nextStrikeRef.current) {
      timerRef.current = 0;
      nextStrikeRef.current = minInterval + Math.random() * (maxInterval - minInterval);

      const newBolt = createBolt();
      setBolts((prev) => [...prev, newBolt]);

      // Flash the ambient light
      if (flashLightRef.current) {
        flashLightRef.current.intensity = 6;
      }

      // Notify parent for screen shake
      if (onFlash) onFlash();

      // Sometimes double-strike
      if (Math.random() < 0.3) {
        setTimeout(() => {
          const secondBolt = createBolt();
          setBolts((prev) => [...prev, secondBolt]);
          if (flashLightRef.current) flashLightRef.current.intensity = 8;
        }, 80);
      }
    }

    // Decay flash light
    if (flashLightRef.current && flashLightRef.current.intensity > 0) {
      flashLightRef.current.intensity *= 0.88;
      if (flashLightRef.current.intensity < 0.05) flashLightRef.current.intensity = 0;
    }

    // Age and remove old bolts
    setBolts((prev) =>
      prev
        .map((b) => ({ ...b, born: b.born + clampedDelta, opacity: Math.max(0, 1 - b.born / b.lifetime) }))
        .filter((b) => b.born < b.lifetime)
    );
  });

  return (
    <group>
      {/* Flash light that illuminates the whole scene during strikes */}
      <pointLight ref={flashLightRef} position={[0, 30, 0]} intensity={0} color="#c8b0ff" distance={200} decay={1} />

      {bolts.map((bolt) => (
        <LightningBolt
          key={bolt.id}
          startPoint={bolt.start}
          endPoint={bolt.end}
          opacity={bolt.opacity}
          segments={10 + Math.floor(Math.random() * 6)}
          spread={2 + Math.random() * 2}
          branchChance={0.35}
        />
      ))}
    </group>
  );
}
