import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonService } from '../services/common/common.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/common/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private commonService: CommonService,
    private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.commonService.getLocalStorage(environment.tokenName);

    if (!token || token == null || token == undefined) {
      return next.handle(req);
    }

    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next.handle(authReq);
  }
}