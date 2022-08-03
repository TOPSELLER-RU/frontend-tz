import {Injectable} from "@angular/core";
import {Brand} from "../interfaces";
import {Observable} from "rxjs";
import {of} from "rxjs";

import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(
    private errorService: ErrorService,
    private http: HttpClient
  ) {
  }

  getUri(id?: number) {
    return `${environment.apiUrl}brands${id ? '/'+id : ''}`;
  }

  getList(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.getUri()).pipe(
      // catchError()
    );
  }

  create(brand: Brand): Observable<Brand> {
    return this.http.post<Brand>(this.getUri(), brand).pipe(
      // catchError(this.handleError.bind(this))
    );
  }

  update(brand: Brand): Observable<Brand> {
    return this.http.patch<Brand>(this.getUri(), brand).pipe(
      // catchError()
    );
  }

  delete(brand: Brand): Observable<any> {
    return this.http.delete<any>(this.getUri(brand.id)).pipe(
      // catchError()
    );
  }

  search(term: string) {
    if (term === '') {
      return of([]);
    }

    return this.http.get<Brand[]>(this.getUri()+'?q='+term).pipe()
  }
}
