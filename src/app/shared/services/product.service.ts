import {Injectable} from "@angular/core";
import {
  ModificationAttribute,
  PaginatedProducts,
  Product,
  ProductDescription, ProductModification,
  ProductModificationValue
} from "../interfaces";
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private errorService: ErrorService,
    private http: HttpClient
  ) {
  }

  getUri(id?: string) {
    return `${environment.apiUrl}products${id ? '/'+id : ''}`;
  }

  getModificationsUri(id?: string) {
    return `${environment.apiUrl}modification-attributes${id ? '/'+id : ''}`;
  }

  getList(id?: string): Observable<PaginatedProducts> {
    let uri = this.getUri();
    if (id) {
      uri += `?filter[productGroup]=${id}`
    }

    return this.http.get<PaginatedProducts>(uri);
  }

  get(id: string): Observable<Product> {
    if (id === 'new') {
      return  of({
        id: undefined,
        name: '',
        sku: '',
        code: '',
        vat: undefined,
        isEnabled: false,
        weight: undefined,
        volume: undefined,
        isSet: false,
        brand: undefined,
        productGroup: {
          id: '',
          name: ''
        },
        images: [],
        barcodes: [],
        customFields: [],
        products: [],
        hasModification: false,
      });
    } else if (id === 'newSet') {
      return  of({
        id: undefined,
        name: '',
        sku: '',
        code: '',
        vat: undefined,
        isEnabled: false,
        weight: undefined,
        volume: undefined,
        isSet: true,
        brand: undefined,
        productGroup: {
          id: '',
          name: ''
        },
        images: [],
        barcodes: [],
        customFields: [],
        products: [],
        hasModification: false,
      });
    }
    return this.http.get<Product>(this.getUri(id));
  }

  create(product: Product): Observable<void> {
    return this.http.post<void>(this.getUri(), product);
  }

  update(product: Product): Observable<void> {
    return this.http.patch<void>(this.getUri(), product);
  }

  delete(product: Product): Observable<void> {
    return this.http.delete<void>(this.getUri(product.id));
  }

  search(term: string) {
    if (term === '') {
      return of([]);
    }

    return this.http
      .get<Product[]>(this.getUri()+'/searchByName?q='+term);
  }

  getDescription(product: Product): Observable<ProductDescription> {
    return this.http.get<ProductDescription>(this.getUri(product.id)+'/descriptions/0');
  }

  saveDescription(product: Product, description: ProductDescription): Observable<void> {
    return this.http.patch<void>(this.getUri(product.id)+'/descriptions', description);
  }

  getModificationAttributes(): Observable<ModificationAttribute[]> {
    return this.http.get<ModificationAttribute[]>(this.getModificationsUri());
  }

  getModifications(product: Product) {
    return this.http.get<ProductModification[]>(this.getUri(product.id)+'/modifications');
  }

  createModifications(product: Product, modifications: ProductModification[]) {
    return this.http.post<ProductModificationValue[]>(this.getUri(product.id)+'/modifications', modifications);
  }
}
