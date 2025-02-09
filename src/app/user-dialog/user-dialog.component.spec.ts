import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserDialogComponent } from './user-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { USER, EMPTY_USER, UPDATED_USER } from '../mocks/user';

describe('UserDialogComponent', () => {
  let component: UserDialogComponent;
  let fixture: ComponentFixture<UserDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<UserDialogComponent>>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [UserDialogComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule,
        MatDialogModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
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

    fixture = TestBed.createComponent(UserDialogComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with user data', () => {
    component.ngOnInit(); // Ensure form is initialized correctly

    expect(component.userForm.value).toEqual({
      ...USER,
    });
  });

  it('should initialize an empty form if no user data is provided', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [UserDialogComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.userForm.value).toEqual(EMPTY_USER);
  });

  it('should mark form as invalid if required fields are empty', () => {
    component.userForm.setValue(EMPTY_USER);
    expect(component.userForm.valid).toBeFalse();
  });

  it('should validate email format', () => {
    component.userForm.controls['email'].setValue('invalid-email');
    fixture.detectChanges();
    expect(component.userForm.controls['email'].valid).toBeFalse();
  });

  it('should validate phone number format', () => {
    component.userForm.controls['phone'].setValue('1234567890');
    fixture.detectChanges();

    expect(component.userForm.controls['phone'].valid).toBeTrue();
  });

  it('should close the dialog with updated user data on save', () => {
    component.userForm.setValue({
      ...UPDATED_USER,
    });
    component.onSave();
    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      ...UPDATED_USER,
    });
  });

  it('should not close the dialog if form is invalid on save', () => {
    component.userForm.setValue({ id: 1, name: '', email: '', phone: '' });
    component.onSave();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should close the dialog without saving when cancel is clicked', () => {
    const cancelButton = fixture.debugElement.query(By.css('.cancel-button'));
    cancelButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(dialogRefSpy.close).toHaveBeenCalledTimes(1);
  });
});
