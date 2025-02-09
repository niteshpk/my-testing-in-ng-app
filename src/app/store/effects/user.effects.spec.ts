import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { UserEffects } from './user.effects';
import { UserService } from '../services/user.service';
import * as UserActions from '../actions/user.actions';
import { User } from '../models/user.model';
import { hot, cold } from 'jasmine-marbles';
import { USER } from '../../mocks/user';

describe('UserEffects', () => {
  let actions$: Observable<any>;
  let effects: UserEffects;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const userServiceMock = jasmine.createSpyObj('UserService', [
      'getUsers',
      'addUser',
      'editUser',
      'deleteUser',
    ]);

    TestBed.configureTestingModule({
      providers: [
        UserEffects,
        provideMockActions(() => actions$),
        { provide: UserService, useValue: userServiceMock },
      ],
    });

    effects = TestBed.inject(UserEffects);
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  // ✅ Load Users Effect
  it('should dispatch LoadUsersSuccess action on success', () => {
    const users: User[] = [USER];
    const action = UserActions.loadUsers();
    const successAction = UserActions.loadUsersSuccess({ users });

    actions$ = hot('-a', { a: action });
    userService.getUsers.and.returnValue(cold('-b', { b: users }));

    expect(effects.loadUsers$).toBeObservable(hot('--c', { c: successAction }));
  });

  it('should dispatch LoadUsersFailure action on error', () => {
    const error = 'Error fetching users';
    const action = UserActions.loadUsers();
    const failureAction = UserActions.loadUsersFailure({ error });

    actions$ = hot('-a', { a: action });
    userService.getUsers.and.returnValue(cold('-#', {}, new Error(error)));

    expect(effects.loadUsers$).toBeObservable(hot('--c', { c: failureAction }));
  });

  // ✅ Add User Effect
  it('should dispatch AddUserSuccess action on success', () => {
    const action = UserActions.addUser({ user: USER });
    const successAction = UserActions.addUserSuccess({ user: USER });

    actions$ = hot('-a', { a: action });
    userService.addUser.and.returnValue(cold('-b', { b: USER }));

    expect(effects.addUser$).toBeObservable(hot('--c', { c: successAction }));
  });

  it('should dispatch AddUserFailure action on error', () => {
    const error = 'Error adding user';
    const action = UserActions.addUser({ user: USER });
    const failureAction = UserActions.addUserFailure({ error });

    actions$ = hot('-a', { a: action });
    userService.addUser.and.returnValue(cold('-#', {}, new Error(error)));

    expect(effects.addUser$).toBeObservable(hot('--c', { c: failureAction }));
  });

  // ✅ Edit User Effect
  it('should dispatch EditUserSuccess action on success', () => {
    const updatedUser: User = { ...USER, name: 'Updated Name' };
    const action = UserActions.editUser({ user: updatedUser });
    const successAction = UserActions.editUserSuccess({ user: updatedUser });

    actions$ = hot('-a', { a: action });
    userService.editUser.and.returnValue(cold('-b', { b: updatedUser }));

    expect(effects.editUser$).toBeObservable(hot('--c', { c: successAction }));
  });

  it('should dispatch EditUserFailure action on error', () => {
    const error = 'Error editing user';
    const action = UserActions.editUser({ user: USER });
    const failureAction = UserActions.editUserFailure({ error });

    actions$ = hot('-a', { a: action });
    userService.editUser.and.returnValue(cold('-#', {}, new Error(error)));

    expect(effects.editUser$).toBeObservable(hot('--c', { c: failureAction }));
  });

  // ✅ Delete User Effect
  it('should dispatch DeleteUserSuccess action on success', () => {
    const action = UserActions.deleteUser({ user: USER });
    const successAction = UserActions.deleteUserSuccess({ user: USER });

    actions$ = hot('-a', { a: action });
    userService.deleteUser.and.returnValue(cold('-b', { b: {} }));

    expect(effects.deleteUser$).toBeObservable(
      hot('--c', { c: successAction })
    );
  });

  it('should dispatch DeleteUserFailure action on error', () => {
    const error = 'Error deleting user';
    const action = UserActions.deleteUser({ user: USER });
    const failureAction = UserActions.deleteUserFailure({ error });

    actions$ = hot('-a', { a: action });
    userService.deleteUser.and.returnValue(cold('-#', {}, new Error(error)));

    expect(effects.deleteUser$).toBeObservable(
      hot('--c', { c: failureAction })
    );
  });
});
