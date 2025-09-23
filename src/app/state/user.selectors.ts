import { userFeature } from './user.reducer';

export const {
  selectUserState,
  selectUser,
  selectAuthenticated,
} = userFeature;

export const selectResolved = userFeature.selectResolved;
