import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {
  Counterparty,
  Organization, Project,
  Order, OrderLog,
  Product,
  OrderProduct, Status, Tag, Warehouse, Comment, ProductOfSet, ProductImage,
} from "../../../shared/interfaces";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  Observable, of,
  OperatorFunction,
  Subscription,
  switchMap,
  tap
} from "rxjs";
import {FormControl, Validators, FormArray, FormGroup} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";

import {CounterpartyService} from "../../../shared/services/counterparty.service";
import {ErrorService} from "../../../shared/services/error.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ImageService} from "../../../shared/services/image.service";
import {OrderService} from 'app/shared/services/order.service';
import {OrganizationService} from "../../../shared/services/organization.service";
import {ProductService} from "../../../shared/services/product.service";
import {ProjectService} from "../../../shared/services/project.service";
import {OrderLogService} from 'app/shared/services/order-log.service';
import {StatusService} from "../../../shared/services/status.service";
import {TagService} from "../../../shared/services/tag.service";
import {UserService} from "../../../shared/services/user.service";
import {WarehouseService} from "../../../shared/services/warehouse.service";

class ImageSnippet {
  pending: boolean = false;
  status: string = 'INIT';

  constructor(public src: string, public file: File) {}
}

class OrderProductFormGroup  extends FormGroup{

  public amount: number = 0;

  constructor(
    public productId: string,
    public productName: string,
    public productSku: string,
    public productCode: string,
    quantity: number,
    price: number,
    vat: number,
    public shipOrder: number,
    public returnOrder: number,
  ) {
    super({
      quantity: new FormControl(quantity, [Validators.required, Validators.min(1)]),
      price: new FormControl(price, [Validators.required, Validators.min(1)]),
      vat: new FormControl(vat, [Validators.required]),
    });

    this.amount = quantity * price;
  }
}

class OrderShipmentFormGroup  extends FormGroup{
  constructor(
    public productId: string,
    public productName: string,
    public productSku: string,
    public productCode: string,
    public maxQuantity: number
  ) {
    super({
      count: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(maxQuantity)]),
    });
  }
}

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss']
})
export class OrderEditComponent implements OnInit, OnDestroy {



  cSub? :Subscription;
  cpSub? :Subscription;
  dSub? :Subscription;
  nSub? :Subscription;
  olSub?: Subscription;
  orderSub?: Subscription;
  oSub? :Subscription;
  pSub? :Subscription;
  sSub? :Subscription;
  uSub? :Subscription;
  wSub? :Subscription;


  constructor(
    public window: Window,
    private errorService: ErrorService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private counterpartyService: CounterpartyService,
    private organizationService: OrganizationService,
    private productService: ProductService,
    private projectService: ProjectService,
    private orderLogService: OrderLogService,
    private orderService: OrderService,
    private statusService: StatusService,
    private tagService: TagService,
    public userService: UserService,
    private warehouseService: WarehouseService,
    private imageService: ImageService,
  ) { }

  get address() {
    return this.orderForm?.get('address');
  }
  get number() {
    return this.orderForm?.get('number');
  }
  get draft() {
    return this.orderForm?.get('draft');
  }
  get orderAt() {
    return this.orderForm?.get('orderAt');
  }
  get plannedAt() {
    return this.orderForm?.get('plannedAt');
  }
  get reserved() {
    return this.orderForm?.get('reserved');
  }
  get status() {
    return this.orderForm?.get('status');
  }
  get organization() {
    return this.orderForm?.get('organization');
  }
  get counterparty() {
    return this.orderForm?.get('counterparty');
  }
  get warehouse() {
    return this.orderForm?.get('warehouse');
  }
  get project() {
    return this.orderForm?.get('project');
  }
  get orderProducts() {
    return this.orderForm?.get('orderProducts') as FormArray<OrderProductFormGroup>;
  }
  get shipmentProducts() {
    return this.shipmentForm?.get('shipmentProducts') as FormArray<OrderShipmentFormGroup>;
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    if (this.cSub) {
      this.cSub.unsubscribe();
    }
    if (this.cpSub) {
      this.cpSub.unsubscribe();
    }
    if (this.dSub) {
      this.dSub.unsubscribe();
    }
    if (this.nSub) {
      this.nSub.unsubscribe();
    }
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
    if (this.olSub) {
      this.olSub.unsubscribe();
    }
    if (this.orderSub) {
      this.orderSub.unsubscribe();
    }
    if (this.pSub) {
      this.pSub.unsubscribe();
    }
    if (this.sSub) {
      this.sSub.unsubscribe();
    }
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
    if (this.wSub) {
      this.wSub.unsubscribe();
    }
  }

  save() {

  }


  toList() {
    this.router.navigate(['/orders']).then(() => {});
  }


  modelProductFormat(item: Product) {
    return item.name
  }

  selectSearchProduct(event: any) {
    if (event.item) {
      this.selectedProduct = event.item;
    }
  }

  addProductToPurchase() {

  }

  removeFromPurchase(id?: number) {

  }

  searchProduct: OperatorFunction<any, readonly Product[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap((term) => {
        this.selectedProduct = undefined;
        if (term.length > 2) {
          this.searchingProduct = true;
        }
      }),
      switchMap(term =>

        term.length < 3 ? []

        : this.productService.search(term).pipe(

          tap(() => {
            return this.searchProductFailed = false;
          }),
          catchError(() => {
            this.searchProductFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => this.searchingProduct = false)
    )

}
