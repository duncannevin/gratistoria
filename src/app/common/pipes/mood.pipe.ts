import { Pipe, PipeTransform } from '@angular/core';
import {MOODS} from '../../models/mood.model';
import {Mood} from '../enums/mood.enum';

@Pipe({
  name: 'appMoodPipe',
  standalone: true,
})
export class MoodPipePipe implements PipeTransform {
  transform(
    value: Mood,
  ): string {
    return (MOODS[value] ?? MOODS['unknown']).emoji;
  }
}
