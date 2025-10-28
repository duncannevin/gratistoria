import { storyPageFeature } from './story-page.reducer';

export const {
  selectStoryPageState,
  selectEntry,
  selectLoading,
  selectError,
} = storyPageFeature;

export const selectStory = selectEntry;
 
