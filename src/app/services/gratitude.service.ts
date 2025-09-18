import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import type { Gratitude } from '../common/models/gratitude.model';
import {Mood} from '../common/enums/mood.enum';
import {delay, map, Observable, of} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GratitudeService {
  // --- utils ---------------------------------------------------------------
  private delay(ms: number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }
  /** YYYY-MM-DD in local time */
  private dayString(daysAgo = 0) {
    return dayjs().subtract(daysAgo, 'day').format('YYYY-MM-DD');
  }

  // --- mock db -------------------------------------------------------------
  private nextId = Number(dayjs().valueOf());
  private db: Gratitude[] = [
    {
      id: 1,
      title: 'Morning Coffee Ritual',
      description:
        "There's something magical about the first sip—the warmth, aroma, and quiet before the day begins.",
      mood: Mood.PEACEFUL,
      date: this.dayString(1),
      story: 1,
    },
    {
      id: 2,
      title: 'Unexpected Kindness',
      description: 'A stranger held the door and smiled. Small gesture, big lift.',
      mood: Mood.JOYFUL,
      date: this.dayString(2),
      story: 2,
    },
    {
      id: 3,
      title: 'Family Game Night',
      description: 'Laughter and presence—instant memories.',
      mood: Mood.GRATEFUL,
      date: this.dayString(3),
      story: 3,
    },
    {
      id: 4,
      title: 'Sunset Walk',
      description: 'Orange and pink sky that reset my perspective.',
      mood: Mood.REFLECTIVE,
      date: this.dayString(4),
      story: 4,
    },
    {
      id: 5,
      title: 'New Opportunities',
      description: 'A promising project kicked off—stretching in the right ways.',
      mood: Mood.HOPEFUL,
      date: this.dayString(5),
      story: 5,
    },
  ];

  // --- create --------------------------------------------------------------
  async create(entry: Omit<Gratitude, 'id'>): Promise<{ success: boolean; entry?: Gratitude }> {
    await this.delay(400);
    const newEntry: Gratitude = { id: ++this.nextId, ...entry };
    this.db = [newEntry, ...this.db];
    return { success: true, entry: newEntry };
  }

  // --- read ---------------------------------------------------------------
  getAll(): Observable<Gratitude[]> {
    // return newest first
    return of(delay(1200)).pipe(map(() => [...this.db].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))));
  }

  async getById(id: number | string): Promise<Gratitude | null> {
    await this.delay(200);
    const n = typeof id === 'string' ? Number(id) : id;
    return this.db.find(e => e.id === n) ?? null;
  }

  async getToday(): Promise<Gratitude | null> {
    await this.delay(250);
    const today = this.dayString(0);
    return this.db.find(e => e.date === today) ?? null;
  }

  async getByDate(date: string): Promise<Gratitude[]> {
    await this.delay(250);
    return this.db.filter(e => e.date === date);
  }

  async getByStoryId(storyId: number | null | undefined): Promise<Gratitude[]> {
    await this.delay(250);
    if (storyId == null) return [];
    return this.db.filter(e => e.story === storyId);
  }

  async getRange(fromInclusive: string, toInclusive: string): Promise<Gratitude[]> {
    await this.delay(300);
    const from = dayjs(fromInclusive, 'YYYY-MM-DD');
    const to = dayjs(toInclusive, 'YYYY-MM-DD');
    return this.db.filter(e => {
      const d = dayjs(e.date, 'YYYY-MM-DD');
      return (d.isAfter(from) || d.isSame(from, 'day')) && (d.isBefore(to) || d.isSame(to, 'day'));
    });
  }

  // --- update --------------------------------------------------------------
  async update(id: number, patch: Partial<Omit<Gratitude, 'id'>>): Promise<Gratitude | null> {
    await this.delay(350);
    const idx = this.db.findIndex(e => e.id === id);
    if (idx < 0) return null;
    const updated = { ...this.db[idx], ...patch };
    this.db = [...this.db.slice(0, idx), updated, ...this.db.slice(idx + 1)];
    return updated;
  }

  // --- delete --------------------------------------------------------------
  async delete(id: number): Promise<boolean> {
    await this.delay(250);
    const before = this.db.length;
    this.db = this.db.filter(e => e.id !== id);
    return this.db.length < before;
  }
}
