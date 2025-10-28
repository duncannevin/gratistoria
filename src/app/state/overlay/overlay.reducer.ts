import { createFeature, createReducer, on } from '@ngrx/store';
import { OverlayActions } from './overlay.actions';

export interface OverlayState {
  visible: boolean;
  message: string | null;
  icon: string | null;
}

const initialState: OverlayState = {
  visible: false,
  message: null,
  icon: null,
};

const reducer = createReducer(
  initialState,
  on(OverlayActions.show, (state, { message, icon }) => ({
    ...state,
    visible: true,
    message: message ?? state.message,
    icon: icon ?? state.icon,
  })),
  on(OverlayActions.hide, (state) => ({ ...state, visible: false })),
  on(OverlayActions.setMessage, (state, { message }) => ({ ...state, message })),
  on(OverlayActions.setIcon, (state, { icon }) => ({ ...state, icon })),
);

export const overlayFeature = createFeature({
  name: 'overlay',
  reducer,
});
 
