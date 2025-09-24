import { createFeature, createReducer, on } from '@ngrx/store';
import { OverlayActions } from './overlay.actions';

export interface OverlayState {
  visible: boolean;
  message: string | null;
}

const initialState: OverlayState = {
  visible: false,
  message: null,
};

const reducer = createReducer(
  initialState,
  on(OverlayActions.show, (state, { message }) => ({ ...state, visible: true, message: message ?? state.message })),
  on(OverlayActions.hide, (state) => ({ ...state, visible: false })),
  on(OverlayActions.setMessage, (state, { message }) => ({ ...state, message })),
);

export const overlayFeature = createFeature({
  name: 'overlay',
  reducer,
});

