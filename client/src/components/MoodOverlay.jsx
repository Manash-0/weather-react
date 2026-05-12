import { motion, AnimatePresence } from 'framer-motion';

// Full-viewport gradient overlay that transitions with weather mood
export default function MoodOverlay({ mood }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mood?.name || 'default'}
        className="mood-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        style={{
          background: mood?.overlay?.gradient || 'transparent',
          mixBlendMode: mood?.overlay?.blend || 'normal',
        }}
      />
    </AnimatePresence>
  );
}
