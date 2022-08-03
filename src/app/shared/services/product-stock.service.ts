import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ErrorService} from "./error.service";
import { ProductStock } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductStockService {

  constructor(
    private errorService: ErrorService,
    private http: HttpClient
  ) { }

  getUri(id?: number) {
    return `${environment.apiUrl}product-stock${id ? '/'+id : ''}`;
  }

  get(id: number | string) {
    if (id === 'new') {
      return of({
        id: undefined,
        warehouse: undefined,
        product: undefined,
        count: 0,
      })
    } else {
      //@ts-ignore
      return this.http.get<ProductStock>(this.getUri(id)).pipe(
        // catchError();
      );
    }
  }

  getList() : Observable<ProductStock[]> {
    return this.http.get<ProductStock[]>(this.getUri()).pipe(
      // catchError()
    );
  }

  create(stock: ProductStock): Observable<ProductStock> {
    return this.http.post<ProductStock>(this.getUri(), stock).pipe (
      // catchError()
    );
  }

  update(stock: ProductStock): Observable<ProductStock> {
    return this.http.patch<ProductStock>(this.getUri(), stock).pipe (
      // catchError()
    );
  }

  delete(stock: ProductStock): Observable<any> {
    return this.http.delete<any>(this.getUri(stock.id)).pipe (
      // catchError()
    );
  }

  getByWarehouse(id: string): Observable<ProductStock[]> {
    return this.http.get<ProductStock[]>(`${this.getUri()}/warehouse/${id}`);
  }

  getByProduct(id: string): Observable<ProductStock[]> {
    return this.http.get<ProductStock[]>(`${this.getUri()}/product/${id}`);
  }
}
