import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from './store/services/user.service';
import { User } from './models/user.model';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import {
  loadUsers,
  addUser,
  deleteUser,
  editUser,
} from './store/actions/user.actions';
import { AppState } from './store/reducers/app.state';
import { selectUsers, selectLoading } from './store/selectors/user.selectors';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  users$ = this.store.select(selectUsers);
  loading$ = this.store.select(selectLoading);

  users: User[] = [];
  dataSource: MatTableDataSource<User> = new MatTableDataSource();

  private onDestroy = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    public userService: UserService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.users$.pipe(takeUntil(this.onDestroy)).subscribe((users) => {
      this.users = users;
    });

    this.store.dispatch(loadUsers());
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  addUser(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
    });

    const id = this.users.length + 1;
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(addUser({ user: { id, ...result } }));
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
        this.store.dispatch(editUser({ user: updatedUser }));
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
        this.store.dispatch(deleteUser({ user }));
      }
    });
  }
}
