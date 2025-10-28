import { createFeature, createReducer, on } from '@ngrx/store';
import { UserActions } from './user.actions';
import { UserModel } from '@models/user.model';

export interface UserState {
  user: UserModel | null;
  authenticated: boolean;
  resolved: boolean;
}

const initialState: UserState = {
  user: null,
  authenticated: false,
  resolved: false,
};

const reducer = createReducer(
  initialState,
  on(UserActions.loginSuccess, (state, { user }) => ({ ...state, user, authenticated: true, resolved: true })),
  on(UserActions.loginFailure, (state) => ({ ...state, authenticated: false, resolved: true })),
  on(UserActions.getUser, (state) => ({ ...state, resolved: false })),
  on(UserActions.getUserSuccess, (state, { user }) => ({ ...state, user, authenticated: true, resolved: true })),
  on(UserActions.getUserFailure, (state) => ({ ...state, authenticated: false, resolved: true })),
  on(UserActions.logout, () => ({ ...initialState, resolved: true })),
);

export const userFeature = createFeature({
  name: 'user',
  reducer,
});
