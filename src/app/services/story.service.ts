import {Injectable} from '@angular/core';
import dayjs from 'dayjs';
import {Story} from '../models/story.model';
import {delay, map, Observable, of} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StoryService {
  /** Returns YYYY-MM-DD for `daysAgo` in LOCAL time using dayjs */
  private dayString(daysAgo = 0) {
    return dayjs().subtract(daysAgo, 'day').format('YYYY-MM-DD');
  }

  // --- stories -------------------------------------------------------------
  getStories(): Observable<Story[]> {
    return of(delay(800)).pipe( map(() => [
      {
        id: 1,
        date: this.dayString(1),
        title: 'A Day of Simple Joys',
        content:
          "Across the community, small moments stacked up: warm mugs, quick hellos, and the kind of laughter that lingers after the room is quiet. Gratitude found its way into the ordinary and made it shine.",
        entryCount: 12,
      },
      {
        id: 2,
        date: this.dayString(2),
        title: 'Connections That Matter',
        content:
          "Helping hands, listening ears, and shared work turned stress into camaraderie. The thread of the day was simple: generosity travels fastest when there's someone close to receive it.",
        entryCount: 8,
      },
      {
        id: 3,
        date: this.dayString(3),
        title: 'A Quiet Inventory',
        content:
          'Steady routines and small wins—steps, breaths, and the peace that comes from noticing what didn’t go wrong.',
        entryCount: 6,
      },
    ]));
  }

  getStoryById(id: number | string): Observable<Story | null> {
    const numericId = typeof id === 'string' ? Number(id) : id;

    return this.getStories().pipe(
      map((stories) => stories.find(s => s.id === numericId) ?? null),
    );
  }
}
