import {Injectable} from "@angular/core";
import {Department, Organization, OrderLog, Status} from "../interfaces";
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class OrderLogService {

  constructor(
    private errorService: ErrorService,
    private http: HttpClient
  ) { }

  getUri(orderId: string, id?: number) {
    return `${environment.apiUrl}orders${id ? '/'+id : ''}/log`;
  }

  getList(purchaseId: string): Observable<OrderLog[]> {
    return this.http.get<OrderLog[]>(this.getUri(purchaseId)).pipe(
      // catchError()
    );
  }

  create(orderId: string, log: OrderLog): Observable<OrderLog> {
    return this.http.post<OrderLog>(this.getUri(orderId), log).pipe(
    );
  }
}
