import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Gratitude } from '../models/gratitude.model';

export const TodayActions = createActionGroup({
  source: 'Today',
  events: {
    'Load': emptyProps(),
    'Load Success': props<{ entry: Gratitude | null }>(),
    'Load Failure': props<{ error: string }>(),
  },
});
