import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../reducers/user.reducer';

// Feature Selector
export const selectUserState = createFeatureSelector<UserState>('userState');

// Individual Selectors
export const selectUsers = createSelector(
  selectUserState,
  (state) => state.users
);
export const selectLoading = createSelector(
  selectUserState,
  (state) => state.loading
);
export const selectError = createSelector(
  selectUserState,
  (state) => state.error
);
