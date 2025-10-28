import { createSelector } from '@ngrx/store';
import { diaryAdapter, diaryFeature } from './gratitude.reducer';

export const selectGratitudeState = diaryFeature.selectDiaryState;
export const selectLoadingAll = diaryFeature.selectLoadingAll;
export const selectLoadingMore = diaryFeature.selectLoadingMore;
export const selectCreating = diaryFeature.selectCreating;
export const selectErrorAll = diaryFeature.selectErrorAll;
export const selectErrorCreate = diaryFeature.selectErrorCreate;

// entity selectors
const entitySelectors = diaryAdapter.getSelectors(selectGratitudeState);

// Backward compatible: items list
export const selectItems = entitySelectors.selectAll;
export const selectEntities = entitySelectors.selectEntities;
export const selectIds = entitySelectors.selectIds;
export const selectCount = entitySelectors.selectTotal;

// by id selector factory
export const selectGratitudeById = (id: string) =>
  createSelector(selectEntities, (entities) => entities[id] ?? null);

// paging selectors
export const selectNextToken = createSelector(selectGratitudeState, (s) => s.nextToken);
export const selectHasMore = createSelector(selectNextToken, (t) => !!t);

// no today selectors here; see today.selectors.ts
 
