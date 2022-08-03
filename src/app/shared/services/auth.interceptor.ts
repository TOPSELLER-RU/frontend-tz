import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {catchError, Observable, throwError} from "rxjs";
import {ErrorService} from "./error.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private errorService: ErrorService,
    private router: Router,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!(/\/(login|refresh|signup)$/).test(req.url)) {
      const token = this.authService.token;
      // console.log('INTERCEPTOR');
      if (!!token) {
        // console.log('INTERCEPTOR TRUE');
        req = req.clone({
          setHeaders: {
            Authorization: 'Bearer ' + token
          }
        });
      }
    }

    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // console.log('INTERCEPTOR CATCH ERROR');
          // console.log('[Interceptor error]:', error);
          if (error.status && error.status === 401) {
            // console.log('INTERCEPTOR LOGOUT')
            this.authService.logout();
            this.router.navigate(['/login']).finally();
          }

          this.errorService.httpError(error);

          return throwError(() => {new Error(error.error)});
        })
      )

  }
}
