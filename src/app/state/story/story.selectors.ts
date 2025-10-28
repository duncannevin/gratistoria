import { createSelector } from '@ngrx/store';
import { storyAdapter, storyFeature } from './story.reducer';

export const {
  selectStoryState,
  selectLoadingAll,
  selectErrorAll,
} = storyFeature;

const entitySelectors = storyAdapter.getSelectors(selectStoryState);

export const selectStories = entitySelectors.selectAll;
export const selectStoryEntities = entitySelectors.selectEntities;
export const selectStoryIds = entitySelectors.selectIds;
export const selectStoryCount = entitySelectors.selectTotal;

export const selectStoryById = (id: number) =>
  createSelector(selectStoryEntities, (entities) => entities[id] ?? null);

export const selectLoadingById = (id: number) =>
  createSelector(selectStoryState, (s) => !!s.loadingById[id]);

export const selectErrorById = (id: number) =>
  createSelector(selectStoryState, (s) => s.errorById[id] ?? null);
 
