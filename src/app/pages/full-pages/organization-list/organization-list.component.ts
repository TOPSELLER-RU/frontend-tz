import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";

import {Organization} from "../../../shared/interfaces";
import {ErrorService} from "../../../shared/services/error.service";
import {OrganizationService} from "../../../shared/services/organization.service";
import {UserService} from "../../../shared/services/user.service";

@Component({
  selector: 'app-organization',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss']
})
export class OrganizationListComponent implements OnInit, OnDestroy {

  organizations: Organization[] = [];
  formSubmitted = false;

  grantedView = false;
  grantedEdit = false;
  grantedSettlementAccount = false;

  lSub?: Subscription;

  constructor(
    private errorService: ErrorService,
    private organizationService: OrganizationService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.grantedView = this.userService.isGranted('ROLE_ORGANIZATION_VIEW');
    if (!this.grantedView) {
      this.errorService.error('Доступ запрещён');
      return;
    }

    this.grantedEdit = this.userService.isGranted('ROLE_ORGANIZATION_EDIT');
    this.grantedSettlementAccount = this.userService.isGranted('ROLE_ORGANIZATION_SETTLEMENT-ACCOUNTS');

    this.lSub = this.organizationService.getList().subscribe({
      next: (organizations) => {
        this.organizations = organizations;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.lSub) {
      this.lSub.unsubscribe();
    }
  }
}
