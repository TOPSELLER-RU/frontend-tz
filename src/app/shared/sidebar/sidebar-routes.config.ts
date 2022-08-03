import { RouteInfo } from './sidebar.metadata';

import { faBoxes, faBuilding, faGift, faHouse, faWarehouse } from '@fortawesome/free-solid-svg-icons';

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [
  {
    path: '/page', title: 'Dashboard', icon: faHouse, class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
  },
  {
    path: '/organizations', title: 'Организации', icon: faBuilding, class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
  },
  {
    path: '/products', title: 'Товары', icon: faGift, class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
  },
  {
    path: '/product-groups', title: 'Группы товаров', icon: faBoxes, class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
  },
  {
    path: '/orders', title: 'Заказ покупателя', icon: faWarehouse, class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
  },
];
