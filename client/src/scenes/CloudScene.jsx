import { Cloud } from '@react-three/drei';

// Cloud scene — dense overcast, multiple cloud layers, muted atmosphere
export default function CloudScene({ mood }) {
  return (
    <group>
      <ambientLight intensity={mood.ambientIntensity} color={mood.ambientColor} />
      <directionalLight position={[0, 30, -10]} intensity={0.08} color="#7a8a9e" />

      {/* Dense cloud layers at varying heights */}
      <Cloud
        position={[0, 18, -10]}
        speed={0.12}
        opacity={0.55}
        width={55}
        depth={12}
        segments={35}
        color="#4a5566"
      />
      <Cloud
        position={[-10, 22, -18]}
        speed={0.08}
        opacity={0.45}
        width={40}
        depth={10}
        segments={28}
        color="#5a6577"
      />
      <Cloud
        position={[12, 15, -8]}
        speed={0.15}
        opacity={0.5}
        width={35}
        depth={8}
        segments={22}
        color="#3a4556"
      />
      <Cloud
        position={[0, 26, -22]}
        speed={0.06}
        opacity={0.35}
        width={50}
        depth={15}
        segments={30}
        color="#4a556a"
      />
      <Cloud
        position={[-20, 20, -14]}
        speed={0.1}
        opacity={0.4}
        width={30}
        depth={7}
        segments={20}
        color="#5a667a"
      />

      <fog attach="fog" args={[mood.fogColor, mood.fogNear, mood.fogFar]} />
    </group>
  );
}
