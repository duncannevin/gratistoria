import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DiaryActions } from './gratitude.actions';
import { GratitudeService } from '../services/gratitude.service';
import { catchError, map, of, switchMap } from 'rxjs';
import { TodayActions } from './today.actions';

@Injectable()
export class DiaryEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(GratitudeService);

  loadAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DiaryActions.loadAll),
      switchMap(() =>
        this.api.getAll().pipe(
          map((items) => DiaryActions.loadAllSuccess({ items })),
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
}
