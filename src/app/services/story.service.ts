// story.service.ts
import {Injectable} from '@angular/core';
import dayjs from 'dayjs';
import {Gratitude} from '../common/models/gratitude.model';
import {Mood} from '../common/enums/mood.enum';
import {Story} from '../common/models/story.model';

@Injectable({ providedIn: 'root' })
export class StoryService {
  // --- utils ---------------------------------------------------------------
  private delay(ms: number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }

  /** Returns YYYY-MM-DD for `daysAgo` in LOCAL time using dayjs */
  private dayString(daysAgo = 0) {
    return dayjs().subtract(daysAgo, 'day').format('YYYY-MM-DD');
  }

  // --- entries -------------------------------------------------------------
  async createEntry(
    entry: Omit<Gratitude, 'id' | 'story'>
  ): Promise<{ success: boolean; entry?: Gratitude }> {
    await this.delay(800);

    const newEntry: Gratitude = {
      id: Number(dayjs().valueOf()), // numeric id based on epoch ms
      ...entry,
      // story: 101, // optionally link to a story bucket
    };

    return { success: true, entry: newEntry };
  }

  async getTodayEntry(): Promise<Gratitude | null> {
    await this.delay(500);
    const today = this.dayString(0);
    // Simulate "no entry yet today"
    return null;
  }

  async getUserEntries(): Promise<Gratitude[]> {
    await this.delay(600);

    return [
      {
        id: 1,
        title: 'Morning Coffee Ritual',
        description:
          "There's something magical about the first sip of coffee in the morning—the warmth, aroma, and quiet before the day begins.",
        mood: Mood.PEACEFUL,
        date: this.dayString(1),
        story: 101,
      },
      {
        id: 2,
        title: 'Unexpected Kindness',
        description: 'A stranger held the door and smiled. Small gesture, big lift.',
        mood: Mood.JOYFUL,
        date: this.dayString(2),
        story: 102,
      },
      {
        id: 3,
        title: 'Family Game Night',
        description:
          'Laughter, light teasing, and everyone fully present—instant memories.',
        mood: Mood.GRATEFUL,
        date: this.dayString(3),
        story: 101,
      },
      {
        id: 4,
        title: 'Sunset Walk',
        description: 'Orange and pink sky that reset my perspective in 20 minutes.',
        mood: Mood.REFLECTIVE,
        date: this.dayString(4),
        story: 103,
      },
      {
        id: 5,
        title: 'New Opportunities',
        description: 'A promising project kicked off—stretching in the right ways.',
        mood: Mood.HOPEFUL,
        date: this.dayString(5),
        story: 102,
      },
    ];
  }

  // --- stories -------------------------------------------------------------
  async getStories(): Promise<Story[]> {
    await this.delay(800);

    return [
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
    ];
  }

  async getStoryById(id: number | string): Promise<Story | null> {
    await this.delay(500);
    const numericId = typeof id === 'string' ? Number(id) : id;
    const stories = await this.getStories();
    console.log(id, stories);
    return stories.find(s => s.id === numericId) ?? null;
  }
}
