import { createAction, props } from '@ngrx/store';
import { User } from '../models/user.model';

// Load Users
export const loadUsers = createAction('[User] Load Users');
export const loadUsersSuccess = createAction(
  '[User] Load Users Success',
  props<{ users: User[] }>()
);
export const loadUsersFailure = createAction(
  '[User] Load Users Failure',
  props<{ error: string }>()
);

// Add User
export const addUser = createAction('[User] Add User', props<{ user: User }>());
export const addUserSuccess = createAction(
  '[User] Add User Success',
  props<{ user: User }>()
);
export const addUserFailure = createAction(
  '[User] Add User Failure',
  props<{ error: string }>()
);

// Edit User
export const editUser = createAction(
  '[User] Edit User',
  props<{ user: User }>()
);
export const editUserSuccess = createAction(
  '[User] Edit User Success',
  props<{ user: User }>()
);
export const editUserFailure = createAction(
  '[User] Edit User Failure',
  props<{ error: string }>()
);

// Delete User
export const deleteUser = createAction(
  '[User] Delete User',
  props<{ user: User }>()
);
export const deleteUserSuccess = createAction(
  '[User] Delete User Success',
  props<{ user: User }>()
);
export const deleteUserFailure = createAction(
  '[User] Delete User Failure',
  props<{ error: string }>()
);
