import { useMemo } from 'react';
import { getMoodFromCondition } from '../utils/moodConfig';

export default function useMood(condition) {
  const mood = useMemo(() => getMoodFromCondition(condition), [condition]);
  return mood;
}
