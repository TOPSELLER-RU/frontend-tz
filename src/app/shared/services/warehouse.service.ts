import {Injectable} from "@angular/core";
import {Warehouse} from "../interfaces";
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  constructor(
    private errorService: ErrorService,
    private http: HttpClient
  ) {
  }

  getUri(id?: string) {
    return `${environment.apiUrl}warehouses${id ? '/'+id : ''}`;
  }

  getList(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(this.getUri()).pipe(
      // catchError()
    );
  }

  get(id: string): Observable<Warehouse> {
    if (id === 'new') {
      return  of({
        name: '',
        description: '',
        isDefault: false,
      });
    }
    return this.http.get<Warehouse>(this.getUri(id)).pipe(
      // catchError()
    );
  }

  create(warehouse: Warehouse): Observable<void> {
    return this.http.post<void>(this.getUri(), warehouse).pipe(
      // catchError(this.handleError.bind(this))
    );
  }

  update(warehouse: Warehouse): Observable<void> {
    return this.http.patch<void>(this.getUri(), warehouse).pipe(
      // catchError()
    );
  }

  delete(warehouse: Warehouse): Observable<void> {
    return this.http.delete<void>(this.getUri(warehouse.id)).pipe(
      // catchError()
    );
  }
}
