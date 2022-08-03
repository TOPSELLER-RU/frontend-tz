export interface AuthResponse {
  token: string
  refreshToken?: string | undefined
  user: User
}

export interface TokenPayload {
  iat: number
  exp: number
  user_id: number
  phone: string
  roles: []
}

export interface User {
  id?: string
  phone: string
  email: string
  firstName: string
  lastName?: string
  middleName?: string
  image?: string
  password?: string
  roles?: string[]
}

export interface Employee extends User {
  departments: any[]
  roles: string[]
  allRoles: string[]
}

export interface Brand {
  id?: number
  name: string
  isPopular?: boolean
}

export interface Expense {
  id?: string
  name: string
  description: string
}

export interface Role {
  id: string,
  name: string,
  roleGroup?: {
    id: number | null,
    name?: string
  }
}

export interface RoleGroup {
  id?: number,
  name: string,
  roles?: [
    {
      id: string,
      name: string,
    }
  ]
}

export interface Department {
  id?: string
  name: string
  description: string
  roles: string[]
  isDefault: boolean
}

export interface Marketplace {
  id?: number,
  name: string,
  enabled: boolean
}

export interface Organization {
  id?: string
  name: string
  phone: string
  email: string
  fullName: string
  legalAddress: string
  inn: string
  kpp: string
  ogrn: string
  okpo: string
  isDefault: boolean
}

export interface Counterparty {
  id?: string
  name: string
  phone: string
  email: string
  fullName: string
  legalAddress: string
  inn: string
  kpp: string
  ogrn: string
  okpo: string
  isFulfilment: boolean
}

export interface Bank {
  id?: string
  bik?: number
  name: string
  address: string
  correspondentAccount: string
}

export interface SettlementAccount {
  id?: string
  bank: Bank
  settlementAccount: string
  isDefault: boolean
}

export interface Project {
  id?: string
  name: string
  description: string
  isDefault: boolean
}

export interface ProductGroup {
  id?: string
  name: string
  productGroups?: ProductGroup[],
  parentGroup? : ProductGroup,

}

export interface Language {
  id: number,
  code: string,
  name: string,
  locale: string,
  image: string,
  enabled: boolean
}

export interface Warehouse {
  id?: string
  name: string
  description: string
  isDefault: boolean
}

export interface Barcode {
  marketplace?: Marketplace
  type: string
  code: string
  new?: boolean
}

export interface ModificationAttribute {
  id?: number
  name: string
}

export interface ProductImage {
  id: string|undefined,
  isDefault: boolean,
  file: string
}

export interface ProductOfSet {
  id: string
  name?: string
  sku?: string
  code?: string
  price?: number
}


export interface ProductSetItem {
  product: ProductOfSet
  quantity: number
}

export interface ProductCustomField {
  id?: string
  name: string
  type: string
  value: string
}


export interface ProductModification {
  id?: number
  name?: string
  productModificationValues: ProductModificationValue[]
}

export interface ProductModificationValue {
  attribute: ModificationAttribute
  value?: string
  values: string[]
}

export interface Product {
  id?: string
  name: string
  sku: string
  code: string
  vat?: number
  isEnabled: boolean
  weight?: number
  volume?: number
  width?: number
  height?: number
  length?: number
  color?: string
  isSet: boolean
  pricePurchase?: number
  priceMin?: number
  priceRrp?: number
  price?: number
  priceSale?: number
  brand?: {
    id?: number,
    name: string
  }
  images: ProductImage[]
  barcodes: Barcode[]
  customFields: ProductCustomField[]
  productGroup: {
    id: string,
    name: string
  }
  productSetItems?: ProductSetItem[]
  count?: number
  productModifications?: ProductModification[]
  hasModification: boolean
}


export interface ProductDescription {
  marketplace?: Marketplace
  content: string
}

export interface Pagination {
  offset: number|undefined
  limit: number|undefined
  total: number
}

export interface PaginatedProducts {
  items: Product[]
  pagination: Pagination
}

export interface PurchaseProduct {
  id: number
  quantity: number
  credit: number
  return: number
  price: number
  vat: number
  amount: number
  product: ProductOfSet
}

export interface Purchase {
  id?: string
  number: string
  draft: boolean
  purchaseAt: number
  plannedAt?: number
  amount: number
  amountCredited: number
  amountPayed: number
  amountReturn: number
  status?: Status
  organization?: Organization
  counterparty?: Counterparty
  warehouse?: Warehouse
  project?: Project
  purchaseProducts: PurchaseProduct[]
  tags: Tag[]
  images: ProductImage[]
}

export interface OrderProduct {
  id: string
  product: ProductOfSet
  quantity: number,
  shipped: number,
  return: number,
  price: number,
  vat: number,
  amount: number

}
export interface Order {
  id?: string
  number: string
  draft: boolean
  orderAt: number
  plannedAt?: number
  organization?: Organization
  counterparty?: Counterparty
  warehouse?: Warehouse
  project?: Project
  address: string
  reserved: boolean
  shipped: boolean
  return: boolean
  amount: number
  amountShipped: number
  amountReturn: number
  status?: Status
  tags: Tag[]
  orderProducts: OrderProduct[]
  images: ProductImage[]
}

export interface OrderLog {
  id?: number,
  type: string,
  data: any,
  createdAt: any,
  modifiedAt?: any
  createdBy?: {
    id: string,
    firstName: string,
    lastName: string,
    middleName: string,
  }
  // text?: string
}

export interface Status {
  id?: number
  type: string
  name: string
}

export interface Tag {
  id?: number
  slug?: string
  name: string
}

export interface PurchaseLog {
  id?: number,
  type: string,
  data: any,
  createdAt: any,
  modifiedAt?: any
  createdBy?: {
    id: string,
    firstName: string,
    lastName: string,
    middleName: string,
  }
}

export interface Comment {
  id?: number,
  text: string
}

export interface EmployeeRoles {
  allRoles: string[],
  inheritedRoles: string[],
  roles: string[],
}

export interface ProductStock {
  id?: number,
  warehouse: Warehouse,
  product: Product,
  count: number,
}

export interface Transaction {
  id?: string,
  draft: boolean,
  receive: boolean,
  purchase?: Purchase,
  order?: Order,
  warehouse?: Warehouse,
  organization?: Organization,
  project?: Project,
  createdBy?: {
    id: string,
    firstName: string,
    lastName: string,
  },
  products: PurchaseProduct[],
  createdAt: number,
  modifiedAt: number,
  amount: number
}

//   id?: string
//   number: string
//   draft: boolean
//   purchaseAt: number
//   plannedAt?: number
//   amount: number
//   amountCredited: number
//   amountPayed: number
//   amountReturn: number
//   status?: Status
//   organization?: Organization
//   counterparty?: Counterparty
//   warehouse?: Warehouse
//   project?: Project
//   purchaseProducts: PurchaseProduct[]
//   tags: Tag[]
