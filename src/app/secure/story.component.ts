import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject, computed} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Story} from '../common/models/story.model';
import {StoryService} from '../services/story.service';
import {ActivatedRoute, Router} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {
  catchError,
  distinctUntilChanged,
  finalize,
  from,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap, tap
} from 'rxjs';
import {LoadState} from '../common/models/load-state.model';
import {ButtonComponent} from '../common/components/button.component';

@Component({
  standalone: true,
  selector: 'app-story',
  imports: [ButtonComponent, CommonModule],
  template: `
    <!-- Loading -->
    <ng-container *ngIf="isLoading(); else notLoading">
      <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div class="text-center">
          <div class="text-4xl mb-4">📖</div>
          <div class="text-lg text-muted-foreground">Loading story...</div>
        </div>
      </div>
    </ng-container>

    <ng-template #notLoading>
      <!-- Error / Not found -->
      <ng-container *ngIf="error() || !story(); else storyView">
        <div
          class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div class="text-center max-w-md">
            <div class="text-4xl mb-4">📖</div>
            <h2 class="text-xl mb-4">Story Not Found</h2>
            <p class="text-muted-foreground mb-6">
              {{ error() || "The story you're looking for doesn't exist." }}
            </p>
            <app-button href="/s/stories"
                    class="inline-flex items-center rounded-md border px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition">
              <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Back to Stories
            </app-button>
          </div>
        </div>
      </ng-container>

      <!-- Story view -->
      <ng-template #storyView>
        <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div class="max-w-4xl mx-auto px-6 py-12">
            <!-- Back button -->
            <app-button href="/s/stories"
                    class="mb-8 inline-flex items-center rounded-md px-3 py-2 text-sm hover:bg-white/50 transition">
              <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Back to Stories
            </app-button>

            <!-- Story content -->
            <article class="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-border p-8 md:p-12">
              <header class="mb-8">
                <h1 class="text-3xl md:text-4xl mb-4 leading-tight">
                  {{ story()?.title }}
                </h1>

                <div class="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div class="flex items-center gap-2">
                    <!-- Calendar icon -->
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>{{ story()?.date | date:'EEEE, MMMM d, y' }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <!-- Users icon -->
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>{{ story()?.entryCount }} community entries</span>
                  </div>
                </div>
              </header>

              <div class="prose prose-lg max-w-none">
                <p class="text-foreground leading-relaxed text-lg">
                  {{ story()?.content }}
                </p>
              </div>

              <footer class="mt-12 pt-8 border-t border-border">
                <div class="bg-muted/30 rounded-lg p-6">
                  <p class="text-sm text-muted-foreground text-center">
                    This story was woven from {{ story()?.entryCount }} gratitude entries shared by our community.
                    Each contribution helps create these beautiful narratives while keeping personal details private.
                  </p>
                </div>
              </footer>
            </article>
          </div>
        </div>
      </ng-template>
    </ng-template>
  `,
})
export class StoryComponent {
  @Output() back = new EventEmitter<void>();

  private storyService = inject(StoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  state$: Observable<LoadState<Story>> = this.route.paramMap.pipe(
    map((map) => map.get('id') ?? ''),
    distinctUntilChanged(),
    switchMap((id) => from(this.loadStory(id)).pipe(
      map((story) =>
        story ?
          { kind: 'success', value: story } as const :
          { kind: 'not-found' } as const
      ),
      catchError((err) => of({ kind: 'error' } as const))
    )),
    startWith({ kind: 'loading' } as const),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  state = toSignal(this.state$);
  story = computed(() => this.state()?.kind === 'success' ? (this.state() as { kind: 'success', value: Story } ).value : null);
  isLoading = computed(() => this.state()?.kind === 'loading');
  error = computed(() =>
    this.state()?.kind === 'error' ?
      'Could not load story data' :
      this.state()?.kind === 'not-found' ?
      'Story not found' :
      null,
  );

  private async loadStory(storyId: string | null): Promise<Story | null> {
    if (!storyId) return null;
    return await this.storyService.getStoryById(storyId);
  }
}
