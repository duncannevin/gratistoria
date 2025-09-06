import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Card} from '../common/components/card.component';
import {Gratitude} from '../common/models/gratitude.model';
import {DateTimePipe} from '../common/pipes/date-time.pipe';
import {BadgeComponent} from '../common/components/badge.component';
import {Mood} from '../common/enums/mood.enum';
import {DiaryCardComponent} from '../common/components/diary-card.component';

@Component({
  standalone: true,
  template: `
    <div class="flex flex-col">
        @if (isLoading) {
          <div class="max-w-4xl mx-auto px-6">
            <div class="py-12 text-center">
              <div class="text-4xl mb-4">📖</div>
              <div class="text-lg text-muted-foreground">Loading your diary...</div>
            </div>
          </div>
        } @else if (!isLoading && entries.length === 0) {
          <app-card className="p-8 text-center">
            <div class="text-4xl mb-4">📝</div>
            <h3 class="mb-2">No entries yet</h3>
            <p class="text-muted-foreground mb-4">
              Start your gratitude journey by writing your first entry
            </p>
          </app-card>
        } @else {
          <div class="inline-block pb-6 rounded-lg w-[742px] max-w-full m-auto">
            <div class="flex items-center gap-3 mb-2">
<!--              <BookOpen className="w-6 h-6 text-primary" />-->
              <h4 class="text-foreground">My Gratitude Diary</h4>
            </div>
            <p class="text-muted-foreground">
              Your personal collection of gratitude moments and the stories they've inspired
            </p>
          </div>
          @for (gratitude of entries; track gratitude.id) {
            <app-diary-card
                [gratitude]="gratitude"
            ></app-diary-card>
<!--            <app-card className="w-[742px] max-w-full">-->
<!--              <app-card-header>-->
<!--                <div class="flex items-center gap-3">-->
<!--                  <div class="flex items-center gap-2 text-sm text-muted-foreground">-->
<!--                    &lt;!&ndash;                <Calendar className="w-4 h-4" />&ndash;&gt;-->
<!--                    {{ entry.date | appDateTime }}-->
<!--                  </div>-->
<!--                  <app-badge variant="secondary" className="flex items-center gap-1">-->
<!--                    <span>{{ entry.mood + 'TODO' }}</span>-->
<!--                    <span class="capitalize">{{ entry.mood }}</span>-->
<!--                  </app-badge>-->
<!--                </div>-->
<!--              </app-card-header>-->
<!--            </app-card>-->
          }
        }
    </div>
  `,
  imports: [CommonModule, ...Card, DateTimePipe, BadgeComponent, DiaryCardComponent],
})
export class DiaryComponent implements OnInit {
  isLoading = true;
  entries: Gratitude[] = [];

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
      this.entries = [
        {
          id: 1,
          title: "Morning quiet",
          description: "Ten calm minutes with coffee before the house woke up.",
          mood: Mood.PEACEFUL,
          date: "2025-09-05",
        },
        {
          id: 2,
          title: "Team win",
          description: "Shipped a tricky feature after solid reviews and pair sessions.",
          mood: Mood.GRATEFUL,
          date: "2025-09-04",
        },
        {
          id: 3,
          title: "Hopeful steps",
          description: "Scoped next sprint cleanly—feels achievable and exciting.",
          mood: Mood.HOPEFUL,
          date: "2025-09-03",
        },
        {
          id: 4,
          title: "Joy in small things",
          description: "Kids laughed at a terrible joke and it made my night.",
          mood: Mood.JOYFUL,
          date: "2025-09-02",
        },
        {
          id: 5,
          title: "Looking back",
          description: "Noted how last month’s challenges sharpened my focus.",
          mood: Mood.REFLECTIVE,
          date: "2025-09-01",
        },
        {
          id: 6,
          title: "Unnamed grace",
          description: "Can’t pin it down—just thankful to be carried today.",
          mood: Mood.UNKNOWN,
          date: "2025-08-31",
        },
      ];
    }, 800);
  }
}
