import {Mood} from '../enums/mood.enum';

export interface Gratitude {
  id: number;
  title: string;
  description: string;
  mood: Mood;
  date: string;
  story?: number;
}
