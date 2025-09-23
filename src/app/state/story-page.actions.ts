import { createActionGroup, props } from '@ngrx/store';
import { Story } from '../common/models/story.model';

export const StoryPageActions = createActionGroup({
  source: 'Story Page',
  events: {
    'Load': props<{ id: number }>(),
    'Load Success': props<{ story: Story | null }>(),
    'Load Failure': props<{ error: string }>(),
  },
});

