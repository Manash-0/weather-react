import { Cloud } from '@react-three/drei';
import ParticleRain from '../effects/ParticleRain';

// Rain scene — steady rainfall, moody grey clouds, gentle atmosphere
export default function RainScene({ mood }) {
  return (
    <group>
      <ambientLight intensity={mood.ambientIntensity} color={mood.ambientColor} />
      <directionalLight position={[5, 25, -5]} intensity={0.06} color="#5a7aaa" />

      {/* Steady rain */}
      <ParticleRain
        count={mood.particles.count}
        speed={mood.particles.speed}
        opacity={mood.particles.opacity}
        windStrength={mood.wind.strength}
        areaSize={60}
        height={40}
      />

      {/* Grey overcast clouds */}
      <Cloud
        position={[0, 22, -10]}
        speed={0.15}
        opacity={0.45}
        width={50}
        depth={10}
        segments={30}
        color="#3a4a5e"
      />
      <Cloud
        position={[-20, 20, -15]}
        speed={0.12}
        opacity={0.4}
        width={35}
        depth={8}
        segments={25}
        color="#4a5a6e"
      />
      <Cloud
        position={[18, 24, -18]}
        speed={0.18}
        opacity={0.35}
        width={40}
        depth={7}
        segments={22}
        color="#3a4a5e"
      />

      <fog attach="fog" args={[mood.fogColor, mood.fogNear, mood.fogFar]} />
    </group>
  );
}
