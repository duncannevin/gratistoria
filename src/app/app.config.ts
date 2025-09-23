import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideState } from '@ngrx/store';
import { diaryFeature } from './state/gratitude.reducer';
import { DiaryEffects } from './state/gratitude.effects';
import { todayFeature } from './state/today.reducer';
import { TodayEffects } from './state/today.effects';
import { storyFeature } from './state/story.reducer';
import { StoryEffects } from './state/story.effects';
import { storyPageFeature } from './state/story-page.reducer';
import { StoryPageEffects } from './state/story-page.effects';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore(),
    provideState(diaryFeature),
    provideState(todayFeature),
    provideState(storyFeature),
    provideState(storyPageFeature),
    provideEffects(DiaryEffects),
    provideEffects(TodayEffects),
    provideEffects(StoryEffects),
    provideEffects(StoryPageEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode(), connectInZone: true }),
  ],
};
