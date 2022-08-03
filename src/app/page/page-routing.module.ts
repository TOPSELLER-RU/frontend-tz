import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageComponent } from '../pages/full-pages/page/page.component';
import {OrganizationListComponent} from "../pages/full-pages/organization-list/organization-list.component";
import {OrganizationEditComponent} from "../pages/full-pages/organization-edit/organization-edit.component";
import {OrganizationSettlementAccountEditComponent} from "../pages/full-pages/organization-settlement-account-edit/organization-settlement-account-edit.component";
import {OrganizationSettlementAccountListComponent} from "../pages/full-pages/organization-settlement-account-list/organization-settlement-account-list.component";
import {ProductEditComponent} from "../pages/full-pages/product-edit/product-edit.component";
import {ProductListComponent} from "../pages/full-pages/product-list/product-list.component";
import {ProductGroupComponent} from "../pages/full-pages/product-group/product-group.component";
import { OrderListComponent } from 'app/pages/full-pages/order-list/order-list.component';
import { OrderEditComponent } from 'app/pages/full-pages/order-edit/order-edit.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'page',
        component: PageComponent,
        data: {
          title: 'Page'
        }
      },
      {
        path: 'organizations',
        component: OrganizationListComponent,
        data: {
          title: 'Организации'
        }
      },
      {
        path: 'organizations/:id',
        component: OrganizationEditComponent,
        data: {
          title: 'Редактирование организации'
        }
      },
      {
        path: 'organizations/:organizationId/settlement-accounts',
        component: OrganizationSettlementAccountListComponent,
        data: {
          title: 'Расчетные счета организации'
        }
      },
      {
        path: 'organizations/:organizationId/settlement-accounts/:id',
        component: OrganizationSettlementAccountEditComponent,
        data: {
          title: 'Редактирование расчетного счета организации'
        }
      },
      {
        path: 'products',
        component: ProductListComponent,
        data: {
          title: 'Товары'
        }
      },
      {
        path: 'products/:id',
        component: ProductEditComponent,
        data: {
          title: 'Редактирование товара'
        }
      },
      {
        path: 'product-groups',
        component: ProductGroupComponent,
        data: {
          title: 'Группы товаров'
        }
      },
      {
        path: 'orders',
        component: OrderListComponent,
        data: {
          title: 'Заказы покупателю'
        }
      },
      {
        path: 'orders/:id',
        component: OrderEditComponent,
        data: {
          title: 'Редактирование заказа покупателю'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageRoutingModule { }
