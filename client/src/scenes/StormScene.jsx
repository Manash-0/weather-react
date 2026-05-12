import { useRef, useCallback } from 'react';
import { Cloud } from '@react-three/drei';
import ParticleRain from '../effects/ParticleRain';
import Lightning from '../effects/Lightning';
import ScreenShake from '../effects/ScreenShake';

// Thunderstorm scene — violent rain, lightning bolts, camera shake, dark atmosphere
export default function StormScene({ mood }) {
  const shakeRef = useRef({ intensity: 0 });

  const handleFlash = useCallback(() => {
    shakeRef.current.intensity = 1.5;
  }, []);

  return (
    <group>
      {/* Ambient storm lighting — very dark with purple tint */}
      <ambientLight intensity={mood.ambientIntensity} color={mood.ambientColor} />

      {/* Distant dim directional light simulating obscured moonlight */}
      <directionalLight position={[10, 30, -10]} intensity={0.03} color="#4a3a8a" />

      {/* Heavy rain */}
      <ParticleRain
        count={mood.particles.count}
        speed={mood.particles.speed}
        opacity={mood.particles.opacity}
        windStrength={mood.wind.strength}
        areaSize={70}
        height={45}
      />

      {/* Lightning system with screen shake */}
      <Lightning
        minInterval={mood.lightning.minInterval}
        maxInterval={mood.lightning.maxInterval}
        onFlash={handleFlash}
      />
      <ScreenShake shakeRef={shakeRef} />

      {/* Dark storm clouds */}
      <Cloud
        position={[0, 25, -15]}
        speed={0.3}
        opacity={0.35}
        width={40}
        depth={8}
        segments={30}
        color="#1a1a2e"
      />
      <Cloud
        position={[-15, 22, -20]}
        speed={0.2}
        opacity={0.3}
        width={30}
        depth={6}
        segments={25}
        color="#2d1b4e"
      />
      <Cloud
        position={[15, 28, -12]}
        speed={0.25}
        opacity={0.25}
        width={35}
        depth={7}
        segments={20}
        color="#1a1a3e"
      />

      {/* Ground-level fog */}
      <fog attach="fog" args={[mood.fogColor, mood.fogNear, mood.fogFar]} />
    </group>
  );
}
