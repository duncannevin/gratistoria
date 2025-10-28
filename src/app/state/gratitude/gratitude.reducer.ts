import { createFeature, createReducer, on } from '@ngrx/store';
import { Gratitude } from '../../models/gratitude.model';
import { DiaryActions } from './gratitude.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

export interface DiaryState extends EntityState<Gratitude> {
  loadingAll: boolean;
  loadingMore: boolean;
  creating: boolean;
  errorAll: string | null;
  errorCreate: string | null;
  nextToken: string | null;
}

export const diaryAdapter: EntityAdapter<Gratitude> = createEntityAdapter<Gratitude>({
  selectId: (g) => g.id,
});

const initialState: DiaryState = diaryAdapter.getInitialState({
  loadingAll: false,
  loadingMore: false,
  creating: false,
  errorAll: null,
  errorCreate: null,
  nextToken: null,
});

const reducer = createReducer(
  initialState,
  on(DiaryActions.loadAll, (state) => ({ ...state, loadingAll: true, errorAll: null })),
  on(DiaryActions.loadAllSuccess, (state, { items, nextToken }) =>
    diaryAdapter.setAll(items, { ...state, loadingAll: false, nextToken })
  ),
  on(DiaryActions.loadAllFailure, (state, { error }) => ({ ...state, loadingAll: false, errorAll: error })),

  on(DiaryActions.create, (state) => ({ ...state, creating: true, errorCreate: null })),
  on(DiaryActions.createSuccess, (state, { created }) => {
    const base = { ...state, creating: false };
    return created
      ? diaryAdapter.upsertOne(created, base)
      : base;
  }),
  on(DiaryActions.createFailure, (state, { error }) => ({ ...state, creating: false, errorCreate: error })),

  on(DiaryActions.upsertOne, (state, { entity }) => diaryAdapter.upsertOne(entity, state)),

  // pagination
  on(DiaryActions.loadMore, (state) => ({ ...state, loadingMore: true })),
  on(DiaryActions.loadMoreSuccess, (state, { items, nextToken }) =>
    diaryAdapter.addMany(items, { ...state, loadingMore: false, nextToken })
  ),
  on(DiaryActions.loadMoreFailure, (state, { error }) => ({ ...state, loadingMore: false, errorAll: error })),
);

export const diaryFeature = createFeature({
  name: 'diary',
  reducer,
});

export type { Gratitude };
