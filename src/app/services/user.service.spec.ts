import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { User } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call editUser and return the updated user', () => {
    const updatedUser: User = {
      id: 1,
      name: 'John Doe Updated',
      email: 'john.updated@example.com',
      phone: '123-456-7890',
    };

    service.editUser(updatedUser).subscribe((user) => {
      expect(user).toEqual(updatedUser);
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/users/${updatedUser.id}`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedUser);
    req.flush(updatedUser);
  });

  it('should call deleteUser and return the deleted user', () => {
    const userToDelete: User = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
    };

    service.deleteUser(userToDelete).subscribe((user) => {
      expect(user).toEqual(userToDelete);
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/users/${userToDelete.id}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush(userToDelete);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call addUser and return the added user', () => {
    const newUser: User = {
      id: 3,
      name: 'Sam Smith',
      email: 'sam@example.com',
      phone: '111-222-3333',
    };

    service.addUser(newUser).subscribe((user) => {
      expect(user).toEqual(newUser);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/users`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush(newUser);
  });

  it('should fetch users as an Observable', () => {
    const dummyUsers: User[] = [
      {
        id: 1,
        name: 'John Doe',
        phone: '923842234',
        email: 'john@example.com',
      },
      {
        id: 2,
        name: 'Jane Doe',
        phone: '092382084',
        email: 'jane@example.com',
      },
    ];

    service.getUsers().subscribe((users) => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/users`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });
});
