import {Component, computed, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Story} from '@models/story.model';
import {Card, StoryCardComponent, PulseCardComponent} from '../common/components';
import {Store} from '@ngrx/store';
import {toSignal} from '@angular/core/rxjs-interop';
import {StoryActions, selectStoryErrorAll, selectStoryLoadingAll, selectStories} from '@state';

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

      @if (loading()) {
        @for (i of [1, 2]; track i) {
          <div class="mb-4">
            <app-pulse-card></app-pulse-card>
          </div>
        }
      } @else if (value().length === 0) {
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
        @for (story of value(); track story.id) {
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
export class StoriesComponent {
  private store = inject(Store);

  private storiesSel = toSignal(this.store.select(selectStories), { initialValue: [] as Story[] });
  private loadingSel = toSignal(this.store.select(selectStoryLoadingAll), { initialValue: true });
  private errorSel = toSignal(this.store.select(selectStoryErrorAll), { initialValue: null });

  readonly value = computed(() => this.storiesSel());
  readonly loading = computed(() => this.loadingSel());
  readonly error = computed(() => this.errorSel());

  constructor() {
    this.store.dispatch(StoryActions.loadAll());
  }
}
