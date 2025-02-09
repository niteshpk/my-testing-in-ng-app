import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { User } from './models/user.model';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { AppState } from './store/reducers/app.state';
import {
  loadUsers,
  addUser,
  editUser,
  deleteUser,
} from './store/actions/user.actions';
import { selectUsers, selectLoading } from './store/selectors/user.selectors';
import { of } from 'rxjs';
import { USERS_LIST, USER } from './mocks/user';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let store: MockStore<AppState>;

  const mockUsers: User[] = [...USERS_LIST];
  const initialState = { users: [], loading: false };

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue({ afterClosed: () => of(null) } as any);

    await TestBed.configureTestingModule({
      imports: [MatDialogModule, HttpClientTestingModule, MatTableModule],
      declarations: [AppComponent],
      providers: [
        provideMockStore({ initialState }),
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy() } },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { user: { ...USER } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as MockStore<AppState>;

    store.overrideSelector(selectUsers, mockUsers);
    store.overrideSelector(selectLoading, false);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadUsers on init', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(loadUsers());
  });

  it('should select users from store', (done) => {
    component.users$.subscribe((users) => {
      expect(users).toEqual(mockUsers);
      done();
    });
  });

  it('should open dialog and dispatch addUser action', () => {
    const newUser: User = { ...USER, id: 3 };

    dialogSpy.open.and.returnValue({
      afterClosed: jasmine.createSpy().and.returnValue(of(newUser)),
    } as any);

    const dispatchSpy = spyOn(store, 'dispatch');
    component.addUser();

    expect(dialogSpy.open).toHaveBeenCalledWith(UserDialogComponent, {
      width: '400px',
      disableClose: true,
    });
    expect(dispatchSpy).toHaveBeenCalledWith(addUser({ user: newUser }));
  });

  it('should open dialog and dispatch editUser action', () => {
    const updatedUser: User = {
      id: 1,
      name: 'Updated John',
      email: 'updated@example.com',
      phone: '9876543210',
    };

    dialogSpy.open.and.returnValue({
      afterClosed: () => of(updatedUser),
    } as any);

    const dispatchSpy = spyOn(store, 'dispatch');
    component.editUser(mockUsers[0]);

    expect(dialogSpy.open).toHaveBeenCalledWith(UserDialogComponent, {
      width: '400px',
      disableClose: true,
      data: { user: mockUsers[0] },
    });

    expect(dispatchSpy).toHaveBeenCalledWith(editUser({ user: updatedUser }));
  });

  it('should open confirm dialog and dispatch deleteUser action', () => {
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(true),
    } as any);

    const dispatchSpy = spyOn(store, 'dispatch');
    component.deleteUser(mockUsers[0]);

    expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      width: '350px',
      data: {
        message: `Are you sure you want to delete ${mockUsers[0].name}?`,
      },
      disableClose: true,
    });

    expect(dispatchSpy).toHaveBeenCalledWith(
      deleteUser({ user: mockUsers[0] })
    );
  });

  it('should not add user if dialog is closed without data', () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(null) } as any);
    const dispatchSpy = spyOn(store, 'dispatch');

    component.addUser();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should not edit user if dialog is closed without data', () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(null) } as any);
    const dispatchSpy = spyOn(store, 'dispatch');

    component.editUser(mockUsers[0]);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should not delete user if confirmation is cancelled', () => {
    dialogSpy.open.and.returnValue({ afterClosed: () => of(false) } as any);
    const dispatchSpy = spyOn(store, 'dispatch');

    component.deleteUser(mockUsers[0]);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should display loading state correctly', async () => {
    store.overrideSelector(selectLoading, true);
    store.refreshState();
    fixture.detectChanges();

    await fixture.whenStable();
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('.spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should render user list correctly', async () => {
    store.overrideSelector(selectUsers, mockUsers);
    fixture.detectChanges();

    await fixture.whenStable();
    fixture.detectChanges();

    const userElements = fixture.debugElement.queryAll(By.css('mat-row'));
    expect(userElements.length).toBe(mockUsers.length);
  });
});
