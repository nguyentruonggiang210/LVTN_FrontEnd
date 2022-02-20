import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss']
})
export class RegisterDialogComponent {

  registerFormGroup = new FormGroup({
    userName: new FormControl('', [
      Validators.required
    ]),
    name: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/),
    ]),
  }, {
    validators: this.matchPassword
  });

  constructor(public dialogRef: MatDialogRef<RegisterDialogComponent>) { }

  closeDialogEvent(): void {
    this.dialogRef.close();
  }

  registerEvent(): void {
    console.log(this.registerFormGroup);
  }

  matchPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.get("password").value;
    const confirm = control.get("confirmPassword").value;
    return (password != confirm) ? { 'confirm': true } : null;
  }

  get userName() {
    return this.registerFormGroup.get('userName');
  }

  get name() {
    return this.registerFormGroup.get('name');
  }

  get password() {
    return this.registerFormGroup.get('password');
  }

  get confirmPassword() {
    return this.registerFormGroup.get('confirmPassword');
  }
}
