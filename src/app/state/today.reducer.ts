import { createFeature, createReducer, on } from '@ngrx/store';
import { TodayActions } from './today.actions';
import { Gratitude } from '../common/models/gratitude.model';

export interface TodayState {
  entry: Gratitude | null;
  loading: boolean;
  error: string | null;
}

const initialState: TodayState = {
  entry: null,
  loading: false,
  error: null,
};

const reducer = createReducer(
  initialState,
  on(TodayActions.load, (state) => ({ ...state, loading: true, error: null })),
  on(TodayActions.loadSuccess, (state, { entry }) => ({
    ...state,
    entry,
    loading: false,
  })),
  on(TodayActions.loadFailure, (state, { error }) => ({ ...state, entry: null, loading: false, error })),
);

export const todayFeature = createFeature({
  name: 'today',
  reducer,
});
