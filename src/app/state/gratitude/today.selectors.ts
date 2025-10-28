import { todayFeature } from './today.reducer';

export const {
  selectTodayState,
  selectEntry,
  selectLoading,
  selectError,
} = todayFeature;

export const selectToday = selectEntry;
 
