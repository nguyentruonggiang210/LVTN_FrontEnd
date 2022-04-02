import { Injectable, Type } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../services/common/common.service';
import { ErrorResponse } from '../models/ErrorResponse';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(public toastService: ToastrService, private commonService: CommonService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req)
            .pipe(catchError((error, caught) => {
                if (error.error.body) {
                    this.toastService.error(error.error.error)
                    this.commonService.distroySpinner();
                }
                else {
                    this.toastService.error(error.message)
                    this.commonService.distroySpinner();
                }

                console.log(error);

                return Observable.throw(error);
            })) as any;
    }

    instanceOf<A>(object: any): object is A {
        return 'member' in object;
    }

}