import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Story } from '../models/story.model';

export const StoryActions = createActionGroup({
  source: 'Story',
  events: {
    'Load All': emptyProps(),
    'Load All Success': props<{ items: Story[] }>(),
    'Load All Failure': props<{ error: string }>(),

    'Load One': props<{ id: number }>(),
    'Load One Success': props<{ story: Story | null }>(),
    'Load One Failure': props<{ id: number; error: string }>(),
  },
});
