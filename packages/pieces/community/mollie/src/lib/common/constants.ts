export const BASE_URL = 'https://api.mollie.com/v2';

export const API_ENPOINTS = {
    CUSTOMERS: "/customers",
    ORDERS: "/orders",
    PAYMENTS: "/payments",
    REFUNDS: "/refunds",
    CHARGEBACKS: "/chargebacks",
    INVOICES: "/invoices",
    ORGANIZATIONS: "/organizations",
    METHODS: "/methods",
}

export interface MollieRefundListResponse {
  count: number;
  _embedded: {
    refunds: MollieRefund[];
  };
  _links: MolliePaginationLinks;
}

export interface MollieRefund {
  resource: 'refund';
  id: string;
  mode: 'live' | 'test';
  description: string;
  amount: MollieAmount;
  status: string;
  metadata: Record<string, any> | null;
  paymentId: string;
  createdAt: string;
  _links: {
    self: MollieLink;
    payment: MollieLink;
    documentation: MollieLink;
  };
}

export interface MollieInvoiceListResponse {
  count: number;
  _embedded: {
    invoices: MollieInvoice[];
  };
  _links: MolliePaginationLinks;
}

export interface MollieInvoice {
  resource: 'invoice';
  id: string;
  reference: string;
  vatNumber: string;
  status: 'open' | 'paid' | 'overdue' | string;
  netAmount: MollieAmount;
  vatAmount: MollieAmount;
  grossAmount: MollieAmount;
  lines: MollieInvoiceLine[];
  issuedAt: string;
  dueAt: string;
  _links: {
    self: MollieLink;
  };
}

export interface MollieInvoiceLine {
  period: string;
  description: string;
  count: number;
  vatPercentage: number;
  amount: MollieAmount;
}

export interface MollieCustomerListResponse {
  count: number;
  _embedded: {
    customers: MollieCustomer[];
  };
  _links: MolliePaginationLinks;
}

export interface MollieCustomer {
  resource: 'customer';
  id: string;
  mode: 'live' | 'test';
  name: string;
  email: string;
  locale: string;
  metadata: Record<string, any> | null;
  createdAt: string;
  _links: {
    self: MollieLink;
    dashboard: MollieLink;
    documentation: MollieLink;
  };
}

export interface MolliePaymentListResponse {
  count: number;
  _embedded: {
    payments: MolliePayment[];
  };
  _links: MolliePaginationLinks;
}

export interface MolliePayment {
  resource: 'payment';
  id: string;
  mode: 'live' | 'test';
  status: string;
  isCancelable: boolean;
  sequenceType: string;
  amount: MollieAmount;
  description: string;
  method: string;
  metadata: Record<string, any> | null;
  details: Record<string, any> | null;
  profileId: string;
  redirectUrl: string;
  createdAt: string;
  expiresAt: string;
  _links: {
    self: MollieLink;
    checkout: MollieLink;
    dashboard: MollieLink;
  };
}

export interface MollieChargebackListResponse {
  count: number;
  _embedded: {
    chargebacks: MollieChargeback[];
  };
  _links: MolliePaginationLinks;
}

export interface MollieChargeback {
  resource: 'chargeback';
  id: string;
  amount: MollieAmount;
  settlementAmount: MollieAmount;
  reason: {
    code: string;
    description: string;
  };
  paymentId: string;
  createdAt: string;
  reversedAt: string | null;
  _links: {
    self: MollieLink;
    payment: MollieLink;
    documentation: MollieLink;
  };
}

export interface MollieOrderListResponse {
  count: number;
  _embedded: {
    orders: MollieOrder[];
  };
  _links: MolliePaginationLinks;
}

