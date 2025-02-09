import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { UserService } from './services/user.service';
import { of } from 'rxjs';
import { User } from './models/user.model';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { USER, USERS_LIST } from './mocks/user';
import { MatTableModule } from '@angular/material/table';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const mockUsers: User[] = [...USERS_LIST];

  beforeEach(async () => {
    const userServiceMock = jasmine.createSpyObj('UserService', [
      'getUsers',
      'addUser',
      'editUser',
      'deleteUser',
    ]);

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    dialogSpy.open.and.returnValue({
      afterClosed: () => of(null),
    } as any);

    userServiceMock.getUsers.and.returnValue(of(mockUsers));

    await TestBed.configureTestingModule({
      imports: [MatDialogModule, HttpClientTestingModule, MatTableModule],
      declarations: [AppComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy() } },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            user: {
              ...USER,
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize users in ngOnInit', () => {
    userService.getUsers.and.returnValue(of(mockUsers));

    component.ngOnInit();

    expect(userService.getUsers).toHaveBeenCalled();
    expect(component.users.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should open dialog and add user on addUser()', () => {
    const newUser: User = { ...USER, id: 3 };

    dialogSpy.open.and.returnValue({
      afterClosed: jasmine.createSpy().and.returnValue(of(newUser)),
    } as any);

    userService.addUser.and.returnValue(of(newUser));

    component.addUser();

    expect(dialogSpy.open).toHaveBeenCalledWith(UserDialogComponent, {
      width: '400px',
    });

    expect(userService.addUser).toHaveBeenCalledWith(newUser);
  });

  it('should open dialog and edit user on editUser()', () => {
    const updatedUser: User = {
      id: 1,
      name: 'Updated John',
      email: 'updated@example.com',
      phone: '9876543210',
    };

    dialogSpy.open.and.returnValue({
      afterClosed: () => of(updatedUser),
    } as any);

    userService.editUser.and.returnValue(of(updatedUser));

    component.editUser(mockUsers[0]);

    expect(dialogSpy.open).toHaveBeenCalledWith(UserDialogComponent, {
      width: '400px',
      data: { user: mockUsers[0] },
    });

    expect(userService.editUser).toHaveBeenCalledWith(updatedUser);
  });

  it('should open confirm dialog and delete user on deleteUser()', () => {
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(true),
    } as any);

    userService.deleteUser.and.returnValue(of({} as User));

    component.deleteUser(mockUsers[0]);

    expect(dialogSpy.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      width: '350px',
      data: {
        message: `Are you sure you want to delete ${mockUsers[0].name}?`,
      },
    });

    expect(userService.deleteUser).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('should not add user if dialog is closed without data', () => {
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(null),
    } as any);

    component.addUser();

    expect(userService.addUser).not.toHaveBeenCalled();
  });

  it('should not edit user if dialog is closed without data', () => {
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(null),
    } as any);

    component.editUser(mockUsers[0]);

    expect(userService.editUser).not.toHaveBeenCalled();
  });

  it('should not delete user if confirmation is cancelled', () => {
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(false),
    } as any);

    component.deleteUser(mockUsers[0]);

    expect(userService.deleteUser).not.toHaveBeenCalled();
  });

  it('should display loading state initially', () => {
    expect(component.loading).toBeFalse();
  });

  it('should render user list', async () => {
    userService.getUsers.and.returnValue(of(mockUsers));

    component.ngOnInit();
    fixture.detectChanges();

    await fixture.whenStable();
    fixture.detectChanges();

    const userElements = fixture.debugElement.queryAll(By.css('mat-row'));

    expect(userElements.length).toBe(mockUsers.length);
  });
});
