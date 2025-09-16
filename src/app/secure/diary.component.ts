import {Component, computed, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Card} from '../common/components/card.component';
import {Gratitude} from '../common/models/gratitude.model';
import {DiaryCardComponent} from '../common/components/diary-card.component';
import {GratitudeService} from '../services/gratitude.service';
import {catchError, from, map, Observable, of, startWith} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';
import {LoadState} from '../common/models/load-state.model';

@Component({
  standalone: true,
  template: `
    <div class="flex flex-col">
      @if (isLoading()) {
        <div class="max-w-4xl mx-auto px-6">
          <div class="py-12 text-center">
            <div class="text-4xl mb-4">📖</div>
            <div class="text-lg text-muted-foreground">Loading your diary...</div>
          </div>
        </div>
      } @else if (!isLoading() && entries()?.value?.length === 0) {
        <app-card className="p-8 text-center">
          <div class="text-4xl mb-4">📝</div>
          <h3 class="mb-2">No entries yet</h3>
          <p class="text-muted-foreground mb-4">
            Start your gratitude journey by writing your first entry
          </p>
        </app-card>
      } @else {
        <div class="inline-block mb-6 rounded-lg w-[742px] max-w-full m-auto">
          <div class="flex items-center gap-3 mb-2">
            <!--              <BookOpen className="w-6 h-6 text-primary" />-->
            <h4 class="text-foreground">My Gratitude Diary</h4>
          </div>
          <p class="text-muted-foreground">
            Your personal collection of gratitude moments and the stories they've inspired
          </p>
        </div>
        @for (gratitude of entries()?.value; track gratitude.id) {
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
  imports: [CommonModule, ...Card, DiaryCardComponent],
})
export class DiaryComponent {
  private gratitudeService = inject(GratitudeService);

  state$: Observable<LoadState<Gratitude[]>> = from(this.gratitudeService.getAll()).pipe(
    map((entries) => ({ kind: 'success', value: entries } as const)),
    catchError((err) => of({ kind: 'error' } as const)),
    startWith({ kind: 'loading' } as const),
  );

  state = toSignal(this.state$);
  isLoading = computed(() => this.state()?.kind === 'loading');
  entries = computed(() => this.state());
}
