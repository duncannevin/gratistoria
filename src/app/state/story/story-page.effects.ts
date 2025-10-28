import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { StoryPageActions } from './story-page.actions';
import { StoryService } from '../../services/story.service';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class StoryPageEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(StoryService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StoryPageActions.load),
      switchMap(({ id }) =>
        this.api.getStoryById(id).pipe(
          map((story) => StoryPageActions.loadSuccess({ story })),
          catchError(() => of(StoryPageActions.loadFailure({ error: 'Cannot load story' }))),
        )
      )
    )
  );
}
