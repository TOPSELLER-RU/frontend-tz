import {Injectable} from "@angular/core";
import {Tag} from "../interfaces";
import {of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(
    private errorService: ErrorService,
    private http: HttpClient
  ) {
  }

  getUri(id?: number) {
    return `${environment.apiUrl}tags${id ? '/'+id : ''}`;
  }

  // getList(): Observable<PaginatedProducts> {
  //   return this.http.get<PaginatedProducts>(this.getUri()).pipe(
  //     // catchError()
  //   );
  // }

  // get(id: string): Observable<Product> {
  //   if (id === 'new') {
  //     return  of({
  //       id: undefined,
  //       name: '',
  //       sku: '',
  //       code: '',
  //       vat: undefined,
  //       isEnabled: false,
  //       weight: undefined,
  //       volume: undefined,
  //       isSet: false,
  //       brand: undefined,
  //       images: [],
  //       products: [],
  //       barcodes: [],
  //     });
  //   }
  //   return this.http.get<Product>(this.getUri(parseInt(id))).pipe(
  //     // catchError()
  //   );
  // }

  // create(product: Product): Observable<void> {
  //   return this.http.post<void>(this.getUri(), product).pipe(
  //     // catchError(this.handleError.bind(this))
  //   );
  // }
  //
  // update(product: Product): Observable<void> {
  //   return this.http.patch<void>(this.getUri(), product).pipe(
  //     // catchError()
  //   );
  // }
  //
  // delete(product: Product): Observable<void> {
  //   return this.http.delete<void>(this.getUri(product.id)).pipe(
  //     // catchError()
  //   );
  // }

  search(term: string) {
    if (term === '') {
      return of([]);
    }

    return this.http
      .get<Tag[]>(this.getUri()+'?q='+term).pipe();
  }
}
