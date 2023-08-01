import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 400:
            if (error.error.errors) {
              const modelStateErrors = [];
              for (const key in error.error.errors) {
                if (error.error.errors[key]) {
                  modelStateErrors.push(error.error.errors[key]);
                }
              }
              for (const errorInModel in modelStateErrors) {
                if (modelStateErrors.hasOwnProperty(errorInModel)) {
                  this.toastr.error(modelStateErrors[errorInModel]);
                }
              }
              throw modelStateErrors.flat();
            } else if (typeof (error.error) === 'object') {
              this.toastr.error(error.error.title, error.status.toString());
            } else {
              this.toastr.error(error.error, error.status.toString());
            } break;
          case 401:
            this.toastr.error(error.error.title, error.status.toString());
            break;
          case 404:
            this.router.navigateByUrl('/not-found');
            break;
          case 500:
            const navigationExtras: NavigationExtras = { state: { error: error.error } };
            this.router.navigateByUrl('/server-error', navigationExtras);
            break;
          default:
            this.toastr.error('Something unexpected went wrong', 'ERROR');
            console.log(error);
            break;
        }

        return throwError(() => error);
      })
    );
  }
}
