import { createSelector } from '@ngrx/store';
import { diaryAdapter, diaryFeature } from './gratitude.reducer';

export const {
  selectDiaryState: selectGratitudeState,
  selectLoadingAll,
  selectCreating,
  selectErrorAll,
  selectErrorCreate,
} = diaryFeature as any;

// entity selectors
const entitySelectors = diaryAdapter.getSelectors(selectGratitudeState);

// Backward compatible: items list
export const selectItems = entitySelectors.selectAll;
export const selectEntities = entitySelectors.selectEntities;
export const selectIds = entitySelectors.selectIds;
export const selectCount = entitySelectors.selectTotal;

// by id selector factory
export const selectGratitudeById = (id: number) =>
  createSelector(selectEntities, (entities) => entities[id] ?? null);

// no today selectors here; see today.selectors.ts
