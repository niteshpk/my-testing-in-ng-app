import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl + '/users');
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl + '/users', user);
  }

  editUser(user: User): Observable<User> {
    return this.http.put<User>(this.apiUrl + '/users/' + user.id, user);
  }

  deleteUser(user: User): Observable<User> {
    return this.http.delete<User>(this.apiUrl + '/users/' + user.id);
  }
}
