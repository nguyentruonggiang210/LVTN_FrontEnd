import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const token = localStorage.token; // you probably want to store it in localStorage or something
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJqdGkiOiI1YzFlMmE1Ny1hYzZlLTQyYTgtOTJiMy0yMTAxOWVjMTcwOTEiLCJleHAiOjE2NDIzMzU3NDcsImlzcyI6IkZpdG5lc3MuSXNzdWVyIiwiYXVkIjoiRml0bmVzcy5Jc3N1ZXIifQ.aS7RQSqUco6mir2ZilHpVcCK2oPyAgtWlCsFEsMqI30";
    if (!token) {
      return next.handle(req);
    }
    
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });

    return next.handle(authReq);
  }
}