import {Mood} from '../enums/mood.enum';

export interface MoodData {
  value: string;
  label: string;
  emoji: string;
  color: string;
}

export const MOODS: Record<Mood, MoodData> = {
  [Mood.JOYFUL]: {value: 'joyful', label: 'Joyful', emoji: '😊', color: 'bg-yellow-100 text-yellow-800'},
  [Mood.PEACEFUL]: {value: 'peaceful', label: 'Peaceful', emoji: '🕊️', color: 'bg-blue-100 text-blue-800'},
  [Mood.GRATEFUL]: {value: 'grateful', label: 'Grateful', emoji: '🙏', color: 'bg-emerald-100 text-emerald-800'},
  [Mood.HOPEFUL]: {value: 'hopeful', label: 'Hopeful', emoji: '🌱', color: 'bg-lime-100 text-lime-800'},
  [Mood.REFLECTIVE]: {value: 'reflective', label: 'Reflective', emoji: '✨', color: 'bg-purple-100 text-purple-800'},
  [Mood.UNKNOWN]: { value: '', label: '', emoji: '', color: '' }
};

export type Moods = typeof MOODS;
