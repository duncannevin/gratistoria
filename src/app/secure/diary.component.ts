import {Component, computed, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Card, DiaryCardComponent} from '../common/components';
import {Gratitude} from '@models/gratitude.model';
import {Observable, of} from 'rxjs';
import {Store} from '@ngrx/store';
import {toSignal} from '@angular/core/rxjs-interop';
import {DiaryActions, selectDiaryErrorAll, selectDiaryHasMore, selectDiaryItems, selectDiaryLoadingAll, selectDiaryLoadingMore} from '@state';
import {BookIcon, LucideAngularModule} from 'lucide-angular';

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
            <lucide-icon [img]="BookIcon" [size]="16"></lucide-icon>
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
  imports: [CommonModule, ...Card, DiaryCardComponent, LucideAngularModule],
})
export class DiaryComponent {
  private store = inject(Store);

  private itemsSel = toSignal(this.store.select(selectDiaryItems), { initialValue: [] as Gratitude[] });
  private loadingAllSel = toSignal(this.store.select(selectDiaryLoadingAll), { initialValue: true });
  private loadingMoreSel = toSignal(this.store.select(selectDiaryLoadingMore), { initialValue: false });
  private errorAllSel = toSignal(this.store.select(selectDiaryErrorAll), { initialValue: null });
  private hasMoreSel = toSignal(this.store.select(selectDiaryHasMore), { initialValue: false });

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

  protected readonly BookIcon = BookIcon;
}
