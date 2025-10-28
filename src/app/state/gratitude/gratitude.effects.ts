import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DiaryActions } from './gratitude.actions';
import { GratitudeService } from '@services/gratitude.service';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { TodayActions } from './today.actions';
import { Store } from '@ngrx/store';
import { selectNextToken } from './gratitude.selectors';

@Injectable()
export class DiaryEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(GratitudeService);
  private readonly store = inject(Store);

  loadAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DiaryActions.loadAll),
      switchMap(() =>
        this.api.getPage().pipe(
          map(({ items, nextToken }) => DiaryActions.loadAllSuccess({ items, nextToken })),
          catchError(() => of(DiaryActions.loadAllFailure({ error: 'Cannot load entries' }))),
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DiaryActions.create),
      switchMap(({ entry }) =>
        this.api.create(entry).pipe(
          map((created) => DiaryActions.createSuccess({ created })),
          catchError(() => of(DiaryActions.createFailure({ error: 'Cannot create entry' }))),
        )
      )
    )
  );

  // After create, refresh Today's entry view
  refreshTodayAfterCreate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DiaryActions.createSuccess),
      map(() => TodayActions.load()),
    )
  );

  loadMore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DiaryActions.loadMore),
      withLatestFrom(this.store.select(selectNextToken)),
      switchMap(([, token]) =>
        this.api.getPage(token ?? undefined).pipe(
          map(({ items, nextToken }) => DiaryActions.loadMoreSuccess({ items, nextToken })),
          catchError(() => of(DiaryActions.loadMoreFailure({ error: 'Cannot load more' }))),
        )
      )
    )
  );
}
