  import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {ProductGroup} from "../../../shared/interfaces";
import {Subscription} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {ErrorService} from "../../../shared/services/error.service";
import {ProductGroupService} from "../../../shared/services/product-group.service";
import { UserService } from 'app/shared/services/user.service';

@Component({
  selector: 'app-product-group',
  templateUrl: './product-group.component.html',
  styleUrls: ['./product-group.component.scss'],
})
export class ProductGroupComponent implements OnInit, OnDestroy {

  productGroups: ProductGroup[] = [];
  editProductGroup?: ProductGroup;
  formSubmitted = false;
  lSub?: Subscription;
  cSub? :Subscription;
  uSub? :Subscription;
  dSub? :Subscription;

  grantedView = false;
  grantedEdit = false;
  grantedDelete = false;

  public isAdd?:boolean = false;
  public currentParent: ProductGroup | undefined  = {
    id: "",
    name: 'Выберете родительскую группу товара!',
  }

  @ViewChild('productGroupModal', { read: TemplateRef })
  modal?: ElementRef;

  @ViewChild('confirmModal', { read: TemplateRef })
  confirmModal?: ElementRef;

  @ViewChild('editParent', { read: TemplateRef })
  editParent?: ElementRef;

  productGroupForm =  new UntypedFormGroup({
    productGroupName: new UntypedFormControl('', [Validators.required]),
  });

  constructor(
    private errorService: ErrorService,
    private productGroupService: ProductGroupService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private userService: UserService
  ) { }

  get productGroupName() {
    return this.productGroupForm.get('productGroupName');
  }

  ngOnInit(): void {

    this.grantedView = this.userService.isGranted('ROLE_PRODUCT-GROUP_VIEW');
    if (!this.grantedView) {
      this.errorService.error('Доступ запрещён');
      return;
    }

    this.grantedEdit = this.userService.isGranted('ROLE_PRODUCT-GROUP_EDIT');
    this.grantedDelete = this.userService.isGranted('ROLE_PRODUCT-GROUP_DELETE');

    this.lSub = this.productGroupService.getList().subscribe({
      next: (productGroups) => {
        this.productGroups = productGroups;
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
  }

  edit(id: string|undefined) {


    if (!id) {
      return;
    }

    this.productGroupService.get(id).subscribe((productGroup) => {
        if (!productGroup || !this.modal || !this.productGroupName) {
          return;
        }

        this.productGroupForm.reset();
        this.productGroupName.setValue(productGroup.name);
        this.currentParent = productGroup.parentGroup
        this.editProductGroup = productGroup
        this.modalService.open(this.modal, { centered: true }).result.then(
          result => {},
          reason => {this.editProductGroup = undefined;}
        )
    })
  }

  changeParent(productGroup: ProductGroup) {
    this.currentParent = productGroup;

  }


  parentModal() {
    if (!this.editParent) {
      return;
    }

    this.modalService.open(this.editParent, { centered: true })
  }

  add() {
    if (!this.modal) {
      return;
    }

    this.currentParent = {
      id: "",
      name: 'Выберете родительскую группу товара!',
    }

    this.editProductGroup = {
      id: undefined,
      name: '',
      productGroups: [],

    }
    this.productGroupForm.reset();

    this.modalService.open(this.modal, { centered: true }).result.then(
      result => {},
      reason => {this.editProductGroup = undefined;}
    );
  }

  save() {
    if (!this.productGroupForm.valid || !this.editProductGroup || this.formSubmitted || !this.productGroupName) {
      return;
    }

    this.formSubmitted = true;

    this.spinner.show(undefined, {fullScreen: true}).finally();

    this.editProductGroup.name = this.productGroupName.value;
    this.editProductGroup.parentGroup = this.currentParent;


    if (this.editProductGroup.id) {
      this.uSub = this.productGroupService.update(this.editProductGroup).subscribe({
        next: (productGroup: ProductGroup) => {
          const productGroupId = this.productGroups.findIndex(g => g.id === this.editProductGroup?.id);
          this.productGroups[productGroupId] = productGroup;
          this.modalService.dismissAll('');
          this.toastr.success('Группа товаров обновлен');
        },
        error: () => {
          this.formSubmitted = false;
        },
        complete: ()=> {
          this.editProductGroup = undefined;
          this.formSubmitted = false;
          this.spinner.hide().finally();
        }
      });
    } else {
      this.cSub = this.productGroupService.create(this.editProductGroup).subscribe({
        next: (productGroup: ProductGroup) => {
          this.productGroups.push(productGroup);
          this.modalService.dismissAll('');
          this.toastr.success('Группа товаров добавлена');
        },
        error: () => {
          this.formSubmitted = false;
        },
        complete: ()=> {
          this.editProductGroup = undefined;
          this.formSubmitted = false;
          this.spinner.hide().finally();
        }
      });
    }


  }

  delete(groupId: string) {
    this.editProductGroup = this.productGroups.find(group => group.id === groupId);
    if (!this.editProductGroup || !this.modal || !this.productGroupName) {
      return;
    }

    this.modalService.open(this.confirmModal, { centered: true }).result.then(
      result => {},
      reason => {this.editProductGroup = undefined;}
    );
  }

  confirmDelete() {
    if (!this.editProductGroup) {
      return;
    }

    this.uSub = this.productGroupService.delete(this.editProductGroup).subscribe({
      next: () => {
        this.productGroups = this.productGroups.filter(group => group.id !== this.editProductGroup?.id);
        this.modalService.dismissAll('');
        this.toastr.success('Группа товаров удалена');
      },
      error: () => {
        this.formSubmitted = false;
      },
      complete: ()=> {
        this.editProductGroup = undefined;
        this.formSubmitted = false;
        this.spinner.hide().finally();
      }
    });
  }

}
