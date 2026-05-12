import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Cloud } from '@react-three/drei';

// Clear sky scene — warm sun glow, floating clouds, starfield backdrop, golden atmosphere
export default function ClearScene({ mood }) {
  const sunRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    // Subtle sun pulse
    if (sunRef.current) {
      sunRef.current.intensity = 1.5 + Math.sin(time * 0.5) * 0.3;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(time * 0.8) * 0.05);
    }
  });

  return (
    <group>
      <ambientLight intensity={mood.ambientIntensity} color={mood.ambientColor} />

      {/* Sun */}
      <group position={[15, 25, -30]}>
        {/* Core sun sphere */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshBasicMaterial color="#ffe4a0" transparent opacity={0.9} />
        </mesh>

        {/* Outer glow */}
        <mesh>
          <sphereGeometry args={[4, 32, 32]} />
          <meshBasicMaterial color="#ffd060" transparent opacity={0.15} />
        </mesh>

        {/* Sun point light */}
        <pointLight ref={sunRef} intensity={1.5} color="#ffd475" distance={150} decay={1.5} />
      </group>

      {/* Warm directional light */}
      <directionalLight position={[15, 25, -30]} intensity={0.4} color="#ffe0a0" />

      {/* Scattered fair-weather clouds */}
      <Cloud
        position={[-12, 18, -20]}
        speed={0.08}
        opacity={0.5}
        width={15}
        depth={4}
        segments={15}
        color="#ffffff"
      />
      <Cloud
        position={[20, 22, -25]}
        speed={0.06}
        opacity={0.4}
        width={12}
        depth={3}
        segments={12}
        color="#fff5e0"
      />
      <Cloud
        position={[-5, 25, -30]}
        speed={0.1}
        opacity={0.35}
        width={18}
        depth={5}
        segments={18}
        color="#ffffff"
      />

      {/* Distant starfield — visible in the deep blue sky */}
      <Stars radius={150} depth={80} count={2000} factor={4} saturation={0.2} fade speed={0.3} />

      <fog attach="fog" args={[mood.fogColor, mood.fogNear, mood.fogFar]} />
    </group>
  );
}
