import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../services/common/common.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(public toastService: ToastrService, private commonService: CommonService){ }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req)
            .pipe(catchError((error, caught) => {
                if(error.error){
                    this.toastService.error(error.error.error)
                    this.commonService.distroySpinner();
                    console.log(error);
                }
                else{
                    this.toastService.error(error.message)
                    this.commonService.distroySpinner();
                    console.log(error);
                }
               
                return Observable.throw(error);
            })) as any;
    }
}