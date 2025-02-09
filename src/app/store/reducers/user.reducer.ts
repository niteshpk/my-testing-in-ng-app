import { createReducer, on } from '@ngrx/store';
import * as UserActions from '../actions/user.actions';
import { User } from '../models/user.model';

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const userReducer = createReducer(
  initialState,

  // Load Users
  on(UserActions.loadUsers, (state) => ({ ...state, loading: true })),
  on(UserActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false,
  })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // Add User
  on(UserActions.addUserSuccess, (state, { user }) => {
    return {
      ...state,
      users: [...state.users, user],
      loading: false,
    };
  }),

  // Edit User
  on(UserActions.editUserSuccess, (state, { user }) => {
    const updatedUsers = state.users.map((item) => {
      return item.id === user.id ? user : item;
    });

    return {
      ...state,
      users: updatedUsers,
      loading: false,
    };
  }),

  // Delete User
  on(UserActions.deleteUserSuccess, (state, { user }) => {
    const users = state.users.filter((item) => item.id !== user.id);

    return {
      ...state,
      users,
      loading: false,
    };
  })
);
