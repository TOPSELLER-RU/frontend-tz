import {Injectable} from "@angular/core";
import {Expense} from "../interfaces";
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(
    private errorService: ErrorService,
    private http: HttpClient
  ) {
  }

  getUri(id?: string) {
    return `${environment.apiUrl}expenses${id ? '/'+id : ''}`;
  }

  getList(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.getUri()).pipe(
      // catchError()
    );
  }

  get(id: string): Observable<Expense> {
    if (id === 'new') {
      return  of({
        name: '',
        description: '',
      });
    }
    return this.http.get<Expense>(this.getUri(id)).pipe(
      // catchError()
    );
  }

  create(expense: Expense): Observable<void> {
    return this.http.post<void>(this.getUri(), expense).pipe(
      // catchError(this.handleError.bind(this))
    );
  }

  update(expense: Expense): Observable<void> {
    return this.http.patch<void>(this.getUri(), expense).pipe(
      // catchError()
    );
  }

  delete(expense: Expense): Observable<void> {
    return this.http.delete<void>(this.getUri(expense.id)).pipe(
      // catchError()
    );
  }
}
