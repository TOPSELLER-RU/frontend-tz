import {Injectable} from "@angular/core";
import {SettlementAccount} from "../interfaces";
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class SettlementAccountService {

  constructor(
    private errorService: ErrorService,
    private http: HttpClient
  ) {
  }

  getUri(organizationId: string, id?: string) {
    return `${environment.apiUrl}organizations/${organizationId}/settlement-accounts${id ? '/'+id : ''}`;
  }

  getList(organizationId: string): Observable<SettlementAccount[]> {
    return this.http.get<SettlementAccount[]>(this.getUri(organizationId)).pipe(
      // catchError()
    );
  }

  get(organizationId: string, id: string): Observable<SettlementAccount> {
    if (id === 'new') {
      return  of({
        bank: {
          bik: undefined,
          name: '',
          address: '',
          correspondentAccount: '',
        },
        settlementAccount: '',
        isDefault: false,
      });
    }
    return this.http.get<SettlementAccount>(this.getUri(organizationId, id)).pipe(
      // catchError()
    );
  }

  create(organizationId: string, account: SettlementAccount): Observable<void> {
    return this.http.post<void>(this.getUri(organizationId), account).pipe(
      // catchError(this.handleError.bind(this))
    );
  }

  update(organizationId: string, account: SettlementAccount): Observable<void> {
    return this.http.patch<void>( this.getUri(organizationId), account).pipe(
      // catchError()
    );
  }

  delete(organizationId: string, account: SettlementAccount): Observable<void> {
    return this.http.delete<void>(this.getUri(organizationId, account.id)).pipe(
      // catchError()
    );
  }
}
