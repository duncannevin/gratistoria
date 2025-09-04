import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Story} from '../common/models/story.model';
import {Card} from '../common/components/card.component';
import {DateTimePipe} from '../common/pipes/date-time.pipe';
import {StoryCardComponent} from '../common/components/story-card.component';
import {PulseCardComponent} from '../common/components/pulse-card.component';

@Component({
  standalone: true,
  template: `
    <div class="flex flex-col">
      <div class="inline-block text-center p-6 rounded-lg w-[698px] max-w-full m-auto">
        <h2 class="text-2xl mb-2">Community Stories</h2>
        <p class="text-muted-foreground max-w-2xl mx-auto pl-8 pr-8">
          Each day, our AI weaves together the gratitude shared by our community into beautiful stories that celebrate
          our collective appreciation.
        </p>
      </div>

      @if (loading) {
        @for (i of [1, 2]; track i) {
          <div class="mb-4">
            <app-pulse-card></app-pulse-card>
          </div>
        }
      } @else if (stories.length === 0) {
        <app-card className="mb-2">
          <app-card-content className="text-center py-12">
            <div class="text-6xl mb-4">📖</div>
            <h3 class="text-lg mb-2">Your story collection is just beginning</h3>
            <p class="text-muted-foreground">
              Share your daily gratitude and watch as beautiful stories are woven from our community's collective
              appreciation.
            </p>
          </app-card-content>
        </app-card>
      } @else {
        @for (story of stories; track story.id) {
          <div class="mb-4">
            <app-story-card
              [story]="story"
            ></app-story-card>
          </div>
        }
      }
      <div class="inline-block text-center p-6 bg-muted rounded-lg w-[698px] max-w-full m-auto">
        <p class="text-sm text-muted-foreground">
          Stories are generated from the previous day's gratitude entries •
          Your personal details remain private while contributing to our collective narrative
        </p>
      </div>
    </div>
  `,
  imports: [...Card, CommonModule, PulseCardComponent, StoryCardComponent],
})
export class StoriesComponent implements OnInit {
  loading = true;
  stories: Story[] = [];

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;
      this.stories = [
        {
          id: 1,
          date: '2025-09-04',
          title: 'First Light, Fresh Mercies',
          content:
            'Morning coffee steamed in quiet kitchens while bus stops filled with sleepy smiles. Several entries noticed the first cool hint of autumn—open windows, softer sun, sweaters rescued from closets. Small mercies stacked up: a child’s unprompted hug, a neighbor’s wave, and projects finally clicking after weeks of tinkering.\n\nToday’s gratitude reads like a chorus: we’re thankful for beginnings that arrive without fanfare and for the steadiness to try again.',
          entryCount: 58
        },
        {
          id: 2,
          date: '2025-09-03',
          title: 'Kindness in Transit',
          content:
            'Across commutes and errands, people recorded tiny rescues: a held elevator, a driver letting someone merge, a barista remembering a name. Many noticed that kindness landed hardest on the hardest days. A few wrote about offering their seat, sharing an umbrella, or texting encouragement between meetings.\n\nThe thread through it all: generosity moves fastest when it has somewhere nearby to go.',
          entryCount: 42
        },
        {
          id: 3,
          date: '2025-09-02',
          title: 'Work that Feels Like Craft',
          content:
            'Today’s pages celebrated solving stubborn bugs, finishing drafts, and learning just enough to teach someone else. One entry compared a clean git history to a swept workshop floor—evidence that care was taken. Another thanked a teammate for patient code reviews that made the whole team sharper.\n\nGratitude leaned toward process over outcomes: the pleasure of doing a thing well, slowly, together.',
          entryCount: 51
        },
        {
          id: 4,
          date: '2025-09-01',
          title: 'Tables Set, Stories Shared',
          content:
            'Long weekends brought potlucks, porch lights, and second helpings. Several entries mentioned laughing so hard dinner went cold. Someone wrote about washing dishes with their dad, hands pruned and hearts full. Another praised the simple relief of being known—no small talk, just belonging.\n\nWe’re thankful for the ordinary miracle of enough seats and one more chair scooted in.',
          entryCount: 67
        },
        {
          id: 5,
          date: '2025-08-31',
          title: 'A Quiet Inventory',
          content:
            'Many took stock: working ankles, reliable buses, room-darkening curtains, a plant that finally sprouted. A few reflected on setbacks that softened into wisdom, and the patience of friends who stayed when the plot got messy.\n\nGratitude today is granular—measured in breaths, steps, and the peace that comes from noticing what didn’t go wrong.',
          entryCount: 39
        }
      ];
    }, 800);
  }
}
