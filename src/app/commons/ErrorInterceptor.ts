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
                this.toastService.error(error.message)
                this.commonService.distroySpinner();
                console.log(error.message);
                return Observable.throw(error);
            })) as any;
    }
}