export interface MollieOrder {
  resource: 'order';
  id: string;
  mode: 'live' | 'test';
  orderNumber: string;
  lines: MollieOrderLine[];
  amount: MollieAmount;
  billingAddress: MollieAddress;
  shippingAddress?: MollieAddress;
  redirectUrl: string;
  webhookUrl?: string;
  profileId: string;
  status: MollieOrderStatus;
  isCancelable: boolean;
  createdAt: string;
  expiresAt: string;
  expiredAt?: string;
  paidAt?: string;
  authorizedAt?: string;
  canceledAt?: string;
  completedAt?: string;
  metadata?: Record<string, any>;
  _links: {
    self: MollieLink;
    checkout?: MollieLink;
    dashboard: MollieLink;
    documentation?: MollieLink;
  };
}

export interface MollieOrderLine {
  resource: 'orderline';
  id: string;
  orderId: string;
  name: string;
  sku?: string;
  type:
    | 'physical'
    | 'discount'
    | 'digital'
    | 'shipping_fee'
    | 'store_credit'
    | 'gift_card'
    | 'surcharge';
  status:
    | 'created'
    | 'authorized'
    | 'paid'
    | 'shipping'
    | 'completed'
    | 'canceled';
  isCancelable: boolean;
  quantity: number;
  quantityShipped?: number;
  amountShipped?: MollieAmount;
  quantityRefunded?: number;
  amountRefunded?: MollieAmount;
  quantityCanceled?: number;
  amountCanceled?: MollieAmount;
  shippableQuantity?: number;
  refundableQuantity?: number;
  cancelableQuantity?: number;
  unitPrice: MollieAmount;
  discountAmount?: MollieAmount;
  totalAmount: MollieAmount;
  vatRate: string;
  vatAmount: MollieAmount;
  category?: string;
  createdAt: string;
  _links?: {
    productUrl?: MollieLink;
    imageUrl?: MollieLink;
  };
}

export interface MollieAmount {
  currency: string;
  value: string;
}

export interface MollieAddress {
  organizationName?: string;
  title?: string;
  givenName?: string;
  familyName?: string;
  email?: string;
  phone?: string;
  streetAndNumber?: string;
  streetAdditional?: string;
  postalCode?: string;
  city?: string;
  region?: string;
  country?: string;
}

export type MollieOrderStatus =
  | 'created'
  | 'paid'
  | 'authorized'
  | 'canceled'
  | 'shipping'
  | 'completed'
  | 'expired';

export interface MollieSettlementListResponse {
  count: number;
  _embedded: {
    settlements: MollieSettlement[];
  };
  _links: MolliePaginationLinks;
}

export interface MollieSettlement {
  resource: 'settlement';
  id: string;
  reference: string;
  status: MollieSettlementStatus;
  createdAt: string;
  settledAt?: string;
  amount: MollieAmount;
  balanceId?: string;
  periods: MollieSettlementPeriods;
  invoiceId?: string;
  _links: {
    self: MollieLink;
    payments: MollieLink;
    refunds: MollieLink;
    chargebacks: MollieLink;
    captures: MollieLink;
    invoice?: MollieLink;
    documentation?: MollieLink;
  };
}

export type MollieSettlementStatus =
  | 'open'
  | 'pending'
  | 'paidout'
  | 'failed';

export interface MollieSettlementPeriods {
  [year: string]: {
    [month: string]: {
      revenue?: MollieSettlementRevenue[];
      costs?: MollieSettlementCost[];
    };
  };
}

export interface MollieSettlementRevenue {
  description: string;
  method: string;
  count: number;
  amountNet: MollieAmount;
  amountVat: MollieAmount | null;
  amountGross: MollieAmount;
}

export interface MollieSettlementCost {
  description: string;
  method: string;
  count: number;
  rate: {
    fixed?: MollieAmount;
    percentage?: string | null;
    variable?: MollieAmount;
  };
  amountNet: MollieAmount;
  amountVat: MollieAmount | null;
  amountGross: MollieAmount;
}

export interface MolliePaginationLinks {
  self: MollieLink;
  previous: MollieLink | null;
  next: MollieLink | null;
  documentation: MollieLink;
}

export interface MollieLink {
  href: string;
  type: string;
}