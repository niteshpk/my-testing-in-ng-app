import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from './services/user.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { User } from './models/user.model';

describe('AppComponent', () => {
  let userService: UserService;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, HttpClientModule],
      declarations: [AppComponent],
      providers: [HttpClient, UserService],
    }).compileComponents();
  });

  beforeEach(() => {
    userService = TestBed.inject(UserService);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display "No users found" when there are no users', () => {
    component.loading = false;
    component.users = [];
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const noUsersMessage = compiled.querySelector(
      '.user-table tbody tr td'
    )?.textContent;
    expect(noUsersMessage).toBe('No users found');
  });

  it('should call editUser method when edit button is clicked', () => {
    spyOn(component, 'editUser');
    component.loading = false;
    component.users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
      },
    ];
    fixture.detectChanges();
    const editButton = fixture.debugElement.query(
      By.css('.user-table tbody tr td button.edit-btn')
    ).nativeElement;
    editButton.click();
    expect(component.editUser).toHaveBeenCalledWith(component.users[0]);
  });

  it('should call deleteUser method when delete button is clicked and user confirms', () => {
    const user: User = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
    };

    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component, 'deleteUser').and.callThrough();
    spyOn(userService, 'deleteUser').and.returnValue(of(user));

    component.loading = false;
    component.users = [user];
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(
      By.css('.user-table tbody tr td button.delete-btn')
    ).nativeElement;
    deleteButton.click();

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete John Doe?'
    );
    expect(component.deleteUser).toHaveBeenCalledWith(user);
    expect(userService.deleteUser).toHaveBeenCalledWith(user);
  });

  it('should not call deleteUser method when delete button is clicked and user cancels', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(component, 'deleteUser').and.callThrough();
    spyOn(component.userService, 'deleteUser');

    component.loading = false;
    component.users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
      },
    ];
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(
      By.css('.user-table tbody tr td button.delete-btn')
    ).nativeElement;
    deleteButton.click();

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete John Doe?'
    );

    expect(component.deleteUser).toHaveBeenCalledWith(component.users[0]);
    expect(component.userService.deleteUser).not.toHaveBeenCalled();
  });

  it('should call getUsers on initialization', () => {
    spyOn(userService, 'getUsers').and.returnValue(of([]));
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(userService.getUsers).toHaveBeenCalled();
  });

  it('should display the loading spinner when loading is true', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.loading = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.spinner')).toBeTruthy();
  });

  it('should display the user table when loading is false', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.loading = false;
    app.users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
      },
    ];
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.user-table')).toBeTruthy();
    expect(compiled.querySelectorAll('.user-table tbody tr').length).toBe(1);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'my-testing-in-ng-app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('my-testing-in-ng-app');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain(
      'my-testing-in-ng-app app is running!'
    );
  });
});
