import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription, switchMap} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";

import {Organization, SettlementAccount} from "../../../shared/interfaces";
import {ErrorService} from "../../../shared/services/error.service";
import {OrganizationService} from "../../../shared/services/organization.service";
import {SettlementAccountService} from "../../../shared/services/settlement-account.service";
import {UserService} from "../../../shared/services/user.service";

@Component({
  selector: 'app-settlement-account',
  templateUrl: './organization-settlement-account-list.component.html',
  styleUrls: ['./organization-settlement-account-list.component.scss']
})
export class OrganizationSettlementAccountListComponent implements OnInit, OnDestroy {

  settlementAccounts: SettlementAccount[] = [];
  organization?: Organization;
  formSubmitted = false;

  grantedView = false;
  grantedEdit = false;

  lSub?: Subscription;
  oSub?: Subscription;

  constructor(
    private errorService: ErrorService,
    private organizationService: OrganizationService,
    private route: ActivatedRoute,
    private router: Router,
    private settlementAccountService: SettlementAccountService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.grantedView = this.userService.isGranted('ROLE_ORGANIZATION_SETTLEMENT-ACCOUNTS');
    if (!this.grantedView) {
      this.errorService.error('Доступ запрещён');
      return;
    }

    this.grantedEdit = this.userService.isGranted('ROLE_ORGANIZATION_SETTLEMENT-ACCOUNTS_EDIT');

    this.lSub = this.route.params.pipe(
      switchMap((params: Params) => {
        return this.settlementAccountService.getList(params['organizationId'])
      })
    ).subscribe((settlementAccounts: SettlementAccount[]) => {
      this.settlementAccounts = settlementAccounts;

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
  }
}
