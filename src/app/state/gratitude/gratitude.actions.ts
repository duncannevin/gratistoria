import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Gratitude } from '../../models/gratitude.model';

export const DiaryActions = createActionGroup({
  source: 'Diary',
  events: {
    'Load All': emptyProps(),
    'Load All Success': props<{ items: Gratitude[]; nextToken: string | null }>(),
    'Load All Failure': props<{ error: string }>(),

    'Create': props<{ entry: string }>(),
    'Create Success': props<{ created: Gratitude | null }>(),
    'Create Failure': props<{ error: string }>(),

    'Upsert One': props<{ entity: Gratitude }>(),

    // Pagination
    'Load More': emptyProps(),
    'Load More Success': props<{ items: Gratitude[]; nextToken: string | null }>(),
    'Load More Failure': props<{ error: string }>(),
  },
});
