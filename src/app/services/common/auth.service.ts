import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from 'src/app/models/LoginRequest';
import { RegisterRequest } from 'src/app/models/RegisterRequest';
import { CommonService } from './common.service';
import { Router } from '@angular/router';
import { FacebookLoginProvider, SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";

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
    return this.http.post(environment.apiUrl+"Authentication/login/", request);
  }

  public registerEvent(request: RegisterRequest){
    return this.http.post(environment.apiUrl+"Authentication/register/", request);
  }

  public logOut(){
    this.commonSerivce.setLocalStorage(environment.tokenName, signOutVal);
    this.router.navigate(['/']);
  }

  public signInWithGoogle = ()=> {
    return this._externalAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  public signInWitFacebook = ()=> {
    return this._externalAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  public signOutExternal = () => {
    this._externalAuthService.signOut();
  }
}
