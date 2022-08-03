import {Injectable} from "@angular/core";
import {ProductGroup} from "../interfaces";
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class ProductGroupService {

  constructor(
    private errorService: ErrorService,
    private http: HttpClient
  ) {
  }

  getUri(id?: string) {
    return `${environment.apiUrl}product-groups${id ? '/'+id : ''}`;
  }

  getList(): Observable<ProductGroup[]> {
    return this.http.get<ProductGroup[]>(this.getUri()).pipe(
      // catchError()
    );
  }

  get(id: string): Observable<ProductGroup> {
    if (id === 'new') {
      return  of({
        name: '',
        productGroups: []
      });
    }
    return this.http.get<ProductGroup>(this.getUri(id)).pipe(
      // catchError()
    );
  }

  create(productGroup: ProductGroup): Observable<ProductGroup> {
    return this.http.post<ProductGroup>(this.getUri(), productGroup).pipe(
      // catchError(this.handleError.bind(this))
    );
  }

  update(productGroup: ProductGroup): Observable<ProductGroup> {
    return this.http.patch<ProductGroup>(this.getUri(), productGroup).pipe(
      // catchError()
    );
  }

  delete(productGroup: ProductGroup): Observable<void> {
    return this.http.delete<void>(this.getUri(productGroup.id)).pipe(
      // catchError()
    );
  }
}
