import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ToastrService} from "ngx-toastr";
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
import {
  FormBuilder,
  FormControl,
  Validators,
  FormArray, FormGroup
} from "@angular/forms";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {NgxSpinnerService} from "ngx-spinner";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

import {
  Barcode,
  Brand, Marketplace, ModificationAttribute,
  Product, ProductCustomField, ProductDescription,
  ProductImage, ProductModification, ProductModificationValue,
  ProductOfSet,
  ProductSetItem
} from "../../../shared/interfaces";
import {BrandService} from "../../../shared/services/brand.service";
import {ErrorService} from "../../../shared/services/error.service";
import {MarketplaceService} from "../../../shared/services/marketplace.service";
import {ImageService} from "../../../shared/services/image.service";
import {ProductService} from "../../../shared/services/product.service";
import {UserService} from "../../../shared/services/user.service";
import {ProductGroup} from "../../../shared/interfaces";
import {ProductGroupService} from "../../../shared/services/product-group.service";
import { ProductGroupComponent } from '../product-group/product-group.component';
import { ProductStockService } from '../../../shared/services/product-stock.service';

class ImageSnippet {
  pending: boolean = false;
  status: string = 'INIT';

  constructor(public src: string, public file: File) {}
}

class SetItemFormControl extends FormControl {
  constructor (
    public productId: string,
    public name: string,
    public sku: string,
    public code: string,
    public price: number|undefined,
    quantity: number,
    editable: boolean,
  ) {
    super({value: quantity, disabled: !editable}, [Validators.required, Validators.min(1)]);
  }
}

class CustomFieldFormGroup extends FormGroup {
  constructor (
    public fieldId: string|undefined,
    name: string,
    type: string,
    value: string,
    editable: boolean,
  ) {
    super({
      name: new FormControl({value: name, disabled: (!!fieldId || !editable)}, [Validators.required]),
      type: new FormControl({value: type, disabled: (!!fieldId || !editable)}, [Validators.required]),
      value: new FormControl({value: value, disabled: !editable}, [Validators.required]),
    });
  }
}

class CustomPriceFormGroup extends FormGroup {
  constructor (
    public fieldId: string | undefined,
    name: string,
    type: string,
    value: string,
    editable: boolean,
  ) {
    super({
      priceName: new FormControl({ value: name, disabled: !editable || !!fieldId}),
      priceType: new FormControl({ value: type, disabled: true }),
      priceValue: new FormControl({ value: value, disabled: !editable }, [Validators.required])
    })
  }
}

class ProductModificationsFormGroup extends FormGroup {
  constructor (
    public modificationId?: number|undefined,
    name?: string | undefined,
  ) {
    super({
      name: new FormControl(name, [Validators.required]),
      values: new FormArray([
        new FormControl('')
      ]),
    });
  }
}

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
  providers: [ProductGroupComponent]
})
export class ProductEditComponent implements OnInit, OnDestroy {
  public product?: Product;
  public brands: Brand[] = [];
  public marketplaces: Marketplace[] = [];

  public searchProductText = '';
  public searching = false;
  public searchFailed = false;

  public productForm: FormGroup | undefined;
  public formSubmitted = false;

  public grantedView = false;
  public grantedEdit = false;
  public grantedDelete = false;


  public productGroup?: {
    id: string,
    name: string
  }
  public isEditGroup: boolean = true;
  public productGroups: ProductGroup[] = []

  public products: Product[] = [];
  public productsCopy: Product[] = [];
  public searchingBrand = false;
  public searchBrandText: Brand|string = '';
  public selectedBrand?: Brand;
  public searchBrandFailed = false;

  public modificationAttributes: ModificationAttribute[] = [];
  public modificationsForm: FormGroup | undefined;
  public modificationsCount = 0;
  public modificationsSubmitted = false;

  private selectedProduct?: Product;
  private selectedFile?: ImageSnippet;

  public descriptionForm: FormGroup | undefined;
  public descriptionFormSubmitted = false;
  public productDescription?: ProductDescription;

