// Enum names: UpperCamelCase; enum members: CONSTANT_CASE.
// Avoid `const enum` per Google TS style.
export enum Mood {
  JOYFUL = 'joyful',
  PEACEFUL = 'peaceful',
  GRATEFUL = 'grateful',
  HOPEFUL = 'hopeful',
  REFLECTIVE = 'reflective',
  UNKNOWN = 'unknown',
}

// Module-level constant (CONSTANT_CASE) for parsing.
const MOOD_FROM_STRING: Readonly<Record<string, Mood>> = {
  [Mood.JOYFUL]: Mood.JOYFUL,
  [Mood.PEACEFUL]: Mood.PEACEFUL,
  [Mood.GRATEFUL]: Mood.GRATEFUL,
  [Mood.HOPEFUL]: Mood.HOPEFUL,
  [Mood.REFLECTIVE]: Mood.REFLECTIVE,
  [Mood.UNKNOWN]: Mood.UNKNOWN,
};

export function stringToMood(str: string): Mood {
  const key = str.trim().toLowerCase();
  return MOOD_FROM_STRING[key] ?? Mood.UNKNOWN;
}
