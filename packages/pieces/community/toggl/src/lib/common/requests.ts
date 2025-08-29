import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { API_ENDPOINTS, BASE_URLS } from './constants';

async function fireHttpRequest<T>({
  method,
  auth,
  path,
  body,
  type = 'api',
  baseOverrideUrl
}: {
  auth: string;
  method: HttpMethod;
  path: string;
  body?: unknown;
  type?: keyof typeof BASE_URLS;
  baseOverrideUrl?: string
}) {
  const base64Token = Buffer.from(`${auth}:api_token`).toString('base64');

  return await httpClient
    .sendRequest({
      method,
      url: baseOverrideUrl || `${BASE_URLS[type]}${path}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Basic ${base64Token}`,
      },
      body,
    })
    .then((res) => res.body);
}

export const togglApiService = {
  fetchCurrentlyLoggedInUser: async (auth: string) => {
    const response = await fireHttpRequest({
      method: HttpMethod.GET,
      auth,
      path: API_ENDPOINTS.ME,
    });

    return response;
  },
  fetchWorkspaces: async (auth: string) => {
    const response = await fireHttpRequest({
      method: HttpMethod.GET,
      auth,
      path: API_ENDPOINTS.WORKSPACES,
    });

    return response;
  },
  createWebhook: async (auth: string, workspaceId: string, payload: any) => {
    const response = await fireHttpRequest({
      method: HttpMethod.POST,
      auth,
      path: `${API_ENDPOINTS.SUBSCRIPTIONS}/${workspaceId}`,
      body: payload,
      type: 'webhook',
    });

    return response;
  },
  deleteWebhook: async (
    auth: string,
    workspaceId: string,
    webhookId: string
  ) => {
    const response = await fireHttpRequest({
      method: HttpMethod.DELETE,
      auth,
      path: `${API_ENDPOINTS.SUBSCRIPTIONS}/${workspaceId}/${webhookId}`,
      type: 'webhook',
    });

    return response;
  },
  validateWebhookCreationRequest: async (
    auth: string,
    url: string
  ) => {
    const response = await fireHttpRequest({
      method: HttpMethod.GET,
      auth,
      path: ``,
      baseOverrideUrl: url
    });

    return response;
  },
};
