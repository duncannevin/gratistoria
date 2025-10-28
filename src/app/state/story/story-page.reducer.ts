import { createFeature, createReducer, on } from '@ngrx/store';
import { Story } from '@models/story.model';
import { StoryPageActions } from './story-page.actions';

export interface StoryPageState {
  entry: Story | null;
  loading: boolean;
  error: string | null;
}

const initialState: StoryPageState = {
  entry: null,
  loading: false,
  error: null,
};

const reducer = createReducer(
  initialState,
  on(StoryPageActions.load, (state) => ({ ...state, loading: true, error: null })),
  on(StoryPageActions.loadSuccess, (state, { story }) => ({ ...state, entry: story, loading: false })),
  on(StoryPageActions.loadFailure, (state, { error }) => ({ ...state, entry: null, loading: false, error })),
);

export const storyPageFeature = createFeature({
  name: 'storyPage',
  reducer,
});