  cSub? :Subscription;
  gSub? :Subscription;
  dSub? :Subscription;
  lSub?: Subscription;
  mSub?: Subscription;
  uSub? :Subscription;
  catalogSub?: Subscription;
  stockSub?: Subscription;
  descriptionViewSub?: Subscription;
  descriptionSaveSub?: Subscription;
  modificationsListSub?: Subscription;
  modificationsSaveSub?: Subscription;


  @ViewChild('confirmModal', { read: TemplateRef })
  confirmModal?: ElementRef;

  @ViewChild('descriptionModal', { read: TemplateRef })
  descriptionModal?: ElementRef;

  @ViewChild('editGroup', { read: TemplateRef })
  editGroup?: ElementRef;

  @ViewChild('catalogModal', { read: TemplateRef })
  catalogModal?: ElementRef;

  @ViewChild('modificationsModal', { read: TemplateRef })
  modificationsModal?: ElementRef;

  constructor(
    public window: Window,
    private brandService: BrandService,
    private errorService: ErrorService,
    private fb: FormBuilder,
    private imageService: ImageService,
    private marketplaceService: MarketplaceService,
    private modalService: NgbModal,
    private productGroupService: ProductGroupService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private userService: UserService,
    private stockService: ProductStockService,
  ) { }

  get name() {
    return this.productForm?.get('name');
  }
  get sku() {
    return this.productForm?.get('sku');
  }
  get code() {
    return this.productForm?.get('code');
  }
  get vat() {
    return this.productForm?.get('vat');
  }
  get isEnabled() {
    return this.productForm?.get('isEnabled');
  }
  get weight() {
    return this.productForm?.get('weight');
  }
  get volume() {
    return this.productForm?.get('volume');
  }
  get length() {
    return this.productForm?.get('length');
  }
  get width() {
    return this.productForm?.get('width');
  }
  get height() {
    return this.productForm?.get('height');
  }
  get color() {
    return this.productForm?.get('color');
  }
  get price() {
    return this.productForm?.get('price');
  }
  get priceSale() {
    return this.productForm?.get('priceSale');
  }
  get priceMin() {
    return this.productForm?.get('priceMin');
  }
  get priceRrp() {
    return this.productForm?.get('priceRrp');
  }
  get pricePurchase() {
    return this.productForm?.get('pricePurchase');
  }
  get barcodes() {
    return this.productForm?.controls['barcodes'] as FormArray;
  }
  get productSetItems() {
    return this.productForm?.get('productSetItems') as FormArray<SetItemFormControl>;
  }
  get customFields() {
    return this.productForm?.get('customFields') as FormArray<CustomFieldFormGroup>;
  }
  get customPrices() {
    return this.productForm?.get('customPrices') as FormArray<CustomPriceFormGroup>
  }

  get modifications() {
    return this.modificationsForm?.get('modifications') as FormArray;
  }

  modificationValues(index: number): FormArray {
    return this.modifications
      .at(index)
      .get('values') as FormArray;
  }

