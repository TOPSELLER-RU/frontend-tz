import {Component, Input, OnInit} from '@angular/core';
import {ProductGroupComponent} from '../../../pages/full-pages/product-group/product-group.component';
import { ProductListComponent } from 'app/pages/full-pages/product-list/product-list.component';
import { ProductEditComponent } from 'app/pages/full-pages/product-edit/product-edit.component';
import {ProductGroup} from "../../interfaces";

@Component({
  selector: 'app-product-tree',
  templateUrl: './product-tree.component.html',
  styleUrls: ['./product-tree.component.scss']
})
export class ProductTreeComponent implements OnInit {


  @Input() recursiveList?: ProductGroup[] = [];
  @Input() isAdd?: boolean;
  @Input() level: number = 0;
  @Input() editParent?: any;
  @Input() grantedDelete?: boolean;
  @Input() grantedEdit?: boolean;
  @Input() isSortProduct?: boolean;
  @Input() isEditGroup?: boolean;
  public selectedGroup?: string = '';

  constructor(
    public productGroupComponent: ProductGroupComponent,
    public productListComponent: ProductListComponent,
    public productEditComponent: ProductEditComponent
  ) { }

  ngOnInit(): void {
  }

  showGroup(id: string | undefined, event: MouseEvent) {
    event.stopPropagation();
    if (this.selectedGroup !== id) {
      this.selectedGroup = id;
    } else {
      this.selectedGroup = ''
    }
  }

  edit(id: string|undefined):void {
    this.productGroupComponent.edit(id);
  }

  delete(groupId: string):void {
    this.productGroupComponent.delete(groupId);
  }

  changeParent(productGroup: ProductGroup) {
    this.productGroupComponent.changeParent(productGroup)
  }

  listProducts(productGroup: ProductGroup) {
    const id = (this.level > 0) ? productGroup.id : undefined;
    this.productListComponent.listProducts(id);
  }

  editProductGroup(productGroup: ProductGroup) {
    this.productEditComponent.editProductGroup(productGroup)
  }

}
