import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxMaskModule} from "ngx-mask";
import {NgbDateAdapter, NgbDateNativeAdapter, NgbTypeaheadModule} from "@ng-bootstrap/ng-bootstrap";
import {NgxSpinnerModule} from "ngx-spinner";

import { PageRoutingModule } from "./page-routing.module";
import {OrderEditComponent} from 'app/pages/full-pages/order-edit/order-edit.component';
import {OrderListComponent} from 'app/pages/full-pages/order-list/order-list.component';
import {OrganizationEditComponent} from "../pages/full-pages/organization-edit/organization-edit.component";
import {OrganizationListComponent} from "../pages/full-pages/organization-list/organization-list.component";
import {OrganizationSettlementAccountEditComponent} from "../pages/full-pages/organization-settlement-account-edit/organization-settlement-account-edit.component";
import {OrganizationSettlementAccountListComponent} from "../pages/full-pages/organization-settlement-account-list/organization-settlement-account-list.component";
import { PageComponent } from "../pages/full-pages/page/page.component";
import {ProductEditComponent} from "../pages/full-pages/product-edit/product-edit.component";
import {ProductListComponent} from "../pages/full-pages/product-list/product-list.component";
import {ProductGroupComponent} from "../pages/full-pages/product-group/product-group.component";
import {ProductTreeComponent} from "../shared/components/product-tree/product-tree.component";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbTypeaheadModule,
    PageRoutingModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgxMaskModule,
    SharedModule
  ],
  exports: [],
  declarations: [
    OrderEditComponent,
    OrderListComponent,
    OrganizationListComponent,
    OrganizationEditComponent,
    OrganizationSettlementAccountEditComponent,
    OrganizationSettlementAccountListComponent,
    PageComponent,
    ProductEditComponent,
    ProductListComponent,
    ProductGroupComponent,
    ProductTreeComponent,
  ],
  providers: [
    {provide: NgbDateAdapter, useClass: NgbDateNativeAdapter},
    {provide: Window, useValue: window},
    {provide: ProductListComponent},
    {provide: ProductEditComponent}
  ],
})
export class PageModule { }
