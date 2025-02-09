import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [ConfirmDialogComponent],
      imports: [MatDialogModule, NoopAnimationsModule], // Needed for Material components
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { message: 'Are you sure?' } }, // Mock dialog data
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct message', () => {
    const messageElement = fixture.debugElement.query(
      By.css('mat-dialog-content p')
    ).nativeElement;
    expect(messageElement.textContent.trim()).toBe('Are you sure?');
  });

  it('should call onCancel and close the dialog with false', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('should call onConfirm and close the dialog with true', () => {
    component.onConfirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should trigger onCancel when Cancel button is clicked', () => {
    spyOn(component, 'onCancel');
    const cancelButton = fixture.debugElement.query(
      By.css('button[mat-button]')
    );
    cancelButton.nativeElement.click();
    expect(component.onCancel).toHaveBeenCalled();
  });

  it('should trigger onConfirm when Delete button is clicked', () => {
    spyOn(component, 'onConfirm');
    const confirmButton = fixture.debugElement.query(
      By.css('button[mat-raised-button]')
    );
    confirmButton.nativeElement.click();
    expect(component.onConfirm).toHaveBeenCalled();
  });
});
