import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Gratitude } from '../models/gratitude.model';

export const DiaryActions = createActionGroup({
  source: 'Diary',
  events: {
    'Load All': emptyProps(),
    'Load All Success': props<{ items: Gratitude[] }>(),
    'Load All Failure': props<{ error: string }>(),

    'Create': props<{ entry: Omit<Gratitude, 'id'> }>(),
    'Create Success': props<{ created: Gratitude | null }>(),
    'Create Failure': props<{ error: string }>(),

    'Upsert One': props<{ entity: Gratitude }>(),
  },
});
