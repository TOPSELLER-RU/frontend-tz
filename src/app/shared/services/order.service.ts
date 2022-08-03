import { Injectable } from '@angular/core';
import {Order, Organization, Product, Project, Warehouse, OrderLog, Comment} from "../interfaces";
import {map, Observable, of, tap} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private errorService: ErrorService,
    private http: HttpClient
  ) { }

  getUri(id?: string) {
    return `${environment.apiUrl}orders${id ? '/'+id : ''}`;
  }

  getList(): Observable<Order[]> {
    return this.http.get<Order[]>(this.getUri()).pipe(
      // catchError()
    );
  }

  get(id: string): Observable<Order> {
    if (id === 'new') {
      return  of({
        id: undefined,
        number: '',
        draft: false,
        orderAt: (new Date().getTime() / 1000),
        plannedAt: 0,
        organization: undefined,
        counterparty: undefined,
        warehouse: undefined,
        project: undefined,
        address: '',
        reserved: false,
        shipped: false,
        return: false,
        amountShipped: 0,
        amountReturn: 0,
        amount: 0,
        status: undefined,
        tags: [],
        orderProducts: [],
        images: [],
      });
    }
    return this.http.get<Order>(this.getUri(id)).pipe(
      // catchError()
    );
  }

  create(order: Order): Observable<void> {
    return this.http.post<void>(this.getUri(), order).pipe(
      // catchError(this.handleError.bind(this))
    );
  }

  update(order: Order): Observable<void> {
    return this.http.patch<void>(this.getUri(), order).pipe(
      // catchError()
    );
  }

  delete(order: Order): Observable<void> {
    return this.http.delete<void>(this.getUri(order.id)).pipe(
      // catchError()
    );
  }

  getLogs(order: Order): Observable<OrderLog[]> {
    return this.http.get<OrderLog[]>(this.getUri(order.id)+'/log').pipe(
      // catchError()
    );
  }

  commentCreate(order: Order, log: Comment): Observable<OrderLog> {
    return this.http.post<OrderLog>(this.getUri(order.id)+'/comment', log).pipe(
    );
  }

  commentUpdate(order: Order, log: Comment): Observable<OrderLog> {
    return this.http.patch<OrderLog>(this.getUri(order.id)+'/comment', log).pipe(
    );
  }

  shipmentAll(order: Order) {
    return this.http.get<Order>(this.getUri(order.id)+'/shipmentAll').pipe(
      //catchError();
    )
  }

  shipment(order: Order) {
    return this.http.post<Order>(this.getUri(order.id)+'/shipment', order).pipe(
      //catchError();
    )
  }

  return(order: Order) {
    return this.http.post<Order>(this.getUri(order.id)+'/return', order).pipe(
      // catchError()
    );
  }

  getNumber(): Observable<string> {
    return this.http.get<string>(this.getUri()+'/number').pipe(
      // catchError()
    );
  }

}
