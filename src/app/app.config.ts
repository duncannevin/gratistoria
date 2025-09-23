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
import { userFeature } from './state/user.reducer';
import { storyPageFeature } from './state/story-page.reducer';
import { StoryPageEffects } from './state/story-page.effects';
import { UserEffects } from './state/user.effects';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore(),
    provideState(diaryFeature),
    provideState(todayFeature),
    provideState(storyFeature),
    provideState(userFeature),
    provideState(storyPageFeature),
    provideEffects(DiaryEffects),
    provideEffects(TodayEffects),
    provideEffects(StoryEffects),
    provideEffects(StoryPageEffects),
    provideEffects(UserEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode(), connectInZone: true }),
  ],
};
