import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { StoryActions } from './story.actions';
import { StoryService } from '@services/story.service';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class StoryEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(StoryService);

  loadAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StoryActions.loadAll),
      switchMap(() =>
        this.api.getStories().pipe(
          map((items) => StoryActions.loadAllSuccess({ items })),
          catchError(() => of(StoryActions.loadAllFailure({ error: 'Cannot load stories' }))),
        )
      )
    )
  );

  loadOne$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StoryActions.loadOne),
      switchMap(({ id }) =>
        this.api.getStoryById(id).pipe(
          map((story) => story !== null
            ? StoryActions.loadOneSuccess({ story })
            : StoryActions.loadOneFailure({ id, error: 'Not found' })
          ),
          catchError(() => of(StoryActions.loadOneFailure({ id, error: 'Cannot load story' }))),
        )
      )
    )
  );
}