  ngOnInit(): void {
    this.grantedView = this.userService.isGranted('ROLE_PRODUCT_VIEW');

    if (!this.grantedView) {
      this.errorService.error('Доступ запрещён');
      return;
    }

    this.grantedEdit = this.userService.isGranted('ROLE_PRODUCT_EDIT');
    this.grantedDelete = this.userService.isGranted('ROLE_PRODUCT_DELETE');

    this.gSub = this.productGroupService.getList().subscribe({
      next: (productGroups) => {
        this.productGroups = productGroups;
        if (this.product && !this.product.id && !this.product.productGroup.id && productGroups[0] && productGroups[0].id) {
          this.product.productGroup = {id: productGroups[0].id, name: this.productGroups[0].name}
          this.productGroup = this.product.productGroup;
        }
      }
    });

    this.mSub = this.marketplaceService.getList().subscribe(marketplaces => {
      this.marketplaces = marketplaces;
    })

    this.catalogSub = this.productService.getList().subscribe(product => {
      this.products = product.items;
      this.productsCopy = product.items;

      for (let product of this.products) {
        this.stockSub = this.stockService.getByProduct(product.id!).subscribe({
          next: (stock) => {
            if (stock) {
              for (let item of stock) {
                if (product.count) {
                  product.count = product.count + item.count;
                } else {
                  product.count = item.count;
                }
              }
            }
          }
        })
      }

    })

    this.lSub = this.route.params.pipe(
      switchMap((params: Params) => {
        return this.productService.get(params['id'])
      })
    ).subscribe((product: Product) => {
      this.product = product;
      if (this.product.brand) {
        this.selectedBrand = this.product.brand;
        this.searchBrandText = this.product.brand
      }

      this.productForm = new FormGroup({
        name: new FormControl({value: this.product.name, disabled: !this.grantedEdit}),
        sku: new FormControl({value: this.product.sku, disabled: !this.grantedEdit}),
        code: new FormControl({value: this.product.code, disabled: !this.grantedEdit}),
        vat: new FormControl({value: this.product.vat, disabled: !this.grantedEdit}),
        isEnabled: new FormControl({value: this.product.isEnabled, disabled: !this.grantedEdit}),
        weight: new FormControl({value: this.product.weight, disabled: !this.grantedEdit}),
        volume: new FormControl({value: this.product.volume, disabled: !this.grantedEdit}),
        length: new FormControl({value: this.product.length, disabled: !this.grantedEdit}),
        width: new FormControl({value: this.product.width, disabled: !this.grantedEdit}),
        height: new FormControl({value: this.product.height, disabled: !this.grantedEdit}),
        color: new FormControl({value: this.product.color, disabled: !this.grantedEdit}),
        price: new FormControl({value: this.product.price, disabled: !this.grantedEdit}),
        priceSale: new FormControl({value: this.product.priceSale, disabled: !this.grantedEdit}),
        priceMin: new FormControl({value: this.product.priceMin, disabled: !this.grantedEdit}),
        priceRrp: new FormControl({value: this.product.priceRrp, disabled: !this.grantedEdit}),
        pricePurchase: new FormControl({value: this.product.pricePurchase, disabled: !this.grantedEdit}),
        barcodes: new FormArray([]),
        productSetItems: new FormArray([]),
        customFields: new FormArray([]),
        customPrices: new FormArray([])
      });

      this.productGroup = this.product.productGroup;

      for (let barcode of this.product.barcodes) {
        this.barcodes.push(
          this.fb.group({
            marketplace: new FormControl({
              value: (barcode.marketplace ? barcode.marketplace.id : 0),
              disabled: true
            }),
            type: new FormControl({value: barcode.type, disabled: true}),
            code: new FormControl({value: barcode.code, disabled: true}),
          })
        )
      }

      if (this.product.productSetItems) {
        this.productSetItems.controls = this.product.productSetItems.map(item =>
            new SetItemFormControl(
              item.product.id,
              item.product.name || '',
              item.product.sku || '',
              item.product.code || '',
              item.product.price || 0,
              item.quantity,
              this.grantedEdit
            )
        )
      }

      if (this.product.customFields) {
        this.customFields.controls = this.product.customFields.filter((item) => item.type !== 'price').map(item => {
            return new CustomFieldFormGroup(
              item.id,
              item.name || '',
              item.type || '',
              item.value || '',
              this.grantedEdit
            )
        })

        this.customPrices.controls = this.product.customFields.filter((item) => item.type === 'price').map(item => {
          return new CustomPriceFormGroup(
            item.id,
            item.name || '',
            item.type || '',
            item.value || '',
            this.grantedEdit
          )
        })
      }

      if (this.product.hasModification) {
        this.modificationsListSub = this.productService.getModifications(this.product).subscribe(modifications => {
          if (this.product) {
            this.product.productModifications = modifications;
          }
        })
      }

    });
  }

