import { UserState, userReducer } from './user.reducer';

export interface AppState {
  userState: UserState;
}

export const reducers = {
  userState: userReducer,
};
