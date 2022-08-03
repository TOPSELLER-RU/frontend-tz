import { ProductGroup } from './../../../shared/interfaces';
import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {PaginatedProducts, Product} from "../../../shared/interfaces";
import {ErrorService} from "../../../shared/services/error.service";
import {ProductService} from "../../../shared/services/product.service";
import {UserService} from "../../../shared/services/user.service";
import { ProductGroupService } from './../../../shared/services/product-group.service';
import { ProductGroupComponent } from '../product-group/product-group.component';


@Component({
  selector: 'app-product',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  providers: [ProductGroupComponent]
})
export class ProductListComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  productsCopy: Product[] = [];
  productGroups: ProductGroup[] = [];
  formSubmitted = false;

  grantedView = false;
  grantedEdit = false;

  lSub?: Subscription;
  gSub?: Subscription;
  sSub?: Subscription

  constructor(
    private errorService: ErrorService,
    private productService: ProductService,
    private userService: UserService,
    private productGroupService: ProductGroupService,
  ) { }

  ngOnInit(): void {
    this.grantedView = this.userService.isGranted('ROLE_PRODUCT_VIEW');

    if (!this.grantedView) {
      this.errorService.error('Доступ запрещён');
      return;
    }

    this.grantedEdit = this.userService.isGranted('ROLE_PRODUCT_EDIT');

    this.gSub = this.productGroupService.getList().subscribe({
      next: (productGroups) => {
        this.productGroups = productGroups;
      }
    });

    this.listProducts();

  }

  ngOnDestroy(): void {
    if (this.lSub) {
      this.lSub.unsubscribe();
    }
  }

  public listProducts(groupId?: string) {
    this.lSub = this.productService.getList(groupId).subscribe({
      next: (paginatedProducts: PaginatedProducts) => {
        this.products = paginatedProducts.items;
        this.productsCopy = this.products;
      }
    });
  }
}