  ngOnDestroy(): void {
    if (this.lSub) {
      this.lSub.unsubscribe();
    }
    if (this.cSub) {
      this.cSub.unsubscribe();
    }
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
    if (this.dSub) {
      this.dSub.unsubscribe();
    }
    if (this.mSub) {
      this.mSub.unsubscribe();
    }
    if (this.gSub) {
      this.gSub.unsubscribe();
    }
    if (this.stockSub) {
      this.stockSub.unsubscribe();
    }
    if (this.catalogSub) {
      this.catalogSub.unsubscribe();
    }
    if (this.modificationsListSub) {
      this.modificationsListSub.unsubscribe();
    }
    if (this.modificationsSaveSub) {
      this.modificationsSaveSub.unsubscribe();
    }
    if (this.descriptionViewSub) {
      this.descriptionViewSub.unsubscribe();
    }
    if (this.descriptionSaveSub) {
      this.descriptionSaveSub.unsubscribe();
    }
  }

  // public listProducts(groupId?: string) {
  //   this.lSub = this.productService.getList(groupId).subscribe({
  //     next: (paginatedProducts: PaginatedProducts) => {
  //       this.products = paginatedProducts.items;
  //     }
  //   });
  // }

  save() {
    if (!this.grantedEdit || !this.productForm?.valid || !this.product || this.formSubmitted ) {
      return;
    }

    this.formSubmitted = true;

    this.spinner.show(undefined, {fullScreen: true}).finally();

    this.product.name = this.name?.value || '';
    this.product.sku = this.sku?.value || '';
    this.product.code = this.code?.value || '';
    this.product.vat = parseInt(this.vat?.value || '');
    this.product.isEnabled = !!this.isEnabled?.value;
    this.product.weight = parseInt(this.weight?.value || '');
    this.product.volume = parseInt(this.volume?.value || '');
    this.product.length = parseInt(this.length?.value || '');
    this.product.width = parseInt(this.width?.value || '');
    this.product.height = parseInt(this.height?.value || '');
    this.product.color = this.color?.value || '';
    this.product.price = parseInt(this.price?.value || '');
    this.product.priceSale = parseInt(this.priceSale?.value || '');
    this.product.priceMin = parseInt(this.priceMin?.value || '');
    this.product.priceRrp = parseInt(this.priceRrp?.value || '');
    this.product.pricePurchase = parseInt(this.pricePurchase?.value || '');

    this.product.productGroup = this.productGroup || { id: '', name: '' }
    this.product.barcodes = this.barcodes.controls.map(barcodeForm => {
      const marketplaceId = barcodeForm.get('marketplace')?.value;
      const type = barcodeForm.get('type')?.value;
      const code = barcodeForm.get('code')?.value;

      const barcode: Barcode = {
        marketplace: (marketplaceId ? {id: parseInt(marketplaceId), name: '', enabled: true} : undefined),
        type: type,
        code: code,
      }
      return barcode;
    })

    if (this.selectedBrand?.id) {
      this.product.brand = {
        id: this.selectedBrand.id,
        name: this.selectedBrand.name
      }
    } else {
      if (typeof this.searchBrandText === 'object') {
        this.product.brand = this.searchBrandText;
      } else {
        this.product.brand = {
          name: this.searchBrandText
        }
      }
    }

    this.product.productSetItems = this.productSetItems.controls.map(item => {
      const productId = item.productId;
      const quantity = parseInt(item.value);

      const product: ProductOfSet = {
        id: productId
      }

      const setItem: ProductSetItem = {
        product: product,
        quantity: quantity,
      }

      return setItem;
    })

    this.product.customFields = this.customFields.controls.map(item => {
      const field: ProductCustomField = {
        id: item.fieldId,
        name: item.get('name')?.value,
        type: item.get('type')?.value,
        value: `${item.get('value')?.value}`,
      }

      return field;
    })

    this.customPrices.controls.map(item => {
      const field: ProductCustomField = {
        id: item.fieldId,
        name: item.get('priceName')?.value,
        type: item.get('priceType')?.value,
        value: item.get('priceValue')?.value,
      }
      this.product?.customFields.push(field)
    })

    if (this.product.id) {
      this.uSub = this.productService.update(this.product).subscribe({
        next: () => {
          this.toastr.success('Товар обновлен');
        },
        error: () => {
          this.formSubmitted = false;
        },
        complete: ()=> {
          this.formSubmitted = false;
          this.spinner.hide().finally();
        }
      });
    } else {
      this.cSub = this.productService.create(this.product).subscribe({
        next: () => {
          this.toastr.success('Товар добавлен');
        },
        error: () => {
          this.formSubmitted = false;
        },
        complete: ()=> {
          this.formSubmitted = false;
          this.spinner.hide().finally();
        }
      });
    }
  }

