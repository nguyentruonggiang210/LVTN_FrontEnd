import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { ExternalAuthDto } from 'src/app/models/ExternalAuthDto';
import { LoginRequest } from 'src/app/models/LoginRequest';
import { LoginResponse } from 'src/app/models/LoginResponse';
import { AuthService } from 'src/app/services/common/auth.service';
import { CommonService } from 'src/app/services/common/common.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {

  // userName: string = '';
  // password: string = '';
  user: SocialUser;
  isSignedin: boolean = null;

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
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private authService: AuthService,
    private commonService: CommonService,
    private router: Router,
    private socialAuthService: SocialAuthService) { }

  ngOnInit() {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.isSignedin = (user != null);
    });
  }

  closeDialogEvent(): void {
    this.dialogRef.close();
  }

  loginEvent(): void {
    var request = <LoginRequest>{
      userName: this.loginFormGroup.value['userName'],
      passWord: this.loginFormGroup.value['password']
    };

    this.authService.loginEvent(request)
      .subscribe(x => {
        if (x) {
          this.setToken(x);
        }
      });

  }

  googleLogin() {
    debugger
    this.authService.signInWithGoogle().then(res => {
      const user: SocialUser = { ...res };

      console.log(user);

      const externalAuth: ExternalAuthDto = {
        provider: user.provider,
        idToken: user.idToken,
        email: null,
        facebookId: null,
        firstName: null,
        lastName: null,
        pictureUrl: null,
      }

      this.validateExternalAuth(externalAuth);
    });
  }

  facebookLogin() {
    this.authService.signInWitFacebook().then(res => {
      const user: SocialUser = { ...res };

      console.log(user);

      const externalAuth: ExternalAuthDto = {
        provider: user.provider,
        idToken: null,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        pictureUrl: user.photoUrl,
        facebookId: user.id
      }

      this.validateExternalAuth(externalAuth);
    });
  }

  get userName() {
    return this.loginFormGroup.get('userName');
  }

  get password() {
    return this.loginFormGroup.get('password');
  }

  private validateExternalAuth(externalAuth: ExternalAuthDto) {
    this.authService.externalLogin(externalAuth)
      .subscribe(res => {
        if (res) {
          this.setToken(res);
        }
      });
  }

  private setToken(x: any) {
    let obj = <BaseResponse<LoginResponse>>x;
    let token = obj?.body?.token;
    this.commonService.setLocalStorage(environment.tokenName, token);
    this.commonService.displaySnackBar('Login success', 'Close');
    window.location.reload();
  }
}

