import * as fromActions from './user.actions';
import { User } from '../models/user.model';
import { USER } from 'src/app/mocks/user';

describe('User Actions', () => {
  const mockUser: User = {
    ...USER,
  };

  const mockError = 'Error occurred';

  // Load Users
  it('should create LoadUsers action', () => {
    const action = fromActions.loadUsers();
    expect(action.type).toBe('[User] Load Users');
  });

  it('should create LoadUsersSuccess action with users', () => {
    const action = fromActions.loadUsersSuccess({ users: [mockUser] });
    expect(action.type).toBe('[User] Load Users Success');
    expect(action.users).toEqual([mockUser]);
  });

  it('should create LoadUsersFailure action with error', () => {
    const action = fromActions.loadUsersFailure({ error: mockError });
    expect(action.type).toBe('[User] Load Users Failure');
    expect(action.error).toBe(mockError);
  });

  // Add User
  it('should create AddUser action', () => {
    const action = fromActions.addUser({ user: mockUser });
    expect(action.type).toBe('[User] Add User');
    expect(action.user).toEqual(mockUser);
  });

  it('should create AddUserSuccess action', () => {
    const action = fromActions.addUserSuccess({ user: mockUser });
    expect(action.type).toBe('[User] Add User Success');
    expect(action.user).toEqual(mockUser);
  });

  it('should create AddUserFailure action', () => {
    const action = fromActions.addUserFailure({ error: mockError });
    expect(action.type).toBe('[User] Add User Failure');
    expect(action.error).toBe(mockError);
  });

  // Edit User
  it('should create EditUser action', () => {
    const action = fromActions.editUser({ user: mockUser });
    expect(action.type).toBe('[User] Edit User');
    expect(action.user).toEqual(mockUser);
  });

  it('should create EditUserSuccess action', () => {
    const action = fromActions.editUserSuccess({ user: mockUser });
    expect(action.type).toBe('[User] Edit User Success');
    expect(action.user).toEqual(mockUser);
  });

  it('should create EditUserFailure action', () => {
    const action = fromActions.editUserFailure({ error: mockError });
    expect(action.type).toBe('[User] Edit User Failure');
    expect(action.error).toBe(mockError);
  });

  // Delete User
  it('should create DeleteUser action', () => {
    const action = fromActions.deleteUser({ user: mockUser });
    expect(action.type).toBe('[User] Delete User');
    expect(action.user).toEqual(mockUser);
  });

  it('should create DeleteUserSuccess action', () => {
    const action = fromActions.deleteUserSuccess({ user: mockUser });
    expect(action.type).toBe('[User] Delete User Success');
    expect(action.user).toEqual(mockUser);
  });

  it('should create DeleteUserFailure action', () => {
    const action = fromActions.deleteUserFailure({ error: mockError });
    expect(action.type).toBe('[User] Delete User Failure');
    expect(action.error).toBe(mockError);
  });
});
