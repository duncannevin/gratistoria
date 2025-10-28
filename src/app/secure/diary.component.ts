import {Component, computed, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Card} from '../common/components/card.component';
import {Gratitude} from '../models/gratitude.model';
import {DiaryCardComponent} from '../common/components/diary-card.component';
import {Observable, of} from 'rxjs';
import {Store} from '@ngrx/store';
import {toSignal} from '@angular/core/rxjs-interop';
import {DiaryActions} from '../state/gratitude.actions';
import {selectErrorAll, selectHasMore, selectItems, selectLoadingAll, selectLoadingMore} from '../state/gratitude.selectors';

@Component({
  standalone: true,
  template: `
    <div class="flex flex-col">
      @if (loading()) {
        <div class="max-w-4xl mx-auto px-6">
          <div class="py-12 text-center">
            <div class="text-4xl mb-4">📖</div>
            <div class="text-lg text-muted-foreground">Loading your diary...</div>
          </div>
        </div>
      } @else if (!loading() && value()?.length === 0) {
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
        @for (gratitude of value(); track gratitude.id) {
          <div class="mb-4">
            <app-diary-card [gratitude]="gratitude"></app-diary-card>
          </div>
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
        <div class="text-center mt-6" *ngIf="hasMore()">
          <button
            class="px-4 py-2 rounded-md bg-primary text-primary-foreground disabled:opacity-60"
            [disabled]="loadingMore()"
            (click)="onLoadMore()"
          >
            {{ loadingMore() ? 'Loading more…' : 'Load more' }}
          </button>
        </div>
      }
    </div>
  `,
  imports: [CommonModule, ...Card, DiaryCardComponent],
})
export class DiaryComponent {
  private store = inject(Store);

  private itemsSel = toSignal(this.store.select(selectItems), { initialValue: [] as Gratitude[] });
  private loadingAllSel = toSignal(this.store.select(selectLoadingAll), { initialValue: true });
  private loadingMoreSel = toSignal(this.store.select(selectLoadingMore), { initialValue: false });
  private errorAllSel = toSignal(this.store.select(selectErrorAll), { initialValue: null });
  private hasMoreSel = toSignal(this.store.select(selectHasMore), { initialValue: false });

  readonly value = computed<Gratitude[] | null>(() => this.itemsSel());
  readonly loading = computed<boolean>(() => this.loadingAllSel());
  readonly loadingMore = computed<boolean>(() => this.loadingMoreSel());
  readonly error = computed<string | null>(() => this.errorAllSel());
  readonly hasMore = computed<boolean>(() => this.hasMoreSel());

  constructor() {
    this.store.dispatch(DiaryActions.loadAll());
  }

  // uses store for data; no local load
  onLoadMore() {
    this.store.dispatch(DiaryActions.loadMore());
  }
}
