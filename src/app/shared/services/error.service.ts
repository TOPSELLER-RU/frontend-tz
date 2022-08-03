import { Injectable } from "@angular/core";
import {Observable, Subject, Subscription, tap, throwError} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class ErrorService {

  public error$ = new Subject()
  aSub?: Subscription;

  constructor(
    private toastr: ToastrService
  ){

    this.aSub = this.error$.subscribe(error => {
      this.handleError(error);
    })

  }

  public error(text: string) {
    this.error$.next({text})
  }

  public httpError(error: HttpErrorResponse): void {
    if (error.error.errors) {
      for (let err of error.error.errors) {
        this.handleError({text: err.message});
      }
    } else {
      this.handleError({text: error.error.error});
    }
  }

  private handleError(error: any): Observable<any>{
    // console.log(error);
    // console.log("HERE");
    this.toastr.error(error.text)
    return throwError(() => new Error(error.text));
  }

}
