import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from 'src/app/models/LoginRequest';
import { RegisterRequest } from 'src/app/models/RegisterRequest';
import { CommonService } from './common.service';
import { Router } from '@angular/router';
import { FacebookLoginProvider, SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { ExternalAuthDto } from 'src/app/models/ExternalAuthDto';
import { BaseResponse } from 'src/app/models/BaseResponse';
import { TokenDto } from 'src/app/models/TokenDto';
import jwt_decode from 'jwt-decode';

const signOutVal = null;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
    private commonSerivce: CommonService,
    private router: Router,
    private _externalAuthService: SocialAuthService) { }

  public loginEvent(request: LoginRequest) {
    return this.http.post<BaseResponse<TokenDto>>(environment.apiUrl + "Authentication/login/", request);
  }

  public registerEvent(request: RegisterRequest) {
    return this.http.post(environment.apiUrl + "Authentication/register/", request);
  }

  public logOut() {
    this.commonSerivce.setLocalStorage(environment.tokenName, signOutVal);
    this.signOutExternal();
    this.router.navigate(['/']);
  }

  public signInWithGoogle = () => {
    return this._externalAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  public signInWitFacebook = () => {
    return this._externalAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  public signOutExternal = () => {
    this._externalAuthService.signOut();
  }

  public externalLogin = (request: ExternalAuthDto) => {
    return this.http.post(environment.apiUrl + "Authentication/external-login/", request);
  }

  public getDecodedAccessToken(token: string = null): any {
    if (token == null) {
      token = this.commonSerivce.getLocalStorage(environment.tokenName);
    }

    return jwt_decode(token);
  }

  public getUserId() {
    try {
      return this.getDecodedAccessToken()['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    }
    catch {
      return null;
    }
  }

  public getUserName() {
    try {
      return this.getDecodedAccessToken()['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    }
    catch {
      return null;
    }
  }

  public getRoles(){
    try {
      return this.getDecodedAccessToken()['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    }
    catch {
      return null;
    }
  }
}
