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
    return of(delay(800)).pipe( map(() => []));
  }

  getStoryById(id: number | string): Observable<Story | null> {
    const numericId = typeof id === 'string' ? Number(id) : id;

    return this.getStories().pipe(
      map((stories) => stories.find(s => s.id === numericId) ?? null),
    );
  }
}
