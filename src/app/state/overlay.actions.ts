import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const OverlayActions = createActionGroup({
  source: 'Overlay',
  events: {
    'Show': props<{ message?: string }>(),
    'Hide': emptyProps(),
    'Set Message': props<{ message: string | null }>(),
  },
});

