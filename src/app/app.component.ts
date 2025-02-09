import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from './services/user.service';
import { User } from './models/user.model';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'my-testing-in-ng-app';
  users: User[] = [];
  dataSource: MatTableDataSource<User> = new MatTableDataSource();
  loading: boolean = true;

  constructor(private dialog: MatDialog, public userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      this.loading = false;
      this.dataSource = new MatTableDataSource(data);
    });
  }

  addUser(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
    });

    const id = this.users.length + 1;
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.addUser(result).subscribe((user) => {
          user.id = id;
          this.users = [...this.users, user];
        });
      }
    });
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: { user },
    });

    dialogRef.afterClosed().subscribe((updatedUser) => {
      if (updatedUser) {
        this.userService.editUser(updatedUser).subscribe(() => {
          this.users = this.users.map((u) =>
            u.id === updatedUser.id ? updatedUser : u
          );
        });
      }
    });
  }

  deleteUser(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: `Are you sure you want to delete ${user.name}?` },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteUser(user).subscribe(() => {
          this.users = this.users.filter((u) => u.id !== user.id);
        });
      }
    });
  }
}
