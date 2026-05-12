import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';

// Post-processing effects layer — bloom, vignette, and chromatic aberration
// All values driven by the mood configuration
export default function PostProcessing({ mood }) {
  if (!mood) return null;

  const { bloom, vignette, chromaticAberration } = mood;

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={bloom.intensity}
        luminanceThreshold={bloom.luminanceThreshold}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette
        darkness={vignette.darkness}
        offset={vignette.offset}
        blendFunction={BlendFunction.NORMAL}
      />
      {chromaticAberration.offset > 0 && (
        <ChromaticAberration
          offset={new Vector2(chromaticAberration.offset, chromaticAberration.offset)}
          blendFunction={BlendFunction.NORMAL}
          radialModulation={false}
          modulationOffset={0.5}
        />
      )}
    </EffectComposer>
  );
}
