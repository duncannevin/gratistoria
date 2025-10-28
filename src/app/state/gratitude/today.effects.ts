import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TodayActions } from './today.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { GratitudeService } from '../../services/gratitude.service';

@Injectable()
export class TodayEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(GratitudeService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodayActions.load),
      switchMap(() =>
        this.api.getToday().pipe(
          map((entry) => TodayActions.loadSuccess({ entry })),
          catchError(() => of(TodayActions.loadFailure({ error: 'Cannot load today' }))),
        )
      )
    )
  );
}
