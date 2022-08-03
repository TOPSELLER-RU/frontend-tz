import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {Subscription, switchMap} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, Params, Router} from "@angular/router";

import {Organization} from "../../../shared/interfaces";
import {ErrorService} from "../../../shared/services/error.service";
import {OrganizationService} from "../../../shared/services/organization.service";
import {UserService} from "../../../shared/services/user.service";

@Component({
  selector: 'app-organization-edit',
  templateUrl: './organization-edit.component.html',
  styleUrls: ['./organization-edit.component.scss']
})
export class OrganizationEditComponent implements OnInit, OnDestroy {

  organization?: Organization;
  formSubmitted = false;

  grantedView = false;
  grantedEdit = false;
  grantedDelete = false;

  lSub?: Subscription;
  cSub? :Subscription;
  uSub? :Subscription;
  dSub? :Subscription;

  @ViewChild('confirmModal', { read: TemplateRef })
  confirmModal?: ElementRef;

  organizationForm?: FormGroup;

  constructor(
    private errorService: ErrorService,
    private organizationService: OrganizationService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private userService: UserService,
  ) { }

  get name() {
    return this.organizationForm?.get('name');
  }
  get fullName() {
    return this.organizationForm?.get('fullName');
  }
  get phone() {
    return this.organizationForm?.get('phone');
  }
  get email() {
    return this.organizationForm?.get('email');
  }
  get legalAddress() {
    return this.organizationForm?.get('legalAddress');
  }
  get inn() {
    return this.organizationForm?.get('inn');
  }
  get kpp() {
    return this.organizationForm?.get('kpp');
  }
  get ogrn() {
    return this.organizationForm?.get('ogrn');
  }
  get okpo() {
    return this.organizationForm?.get('okpo');
  }
  get isDefault() {
    return this.organizationForm?.get('isDefault');
  }


  ngOnInit(): void {
    this.grantedView = this.userService.isGranted('ROLE_ORGANIZATION_VIEW');
    if (!this.grantedView) {
      this.errorService.error('Доступ запрещён');
      return;
    }

    this.grantedEdit = this.userService.isGranted('ROLE_ORGANIZATION_EDIT');
    this.grantedDelete = this.userService.isGranted('ROLE_ORGANIZATION_DELETE');

    this.lSub = this.route.params.pipe(
      switchMap((params: Params) => {
        return this.organizationService.get(params['id'])
      })
    ).subscribe((organization: Organization) => {
      this.organization = organization;

      this.organizationForm = new FormGroup({
        name: new FormControl({value: this.organization.name, disabled: !this.grantedEdit}, [Validators.required]),
        phone: new FormControl({value: this.organization.phone, disabled: !this.grantedEdit}),
        email: new FormControl({value: this.organization.email, disabled: !this.grantedEdit}),
        fullName: new FormControl({value: this.organization.fullName, disabled: !this.grantedEdit}),
        legalAddress: new FormControl({value: this.organization.legalAddress, disabled: !this.grantedEdit}),
        inn: new FormControl({value: this.organization.inn, disabled: !this.grantedEdit}),
        kpp: new FormControl({value: this.organization.kpp, disabled: !this.grantedEdit}),
        ogrn: new FormControl({value: this.organization.ogrn, disabled: !this.grantedEdit}),
        okpo: new FormControl({value: this.organization.okpo, disabled: !this.grantedEdit}),
        isDefault: new FormControl({value: this.organization.isDefault, disabled: !this.grantedEdit}),
      });
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
  }

  save() {
    if (!this.organizationForm || !this.organizationForm.valid || !this.organization || this.formSubmitted ) {
      return;
    }

    this.formSubmitted = true;

    this.spinner.show(undefined, {fullScreen: true}).finally();

    this.organization.name = this.name?.value || '';
    this.organization.fullName = this.fullName?.value || '';
    this.organization.phone = this.phone?.value || '';
    this.organization.email = this.email?.value || '';
    this.organization.legalAddress = this.legalAddress?.value || '';
    this.organization.inn = this.inn?.value || '';
    this.organization.kpp = this.kpp?.value || '';
    this.organization.ogrn = this.ogrn?.value || '';
    this.organization.okpo = this.okpo?.value || '';
    this.organization.isDefault = this.isDefault?.value || false;

    if (this.organization.id) {
      this.uSub = this.organizationService.update(this.organization).subscribe({
        next: () => {
          this.toastr.success('Организация обновлена');
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
      this.cSub = this.organizationService.create(this.organization).subscribe({
        next: () => {
          this.toastr.success('Организация добавлена');
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
    if (!this.organization) {
      return;
    }

    this.dSub = this.organizationService.delete(this.organization).subscribe({
      next: () => {
        this.organization = undefined;
        this.modalService.dismissAll('');
        this.toastr.success('Организация удалена');
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
    this.router.navigate(['/organizations']);
  }

}
