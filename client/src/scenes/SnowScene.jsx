import ParticleSnow from '../effects/ParticleSnow';

// Snow scene — gentle floating snowflakes, icy blue atmosphere, soft lighting
export default function SnowScene({ mood }) {
  return (
    <group>
      <ambientLight intensity={mood.ambientIntensity} color={mood.ambientColor} />
      <directionalLight position={[10, 25, 5]} intensity={0.12} color="#8eafc2" />

      {/* Soft fill light from below — icy ground reflection */}
      <pointLight position={[0, -5, 0]} intensity={0.15} color="#6a8aaa" distance={60} decay={2} />

      {/* Floating snow */}
      <ParticleSnow
        count={mood.particles.count}
        speed={mood.particles.speed}
        opacity={mood.particles.opacity}
        areaSize={55}
        height={38}
      />

      {/* Light fog for frosted atmosphere */}
      <fog attach="fog" args={[mood.fogColor, mood.fogNear, mood.fogFar]} />
    </group>
  );
}
