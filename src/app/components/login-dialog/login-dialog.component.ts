import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {

  // userName: string = '';
  // password: string = '';

  loginFormGroup = new FormGroup({
    userName: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/)
    ]),

  });
  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>) { }

  closeDialogEvent(): void {
    this.dialogRef.close();
  }

  loginEvent(): void {
    console.log(this.loginFormGroup);
  }

  get userName() {
    return this.loginFormGroup.get('userName');
  }

  get password() {
    return this.loginFormGroup.get('password');
  }
}

