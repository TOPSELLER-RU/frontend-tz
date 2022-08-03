import {Injectable} from "@angular/core";
import {Counterparty} from "../interfaces";
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class CounterpartyService {

  constructor(
    private errorService: ErrorService,
    private http: HttpClient
  ) {
  }

  getUri(id?: string) {
    return `${environment.apiUrl}counterparties${id ? '/'+id : ''}`;
  }

  getList(): Observable<Counterparty[]> {
    return this.http.get<Counterparty[]>(this.getUri()).pipe(
      // catchError()
    );
  }

  get(id: string): Observable<Counterparty> {
    if (id === 'new') {
      return  of({
        name: '',
        phone: '',
        email: '',
        fullName: '',
        legalAddress: '',
        inn: '',
        kpp: '',
        ogrn: '',
        okpo: '',
        isFulfilment: false
      });
    }
    return this.http.get<Counterparty>(this.getUri(id)).pipe(
      // catchError()
    );
  }

  create(counterparty: Counterparty): Observable<void> {
    return this.http.post<void>(this.getUri(), counterparty).pipe(
      // catchError(this.handleError.bind(this))
    );
  }

  update(counterparty: Counterparty): Observable<void> {
    return this.http.patch<void>(this.getUri(), counterparty).pipe(
      // catchError()
    );
  }

  delete(counterparty: Counterparty): Observable<void> {
    return this.http.delete<void>(this.getUri(counterparty.id)).pipe(
      // catchError()
    );
  }
}
