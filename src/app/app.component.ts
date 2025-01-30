import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'my-testing-in-ng-app';
  users: User[] = [];
  loading: boolean = true;

  constructor(public userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      this.loading = false;
    });
  }

  addUser(): void {
    const id = this.users.length + 1;

    this.userService
      .addUser({
        id,
        name: 'New User ' + id,
        email: 'email' + id + '@example.com',
        phone: '123-456-7890-' + id,
      })
      .subscribe((user) => {
        user.id = id;
        this.users = [...this.users, user];
      });
  }

  editUser(user: User): void {
    user.name += ' (edited)';
    this.userService.editUser(user).subscribe(() => {
      const index = this.users.findIndex((u) => u.id === user.id);
      this.users[index] = user;
    });
  }

  deleteUser(user: User): void {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (!confirmed) {
      return;
    }

    this.userService.deleteUser(user).subscribe(() => {
      this.users = this.users.filter((u) => u.id !== user.id);
    });
  }
}
