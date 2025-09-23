import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import type { Gratitude } from '../models/gratitude.model';
import {Mood} from '../common/enums/mood.enum';
import {delay, map, Observable, of} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GratitudeService {
  private readonly STORAGE_KEY = 'gratistoria.gratitudes.v1';
  private readonly STORAGE_ID_KEY = 'gratistoria.gratitudes.nextId.v1';
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
  private db: Gratitude[] = [];

  constructor() {
    this.loadFromStorage();
    if (this.db.length === 0) {
      // seed with sample data on first run
      this.db = [
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
      this.nextId = Math.max(...this.db.map(d => d.id)) + 1;
      this.saveToStorage();
    }
  }

  private loadFromStorage() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      const idRaw = localStorage.getItem(this.STORAGE_ID_KEY);
      if (raw) this.db = JSON.parse(raw) as Gratitude[];
      if (idRaw) this.nextId = Number(idRaw) || this.nextId;
      if (!idRaw && this.db.length) {
        this.nextId = Math.max(...this.db.map(d => d.id)) + 1;
      }
    } catch {
      // ignore parse errors
      this.db = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.db));
      localStorage.setItem(this.STORAGE_ID_KEY, String(this.nextId));
    } catch {
      // ignore quota errors in dev
    }
  }

  create(entry: Omit<Gratitude, 'id'>): Observable<Gratitude | null> {
    return of(null).pipe(
      delay(400), // simulate latency
      map(() => {
        const withDate: Omit<Gratitude, 'id'> = {
          ...entry,
          // Ensure created entries are stamped with today's date
          date: this.dayString(0),
        };
        const newEntry: Gratitude = { id: this.nextId++, ...withDate };
        this.db = [newEntry, ...this.db];
        this.saveToStorage();
        return newEntry; // or `null` to signal failure paths
      })
    );
  }

  getToday(): Observable<Gratitude | null> {
    const today = this.dayString(0);
    return of(null).pipe(
      delay(500), // simulate latency
      map(() => this.db.find(e => e.date === today) ?? null)
    );
  }

  // --- read ---------------------------------------------------------------
  getAll(): Observable<Gratitude[]> {
    return of(null).pipe(
      delay(1200),
      map(() =>
        [...this.db].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
      )
    );
  }

  // --- additional mock endpoints -----------------------------------------
  getById(id: number): Observable<Gratitude | null> {
    return of(null).pipe(
      delay(300),
      map(() => this.db.find(e => e.id === id) ?? null),
    );
  }

  update(id: number, changes: Partial<Omit<Gratitude, 'id'>>): Observable<Gratitude | null> {
    return of(null).pipe(
      delay(400),
      map(() => {
        const idx = this.db.findIndex(e => e.id === id);
        if (idx === -1) return null;
        const updated: Gratitude = { ...this.db[idx], ...changes, id } as Gratitude;
        this.db = [updated, ...this.db.filter(e => e.id !== id)];
        this.saveToStorage();
        return updated;
      }),
    );
  }

  delete(id: number): Observable<boolean> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const before = this.db.length;
        this.db = this.db.filter(e => e.id !== id);
        const removed = this.db.length < before;
        if (removed) this.saveToStorage();
        return removed;
      }),
    );
  }
}
