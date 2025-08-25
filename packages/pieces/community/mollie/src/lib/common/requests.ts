import { HttpMethod, httpClient } from '@activepieces/pieces-common';
import { API_ENPOINTS, BASE_URL, MollieChargebackListResponse, MollieCustomerListResponse, MollieInvoiceListResponse, MollieOrderListResponse, MolliePaymentListResponse, MollieRefundListResponse, MollieSettlementListResponse } from './constants';

async function fireHttpRequest<T>({
  method,
  path,
  body,
  authorization_token,
}: {
  method: HttpMethod;
  path: string;
  authorization_token: string;
  body?: unknown;
}) {
  return await httpClient
    .sendRequest({
      method,
      url: `${BASE_URL}${path}`,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${authorization_token}`,
        'Content-Type': 'application/json',
      },
      body,
    })
    .then((res) => res.body as T)
    .catch((err) => {
      throw new Error(
        `Error in request to ${path}: ${err.message || JSON.stringify(err)}`
      );
    });
}

export const mollieApiService = {
  fetchCustomers: ({
    api_key,
    from,
  }: {
    api_key: string;
    from?: string;
  }): Promise<MollieCustomerListResponse> => {
    const params = new URLSearchParams();
    if (from) {
      params.append('from', from);
    }

    const url = `${API_ENPOINTS.CUSTOMERS}${
      params.toString() ? `?${params.toString()}` : ''
    }`;

    return fireHttpRequest<MollieCustomerListResponse>({
      method: HttpMethod.GET,
      path: url,
      authorization_token: api_key,
    });
  },
  fetchOrders: ({
    api_key,
    from,
  }: {
    api_key: string;
    from?: string;
  }): Promise<MollieOrderListResponse> => {
    const params = new URLSearchParams();
    if (from) {
      params.append('from', from);
    }

    const url = `${API_ENPOINTS.ORDERS}${
      params.toString() ? `?${params.toString()}` : ''
    }`;

    return fireHttpRequest<MollieOrderListResponse>({
      method: HttpMethod.GET,
      path: url,
      authorization_token: api_key,
    });
  },
  fetchPayments: ({
    api_key,
    from,
  }: {
    api_key: string;
    from?: string;
  }): Promise<MolliePaymentListResponse> => {
    const params = new URLSearchParams();
    if (from) {
      params.append('from', from);
    }

    const url = `${API_ENPOINTS.PAYMENTS}${
      params.toString() ? `?${params.toString()}` : ''
    }`;

    return fireHttpRequest<MolliePaymentListResponse>({
      method: HttpMethod.GET,
      path: url,
      authorization_token: api_key,
    });
  },
  fetchRefunds: ({
    api_key,
    from,
  }: {
    api_key: string;
    from?: string;
  }): Promise<MollieRefundListResponse> => {
    const params = new URLSearchParams();
    if (from) {
      params.append('from', from);
    }

    const url = `${API_ENPOINTS.REFUNDS}${
      params.toString() ? `?${params.toString()}` : ''
    }`;

    return fireHttpRequest<MollieRefundListResponse>({
      method: HttpMethod.GET,
      path: url,
      authorization_token: api_key,
    });
  },
  fetchChargebacks: ({
    api_key,
    from,
  }: {
    api_key: string;
    from?: string;
  }): Promise<MollieChargebackListResponse> => {
    const params = new URLSearchParams();
    if (from) {
      params.append('from', from);
    }

    const url = `${API_ENPOINTS.CHARGEBACKS}${
      params.toString() ? `?${params.toString()}` : ''
    }`;

    return fireHttpRequest<MollieChargebackListResponse>({
      method: HttpMethod.GET,
      path: url,
      authorization_token: api_key,
    });
  },
  fetchSettlements: ({
    access_token,
    from,
  }: {
    access_token: string;
    from?: string;
  }): Promise<MollieSettlementListResponse> => {
    const params = new URLSearchParams();
    if (from) {
      params.append('from', from);
    }

    const url = `${API_ENPOINTS.ORDERS}${
      params.toString() ? `?${params.toString()}` : ''
    }`;

    return fireHttpRequest<MollieSettlementListResponse>({
      method: HttpMethod.GET,
      path: url,
      authorization_token: access_token,
    });
  },
  fetchInvoices: ({
    access_token,
    from,
  }: {
    access_token: string;
    from?: string;
  }): Promise<MollieInvoiceListResponse> => {
    const params = new URLSearchParams();
    if (from) {
      params.append('from', from);
    }

    const url = `${API_ENPOINTS.INVOICES}${
      params.toString() ? `?${params.toString()}` : ''
    }`;

    return fireHttpRequest<MollieInvoiceListResponse>({
      method: HttpMethod.GET,
      path: url,
      authorization_token: access_token,
    });
  },
  fetchCurrentOrg: ({
    access_token,
  }: {
    access_token: string;
  }): Promise<any> => {
    return fireHttpRequest({
      method: HttpMethod.GET,
      path: `${API_ENPOINTS.ORGANIZATIONS}/me`,
      authorization_token: access_token,
    });
  },
  fetchPaymentMethods: ({ api_key }: { api_key: string }): Promise<any> => {
    return fireHttpRequest({
      method: HttpMethod.GET,
      path: `${API_ENPOINTS.METHODS}`,
      authorization_token: api_key,
    });
  },
};