import { AppState, reducers } from './app.state';
import { userReducer, initialState as userInitialState } from './user.reducer';

describe('AppState Reducers', () => {
  it('should have userState reducer', () => {
    expect(reducers.userState).toBeDefined();
    expect(reducers.userState).toBe(userReducer);
  });

  it('should return the correct initial state for userState', () => {
    const appInitialState: AppState = {
      userState: userInitialState,
    };

    expect(appInitialState.userState).toEqual(userInitialState);
  });
});
