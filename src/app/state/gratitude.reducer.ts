import { createFeature, createReducer, on } from '@ngrx/store';
import { Gratitude } from '../models/gratitude.model';
import { DiaryActions } from './gratitude.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

export interface DiaryState extends EntityState<Gratitude> {
  loadingAll: boolean;
  creating: boolean;
  errorAll: string | null;
  errorCreate: string | null;
}

export const diaryAdapter: EntityAdapter<Gratitude> = createEntityAdapter<Gratitude>({
  selectId: (g) => g.id,
});

const initialState: DiaryState = diaryAdapter.getInitialState({
  loadingAll: false,
  creating: false,
  errorAll: null,
  errorCreate: null,
});

const reducer = createReducer(
  initialState,
  on(DiaryActions.loadAll, (state) => ({ ...state, loadingAll: true, errorAll: null })),
  on(DiaryActions.loadAllSuccess, (state, { items }) =>
    diaryAdapter.setAll(items, { ...state, loadingAll: false })
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
);

export const diaryFeature = createFeature({
  name: 'diary',
  reducer,
});

export type { Gratitude };
