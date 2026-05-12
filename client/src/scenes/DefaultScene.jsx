import { Stars } from '@react-three/drei';

// Default scene — starfield with ambient glow, shown during loading or when no weather data is available
export default function DefaultScene({ mood }) {
  return (
    <group>
      <ambientLight intensity={mood.ambientIntensity} color={mood.ambientColor} />

      {/* Deep starfield */}
      <Stars
        radius={200}
        depth={100}
        count={5000}
        factor={5}
        saturation={0.3}
        fade
        speed={0.5}
      />

      {/* Subtle distant glow */}
      <pointLight position={[0, 20, -50]} intensity={0.3} color="#4a4a8a" distance={200} decay={2} />

      <fog attach="fog" args={[mood.fogColor, mood.fogNear, mood.fogFar]} />
    </group>
  );
}
