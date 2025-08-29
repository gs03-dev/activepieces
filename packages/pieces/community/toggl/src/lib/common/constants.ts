import { PieceAuth } from '@activepieces/pieces-framework';
import { togglApiService } from './requests';

export const BASE_URL = 'https://api.track.toggl.com';

export const BASE_URLS = {
  api: `${BASE_URL}/api/v9`,
  webhook: `${BASE_URL}/webhooks/api/v1`,
} as const;

export const togglAuth = PieceAuth.SecretText({
  displayName: 'API Token',
  description: 'Your Toggl Track API token.',
  required: true,
  validate: async ({ auth }) => {
    try {
      await togglApiService
        .fetchCurrentlyLoggedInUser(auth)
        .catch((err) => {
          throw new Error(
            'something went wrong. Please check your username and API key and try again.'
          );
        });

      return {
        valid: true,
      };
    } catch (error) {
      return {
        valid: false,
        error: `Connection failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      };
    }
  },
});

export const API_ENDPOINTS = {
  ME: '/me',
  SUBSCRIPTIONS: '/subscriptions',
  WORKSPACES: '/workspaces',
};