  delete() {
    if (!this.product || !this.confirmModal) {
      return;
    }

    this.modalService.open(this.confirmModal, { centered: true });
  }

  confirmDelete() {
    if (!this.product) {
      return;
    }

    this.dSub = this.productService.delete(this.product).subscribe({
      next: () => {
        this.product = undefined;
        this.modalService.dismissAll('');
        this.toastr.success('Товар удален');
        this.toList();
      },
      error: () => {
        this.formSubmitted = false;
      },
      complete: ()=> {
        this.formSubmitted = false;
        this.spinner.hide().finally();
      }
    });
  }

  toList() {
    this.router.navigate(['/products/']).then(r => {});
  }

  searchProduct: OperatorFunction<string, Product[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.selectedProduct = undefined;
        this.searching = true;
      }),
      switchMap(term =>
        this.productService.search(term).pipe(

          tap(() => {
            return this.searchFailed = false;
          }),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
          )
      ),
      tap(() => this.searching = false)
    )

  modelFormat(item: Product) {
    return item.name
  }

  selectItem(event: any) {
    if (event.item) {
      this.selectedProduct = event.item;
    }
  }

  addBarcode() {
    if (!this.product) {
      return;
    }

    this.barcodes.push(this.fb.group({
      marketplace: new FormControl(0),
      type: new FormControl('EAN13'),
      code: new FormControl('', [Validators.required, Validators.minLength(8)]),
    }))

  }

  removeBarcode(id?: number) {
    if (id === undefined) {
      return;
    }
    if (this.barcodes && this.barcodes.controls) {
      this.barcodes.controls = this.barcodes.controls.filter((item, key) => key != id);
    }
  }

  addInSet() {
    if (this.product && this.selectedProduct && this.selectedProduct.id) {
      if (this.productSetItems.controls.find(ps => ps.productId === this.selectedProduct?.id)) {
        this.searchProductText = '';
        return;
      }
      if (!this.product.productSetItems) {
        this.product['productSetItems'] = [];
      }

      this.productSetItems.push(new SetItemFormControl(
        this.selectedProduct.id,
        this.selectedProduct.name,
        this.selectedProduct.sku,
        this.selectedProduct.code,
        this.selectedProduct.price,
        0,
        this.grantedEdit
        )
      )
    }
    this.searchProductText = '';
  }

  removeFromSet(id?: number) {
    if (id === undefined) {
      return;
    }
    if (this.product && this.product.productSetItems) {
      this.productSetItems.controls = this.productSetItems.controls.filter((item, key) => key != id);
    }
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);

      this.imageService.uploadImage(this.selectedFile.file).subscribe({
        next: (imageUrl: string) => {
          const image: ProductImage = {
            id: undefined,
            isDefault: false,
            file: imageUrl,
          }
          this.onSucces(image);
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.toastr.error(errorResponse.error.errors[0].detail, 'Error!');
          this.onFailure();
        }})
    });

    reader.readAsDataURL(file);
  }

  private onSucces(image: ProductImage) {
    // this.selectedFile.pending = false;
    // this.selectedFile.status = 'OK';
    // this.imageChangedEvent = null;
    // this.imageUploaded.emit(imageUrl);
    this.product?.images.push(image);
  }

  private onFailure() {
    // this.selectedFile.pending = false;
    // this.selectedFile.status = 'FAIL';
    // this.imageChangedEvent = null;
    // this.imageError.emit('');
  }

  editDescription() {
    if (!this.product || !this.product.id) {
      return;
    }

    this.productService.getDescription(this.product).subscribe(description => {
      this.productDescription = description;
      this.descriptionForm = new FormGroup({
        description: new FormControl(description.content)
      });
      this.modalService.open(this.descriptionModal, { centered: true });
    });

  }


  saveDescription() {
    const text = this.descriptionForm?.get('description')?.value;
    if (!text || !this.product || this.descriptionFormSubmitted) {
      return;
    }
    this.descriptionFormSubmitted = true;

    const description: ProductDescription = {
      marketplace: undefined,
      content: text
    }

    this.productService.saveDescription(this.product, description).subscribe(() => {
      this.modalService.dismissAll('');
      this.toastr.success('Описание сохранено');
      this.descriptionFormSubmitted = false;
    });
  }

  removeImage(i: number) {
    if (this.product) {
      this.product.images = this.product.images.filter((v, k) => k != i);
    }
  }

  setDefaultImage(i: number) {
    if (this.product) {
      this.product.images.map((image, k ) => image.isDefault = k === i );
    }
  }

  addCustomField() {
    if (!this.grantedEdit || !this.product) {
      return;
    }

    this.customFields.push(new CustomFieldFormGroup('', '', '', '', true));
  }

  removeCustomField(id?: number) {
    if (id === undefined) {
      return;
    }
    if (this.customFields && this.customFields.controls) {
      this.customFields.controls = this.customFields.controls.filter((item, key) => key != id);
    }
  }

  removeCustomPrice(id?: number) {
    if (id === undefined) {
      return;
    }
    if (this.customPrices && this.customPrices.controls) {
      this.customPrices.controls = this.customPrices.controls.filter((item, key) => key != id);
    }
  }

  addCustomPrice() {
    if (!this.grantedEdit || !this.product) {
      return;
    }

    this.customPrices.push(new CustomPriceFormGroup('', '', 'price', '', true));
  }

  groupModal() {
    if (!this.productGroup) {
      return;
    }

    this.modalService.open(this.editGroup, { centered: true });
  }

  editProductGroup(productGroup: ProductGroup) {
    this.productGroup = {

      id: productGroup.id || '0',
      name: productGroup.name
    }
    this.modalService.dismissAll('');
  }

  openCatalog() {

    if (!this.product || !this.confirmModal) {
      return;
    }
    this.productsCopy = this.products;

    // this.productSetItems.controls.forEach(item => {
    //   this.productsCopy.forEach(el => {
    //     if (item.sku === el.sku) {
    //       let index = this.productsCopy.indexOf(el);
    //       this.productsCopy.splice(index, 1);
    //     }
    //   })
    // })

    //по идее тут сложность алгоритма одинаковая, обход по каждому элементу происходит,
    //я думаю при большом колличестве товаров это может занимать много времени, надо будет
    //подумать над более изящным решением

    // TODO: возможно это всё надо вынести в отдельный компонент где будет список товаров с поиском по нему


    this.productSetItems.controls.forEach(item => {
      this.productsCopy = this.productsCopy.filter(el => el.sku !== item.sku)
    })

    this.modalService.open(this.catalogModal, { centered: true });
  }

  addInSetFromCatalog(item: Product) {
    if (item.id) {
      this.productSetItems.push(new SetItemFormControl(
        item.id,
        item.name,
        item.sku,
        item.code,
        item.price,
        0,
        this.grantedEdit
        )
      )
    }

    let index = this.productsCopy.indexOf(item);
    this.productsCopy.splice(index, 1);
  }



  addBrand(brand: Brand) {
    this.selectedBrand = brand
  }

  modelBrandFormat(item: Brand) {
    return item.name;
  }

  selectBrand(event: any) {
    if (event.item) {
      this.addBrand(event.item);
    }
  }

  enterBrand() {
    if (!this.product || (typeof this.searchBrandText === 'string' && this.searchBrandText.length < 3)) {
      return;
    }

    const brand: Brand = (typeof this.searchBrandText === 'object') ? this.searchBrandText : {name: this.searchBrandText}
    this.addBrand(brand);
  }

  searchBrand: OperatorFunction<any, readonly Brand[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap((term) => {
        this.selectedBrand = undefined;
        if (term.length > 2) {
          this.searchingBrand = true;
        }
      }),
      switchMap(term =>

        term.length < 3 ? []
          : this.brandService.search(term).pipe(

            tap(() => {
              return this.searchBrandFailed = false;
            }),
            catchError(() => {
              this.searchBrandFailed = true;
              return of([]);
            })
          )
        ),
        tap(() => this.searchingBrand = false)
    )

  addModifications(): void {
    this.modificationsCount = 0;
    this.productService.getModificationAttributes().subscribe((attributes) => {
      this.modificationAttributes = attributes;
      this.modificationsForm = new FormGroup({
        modifications: new FormArray([]),
      });

      this.modalService.open(this.modificationsModal, { centered: true });
    })

  }

  addModification() {
    this.modifications.controls.push(
      new ProductModificationsFormGroup()
    );
  }

  addModificationValue(i: number, k: number, event: Event) {
    const values = this.modificationValues(i);
    if (values.length === ++k) {
      this.modificationValues(i).push(new FormControl(''));
      this.calcModificationsCount();
    }
  }

  removeModificationValue(i: number, k: number): void {
    let values = this.modificationValues(i);
    values.controls = values.controls.filter((val, n)=> k !== n);
    this.calcModificationsCount();
  }

  createModifications(): void {
    if (!this.product || !this.product.id || this.modificationsSubmitted) {
      return;
    }

    this.modificationsSubmitted = true;

    const product: Product = {
      id: this.product.id,
      barcodes: [],
      code: '',
      customFields: [],
      images: [],
      isEnabled: false,
      isSet: false,
      name: '',
      productGroup: {id: '', name: ''},
      sku: '',
      hasModification: false
    }

    const modifications = [];

    let i = 0;
    for (let modificationControl of this.modifications.controls) {
      if (modificationControl.get('name')?.value?.length > 0) {
        const modificationValue: ProductModificationValue = {
          attribute: {
            id: parseInt(modificationControl.get('name')?.value),
            name: ''
          },
          values: []
        }
        for (let value of this.modificationValues(i).controls) {
          if (value?.value?.length) {
            modificationValue.values.push(value.value)
          }
        }
        const modification: ProductModification = {
          productModificationValues: [modificationValue]
        }
        ++i;

        modifications.push(modification)
      }
    }

    if (modifications.length) {
      this.modificationsSaveSub = this.productService.createModifications(product, modifications).subscribe(modifications => {
        this.product = product;
        this.modalService.dismissAll();
        this.toastr.success('Модификации созданы');
        // this.product.productModifications = modifications;
        this.modificationsSubmitted = false;
      });
    } else {
      this.toastr.warning('Не создано ни одной модификации');
      this.modificationsSubmitted = false;
    }
  }

  private calcModificationsCount(): void {
    this.modificationsCount = 0;
    let i = 0;
    const  valuesCount = [];
    for (let modification of this.modifications.controls) {
      if (modification.get('name')?.value?.length > 0) {
        valuesCount[i] = 0;
        for (let value of this.modificationValues(i).controls) {
          if (value?.value?.length) {
            ++valuesCount[i];
          }
        }
        ++i;
      }
    }

    if (valuesCount.length) {
      this.modificationsCount = 1;
    }
    for (let val of valuesCount) {
      if (val) {
        this.modificationsCount *= val;
      }
    }

  }
}
