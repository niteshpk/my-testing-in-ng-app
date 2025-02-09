import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  user?: any;
}

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
})
export class UserDialogComponent implements OnInit {
  @HostListener('keydown.enter', ['$event'])
  onEnterPress(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.userForm = this.fb.group({
      id: [data?.user?.id || null],
      name: [data?.user?.name || null, Validators.required],
      email: [
        data?.user?.email || null,
        [Validators.required, Validators.email],
      ],
      phone: [data?.user?.phone || null, Validators.required],
    });
  }

  ngOnInit() {}

  onSave() {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
