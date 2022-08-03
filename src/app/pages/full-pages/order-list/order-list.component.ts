import {Component, OnDestroy, OnInit} from '@angular/core';
import {Order} from "../../../shared/interfaces";
import {Subscription} from "rxjs";

import {ErrorService} from "../../../shared/services/error.service";
import { OrderService } from 'app/shared/services/order.service';
import {UserService} from "../../../shared/services/user.service";

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, OnDestroy {

  orders: Order[] = [];
  formSubmitted = false;
  lSub?: Subscription;

  grantedView = false;
  grantedEdit = false;

  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private errorService: ErrorService,
  ) { }

  ngOnInit(): void {

    this.grantedView = this.userService.isGranted('ROLE_ORDER_VIEW');
    if (!this.grantedView) {
      this.errorService.error('Доступ запрещён');
      return;
    }

    this.grantedEdit = this.userService.isGranted('ROLE_ORDER_EDIT');

    this.lSub = this.orderService.getList().subscribe({
      next: (order) => {
        this.orders = order;
      }
    })

  }

  ngOnDestroy(): void {

    if (this.lSub) {
      this.lSub.unsubscribe();
    }

  }

}
