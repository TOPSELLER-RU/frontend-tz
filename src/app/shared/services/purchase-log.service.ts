import {Injectable} from "@angular/core";
import {Department, Organization, PurchaseLog, Status} from "../interfaces";
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class PurchaseLogService {

  constructor(
    private errorService: ErrorService,
    private http: HttpClient
  ) {
  }

  getUri(purchaseId: string, id?: number) {
    return `${environment.apiUrl}purchase-logs/${purchaseId}${id ? '/'+id : ''}`;
  }

  getList(purchaseId: string): Observable<PurchaseLog[]> {
    return this.http.get<PurchaseLog[]>(this.getUri(purchaseId)).pipe(
      // catchError()
    );
  }

  // get(id: string): Observable<Status> {
  //   if (id === 'new') {
  //     return  of({
  //       type: '',
  //       name: ''
  //     });
  //   }
  //   return this.http.get<Status>(this.getUri(parseInt(id))).pipe(
  //     // catchError()
  //   );
  // }
  //

  create(purchaseId: string, log: PurchaseLog): Observable<PurchaseLog> {
    return this.http.post<PurchaseLog>(this.getUri(purchaseId), log).pipe(
    );
  }

  //
  // update(status: Status): Observable<Status> {
  //   return this.http.patch<Status>(this.getUri(), status).pipe(
  //     // catchError()
  //   );
  // }
  //
  // delete(status: Status): Observable<void> {
  //   return this.http.delete<void>(this.getUri(status.id)).pipe(
  //     // catchError()
  //   );
  // }
}
