import { createFeature, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Story } from '../common/models/story.model';
import { StoryActions } from './story.actions';

export interface StoryState extends EntityState<Story> {
  loadingAll: boolean;
  errorAll: string | null;
  loadingById: Record<number, boolean>;
  errorById: Record<number, string | null>;
}

export const storyAdapter: EntityAdapter<Story> = createEntityAdapter<Story>({
  selectId: (s) => s.id,
});

const initialState: StoryState = storyAdapter.getInitialState({
  loadingAll: false,
  errorAll: null,
  loadingById: {},
  errorById: {},
});

const reducer = createReducer(
  initialState,
  on(StoryActions.loadAll, (state) => ({ ...state, loadingAll: true, errorAll: null })),
  on(StoryActions.loadAllSuccess, (state, { items }) => storyAdapter.setAll(items, { ...state, loadingAll: false })),
  on(StoryActions.loadAllFailure, (state, { error }) => ({ ...state, loadingAll: false, errorAll: error })),

  on(StoryActions.loadOne, (state, { id }) => ({
    ...state,
    loadingById: { ...state.loadingById, [id]: true },
    errorById: { ...state.errorById, [id]: null },
  })),
  on(StoryActions.loadOneSuccess, (state, { story }) => {
    const id = story?.id as number | undefined;
    const updated = id != null ? storyAdapter.upsertOne(story!, state) : state;
    const key = id ?? -1; // when null, we don't know id; keep maps untouched
    return {
      ...updated,
      loadingById: id != null ? { ...updated.loadingById, [id]: false } : updated.loadingById,
    };
  }),
  on(StoryActions.loadOneFailure, (state, { id, error }) => ({
    ...state,
    loadingById: { ...state.loadingById, [id]: false },
    errorById: { ...state.errorById, [id]: error },
  })),
);

export const storyFeature = createFeature({
  name: 'story',
  reducer,
});

