import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {Subscription, switchMap} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, Params, Router} from "@angular/router";

import {Organization, SettlementAccount} from "../../../shared/interfaces";
import {ErrorService} from "../../../shared/services/error.service";
import {OrganizationService} from "../../../shared/services/organization.service";
import {SettlementAccountService} from "../../../shared/services/settlement-account.service";
import {UserService} from "../../../shared/services/user.service";

@Component({
  selector: 'app-settlement-account-edit',
  templateUrl: './organization-settlement-account-edit.component.html',
  styleUrls: ['./organization-settlement-account-edit.component.scss']
})
export class OrganizationSettlementAccountEditComponent implements OnInit, OnDestroy {

  account?: SettlementAccount;
  organization?: Organization;
  formSubmitted = false;

  grantedView = false;
  grantedEdit = false;
  grantedDelete = false;

  lSub?: Subscription;
  oSub?: Subscription;
  cSub? :Subscription;
  uSub? :Subscription;
  dSub? :Subscription;

  @ViewChild('confirmModal', { read: TemplateRef })
  confirmModal?: ElementRef;

  accountForm?: FormGroup;

  constructor(
    private errorService: ErrorService,
    private modalService: NgbModal,
    private organizationService: OrganizationService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private settlementAccountService: SettlementAccountService,
    private spinner: NgxSpinnerService,
    private userService: UserService,
  ) { }

  get bik() {
    return this.accountForm?.get('bik');
  }
  get bankName() {
    return this.accountForm?.get('bankName');
  }
  get bankAddress() {
    return this.accountForm?.get('bankAddress');
  }
  get correspondentAccount() {
    return this.accountForm?.get('correspondentAccount');
  }
  get settlementAccount() {
    return this.accountForm?.get('settlementAccount');
  }
  get isDefault() {
    return this.accountForm?.get('isDefault');
  }

  ngOnInit(): void {
    this.grantedView = this.userService.isGranted('ROLE_ORGANIZATION_SETTLEMENT-ACCOUNTS');
    if (!this.grantedView) {
      this.errorService.error('Доступ запрещён');
      return;
    }

    this.grantedEdit = this.userService.isGranted('ROLE_ORGANIZATION_SETTLEMENT-ACCOUNTS_EDIT');
    this.grantedDelete = this.userService.isGranted('ROLE_ORGANIZATION_SETTLEMENT-ACCOUNTS_DELETE');

    this.lSub = this.route.params.pipe(
      switchMap((params: Params) => {
        return this.settlementAccountService.get(params['organizationId'], params['id'])
      })
    ).subscribe((account: SettlementAccount) => {
      this.account = account;

      this.accountForm = new FormGroup({
        bik: new FormControl({value: this.account.bank.bik, disabled: !!this.account.id || !this.grantedEdit}),
        bankName: new FormControl({value: this.account.bank.name, disabled: !!this.account.id || !this.grantedEdit}),
        bankAddress: new FormControl({value: this.account.bank.address, disabled: !!this.account.id || !this.grantedEdit}),
        correspondentAccount: new FormControl({value: this.account.bank.correspondentAccount, disabled: !!this.account.id || !this.grantedEdit}),
        settlementAccount: new FormControl({value: this.account.settlementAccount, disabled: !!this.account.id || !this.grantedEdit}),
        isDefault: new FormControl({value: this.account.isDefault, disabled: !this.grantedEdit}),
      });
    })

    this.oSub = this.route.params.pipe(
      switchMap((params: Params) => {
        return this.organizationService.get(params['organizationId'])
      })
    ).subscribe((organization: Organization) => {
      this.organization = organization;
    })

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
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  save() {
    if (!this.accountForm || !this.accountForm.valid || !this.organization || !this.organization.id || !this.account || this.formSubmitted ) {
      return;
    }

    this.formSubmitted = true;

    this.spinner.show(undefined, {fullScreen: true}).finally();

    this.account.settlementAccount = this.settlementAccount?.value || '';
    this.account.isDefault = this.isDefault?.value || false;
    this.account.bank.name = this.bankName?.value || '';
    this.account.bank.bik = this.bik?.value || '';
    this.account.bank.address = this.bankAddress?.value || '';
    this.account.bank.correspondentAccount = this.correspondentAccount?.value || '';

    if (this.account.id) {
      this.uSub = this.settlementAccountService.update(this.organization.id, this.account).subscribe({
        next: () => {
          this.toastr.success('Расчётный счет обновлен');
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
      this.cSub = this.settlementAccountService.create(this.organization.id, this.account).subscribe({
        next: () => {
          this.toastr.success('Расчётный счет добавлен');
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
    if (!this.organization || !this.confirmModal) {
      return;
    }

    this.modalService.open(this.confirmModal, { centered: true });
  }

  confirmDelete() {
    if (!this.organization || !this.organization.id || !this.account) {
      return;
    }

    this.dSub = this.settlementAccountService.delete(this.organization.id, this.account).subscribe({
      next: () => {
        this.account = undefined;
        this.modalService.dismissAll('');
        this.toastr.success('Расчётный счет удален');
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
    this.router.navigate(['/organizations', this.organization?.id, 'settlement-accounts']);
  }

}
