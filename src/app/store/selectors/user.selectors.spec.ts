import * as UserSelectors from './user.selectors';
import { UserState } from '../reducers/user.reducer';
import { USER } from '../../mocks/user';

describe('User Selectors', () => {
  const initialState: UserState = {
    users: [USER],
    loading: false,
    error: null,
  };

  it('should select the user state', () => {
    const result = UserSelectors.selectUserState.projector(initialState);
    expect(result).toEqual(initialState);
  });

  it('should select users from state', () => {
    const result = UserSelectors.selectUsers.projector(initialState);
    expect(result).toEqual([USER]);
  });

  it('should select loading state', () => {
    const result = UserSelectors.selectLoading.projector(initialState);
    expect(result).toBeFalse();
  });

  it('should select error state', () => {
    const result = UserSelectors.selectError.projector(initialState);
    expect(result).toBeNull();
  });
});
