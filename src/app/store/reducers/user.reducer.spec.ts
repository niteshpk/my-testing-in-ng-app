import { userReducer, initialState } from './user.reducer';
import * as UserActions from '../actions/user.actions';
import { User } from '../models/user.model';
import { USER, USERS_LIST } from '../../mocks/user';

describe('User Reducer', () => {
  const mockUsers: User[] = [...USERS_LIST];

  it('should return initial state when an unknown action is dispatched', () => {
    const action = { type: 'UNKNOWN_ACTION' } as any;
    const state = userReducer(initialState, action);

    expect(state).toBe(initialState);
  });

  it('should set loading to true on loadUsers action', () => {
    const action = UserActions.loadUsers();
    const state = userReducer(initialState, action);

    expect(state.loading).toBeTrue();
  });

  it('should populate users and set loading to false on loadUsersSuccess', () => {
    const action = UserActions.loadUsersSuccess({ users: mockUsers });
    const state = userReducer(initialState, action);

    expect(state.users).toEqual(mockUsers);
    expect(state.loading).toBeFalse();
  });

  it('should set error and loading to false on loadUsersFailure', () => {
    const action = UserActions.loadUsersFailure({ error: 'Load failed' });
    const state = userReducer(initialState, action);

    expect(state.error).toBe('Load failed');
    expect(state.loading).toBeFalse();
  });

  it('should add a new user on addUserSuccess', () => {
    const action = UserActions.addUserSuccess({ user: USER });
    const state = userReducer(initialState, action);

    expect(state.users.length).toBe(1);
    expect(state.users).toContain(USER);
  });

  it('should update a user on editUserSuccess', () => {
    const updatedUser: User = { ...USER, name: 'Updated John' };
    const action = UserActions.editUserSuccess({ user: updatedUser });
    const state = userReducer({ ...initialState, users: mockUsers }, action);

    expect(state.users.find((user) => user.id === updatedUser.id)?.name).toBe(
      'Updated John'
    );
  });

  it('should delete a user on deleteUserSuccess', () => {
    const action = UserActions.deleteUserSuccess({ user: USER });
    const state = userReducer({ ...initialState, users: mockUsers }, action);

    expect(state.users.length).toBe(1);
    expect(state.users.find((user) => user.id === USER.id)).toBeUndefined();
  });
});
