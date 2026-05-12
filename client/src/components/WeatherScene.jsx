import { Canvas } from '@react-three/fiber';
import StormScene from '../scenes/StormScene';
import RainScene from '../scenes/RainScene';
import SnowScene from '../scenes/SnowScene';
import ClearScene from '../scenes/ClearScene';
import CloudScene from '../scenes/CloudScene';
import DefaultScene from '../scenes/DefaultScene';
import PostProcessing from '../effects/PostProcessing';

// Scene selector — renders the appropriate 3D scene based on mood
function SceneContent({ mood }) {
  const name = mood?.name || 'default';

  switch (name) {
    case 'thunderstorm':
      return <StormScene mood={mood} />;
    case 'rain':
    case 'drizzle':
      return <RainScene mood={mood} />;
    case 'snow':
      return <SnowScene mood={mood} />;
    case 'clear':
      return <ClearScene mood={mood} />;
    case 'clouds':
      return <CloudScene mood={mood} />;
    case 'mist':
      return <RainScene mood={mood} />;
    default:
      return <DefaultScene mood={mood} />;
  }
}

// Full-viewport Three.js canvas with mood-reactive 3D scene
export default function WeatherScene({ mood }) {
  return (
    <div className="weather-scene">
      <Canvas
        camera={{ position: [0, 5, 20], fov: 60, near: 0.1, far: 500 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
        }}
      >
        <color attach="background" args={[mood?.skyColor || '#0a0a1a']} />
        <SceneContent mood={mood} />
        <PostProcessing mood={mood} />
      </Canvas>
    </div>
  );
}
