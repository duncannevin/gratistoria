import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideState } from '@ngrx/store';
import { diaryFeature, DiaryEffects, todayFeature, TodayEffects, storyFeature, StoryEffects, storyPageFeature, StoryPageEffects, userFeature, UserEffects, overlayFeature } from '@state';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@services/auth.interceptor';

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
    provideState(overlayFeature),
    provideEffects(DiaryEffects),
    provideEffects(TodayEffects),
    provideEffects(StoryEffects),
    provideEffects(StoryPageEffects),
    provideEffects(UserEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode(), connectInZone: true }),
  ],
};
