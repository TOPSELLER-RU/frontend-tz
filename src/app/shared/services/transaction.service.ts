import { Injectable } from '@angular/core';
import { Transaction } from '../interfaces';
import {Observable, of} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(
    private errorService: ErrorService,
    private http: HttpClient
  ) { }

  getUri(id?: string) {
    return `${environment.apiUrl}transactions${id ? `/${id}` : ''}`;
  }

  getList(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.getUri()).pipe(
      //catchError();
    );
  }

  get(id: string): Observable<Transaction> {

    // if (id === 'new') {
      
    //   return of({
    //     id: undefined,
    //     draft: false,
    //     receive: false,
    //     purchase: undefined,
    //     order: undefined,
    //     warehouse: undefined,
    //     organization: undefined,
    //     project: undefined,
    //     createdBy: undefined,
    //     products: [],
    //     createdAt: (new Date()).getTime() / 1000,
    //     modifiedAt: (new Date()).getTime() / 1000,
    //     amount: 0,
        

    //   })
    // } else {
      return this.http.get<Transaction>(this.getUri(id)).pipe(
        //catchError();
      );
    // }

    
  }

  delete(transaction: Transaction): Observable<void> {
    return this.http.delete<void>(this.getUri(transaction.id)).pipe(
      // catchError()
    );
  }
}
