import {Injectable} from "@angular/core";
import {Purchase, PurchaseLog, Comment, PurchaseProduct} from "../interfaces";
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(
    private errorService: ErrorService,
    private http: HttpClient
  ) {
  }

  getUri(id?: string) {
    return `${environment.apiUrl}purchases${id ? '/'+id : ''}`;
  }

  getList(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(this.getUri()).pipe(
      // catchError()
    );
  }

  get(id: string): Observable<Purchase> {
    if (id === 'new') {
      return  of({
        id: undefined,
        number: '',
        draft: false,
        purchaseAt: (new Date()).getTime() / 1000,
        plannedAt: 0,
        amount: 0,
        amountCredited: 0,
        amountPayed: 0,
        amountReturn: 0,
        organization: undefined,
        counterparty: undefined,
        warehouse: undefined,
        project: undefined,
        purchaseProducts: [],
        tags: [],
        images: []
      });
    }
    return this.http.get<Purchase>(this.getUri(id)).pipe(
      // catchError()
    );
  }

  create(purchase: Purchase): Observable<void> {
    return this.http.post<void>(this.getUri(), purchase).pipe(
      // catchError(this.handleError.bind(this))
    );
  }

  update(purchase: Purchase): Observable<void> {
    return this.http.patch<void>(this.getUri(), purchase).pipe(
      // catchError()
    );
  }

  delete(purchase: Purchase): Observable<void> {
    return this.http.delete<void>(this.getUri(purchase.id)).pipe(
      // catchError()
    );
  }

  getLogs(purchase: Purchase): Observable<PurchaseLog[]> {
    return this.http.get<PurchaseLog[]>(this.getUri(purchase.id)+'/log').pipe(
      // catchError()
    );
  }

  commentCreate(purchase: Purchase, log: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.getUri(purchase.id)+'/comment', log).pipe(
    );
  }

  commentUpdate(purchase: Purchase, log: Comment): Observable<Comment> {
    return this.http.patch<Comment>(this.getUri(purchase.id)+'/comment', log).pipe(
    );
  }

  creditAll(purchase: Purchase) {
    return this.http.get<Purchase>(this.getUri(purchase.id)+'/creditAll').pipe(
      // catchError()
    );
  }

  credit(purchase: Purchase) {
    return this.http.post<Purchase>(this.getUri(purchase.id)+'/credit', purchase).pipe(
      // catchError()
    );
  }

  payAll(purchase: Purchase) {
    return this.http.get<Purchase>(this.getUri(purchase.id)+'/payAll').pipe(
      // catchError()
    );
  }

  pay(purchase: Purchase, amount: number) {
    return this.http.post<Purchase>(this.getUri(purchase.id)+'/pay', {amount: amount}).pipe(
      // catchError()
    );
  }

  return(purchase: Purchase) {
    return this.http.post<Purchase>(this.getUri(purchase.id)+'/return', purchase).pipe(
      // catchError()
    );
  }

  getNumber(): Observable<string> {
    return this.http.get<string>(this.getUri()+'/number').pipe(
      // catchError()
    );
  }

}
