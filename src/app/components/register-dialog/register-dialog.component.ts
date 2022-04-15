import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { LoginResponse } from 'src/app/models/LoginResponse';
import { RegisterRequest } from 'src/app/models/RegisterRequest';
import { AuthService } from 'src/app/services/common/auth.service';
import { CommonService } from 'src/app/services/common/common.service';
import { UserDetailService } from 'src/app/services/detail/user-detail.service';
import { environment } from 'src/environments/environment';

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

  constructor(public dialogRef: MatDialogRef<RegisterDialogComponent>,
    private userDetailService: UserDetailService,
    private authService: AuthService,
    private commonService: CommonService) { }

  closeDialogEvent(): void {
    this.dialogRef.close();
  }

  registerEvent(): void {
    let model: RegisterRequest = {
      userName: this.registerFormGroup.value['userName'],
      name: this.registerFormGroup.value['name'],
      password: this.registerFormGroup.value['password'],
      confirmPassword: this.registerFormGroup.value['confirmPassword'],
    };

    this.authService.registerEvent(model)
      .subscribe(x => {
        this.commonService.displaySnackBar('Register success', 'Close');
        this.setToken(x);
      })
  }

  matchPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.get("password").value;
    const confirm = control.get("confirmPassword").value;
    return (password != confirm) ? { 'confirm': true } : null;
  }

  validateUserName() {
    let value = this.registerFormGroup.value['userName'];
    if (value == '' || value == null) {
      return;
    }
    this.userDetailService.checkUserNametExist(value)
      .subscribe(x => {
        if (x.body) {
          this.commonService.displaySnackBar('UserName exist', 'Close');
          this.registerFormGroup.controls['userName'].setErrors({ serverValidationError: true });
        }
      });
  }

  private setToken(x: any) {
    let obj = <BaseResponse<LoginResponse>>x;
    let token = obj?.body?.token;
    this.commonService.setLocalStorage(environment.tokenName, token)
    window.location.reload();
  }
}
