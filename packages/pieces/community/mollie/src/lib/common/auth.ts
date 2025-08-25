import { PieceAuth, createPiece } from '@activepieces/pieces-framework';
import { mollieApiService } from './requests';

export const mollieAPIKeyAuth = PieceAuth.SecretText({
  displayName: 'Mollie API Key',
  description: 'Enter your Mollie API key (live_... or test_...)',
  required: true,
  validate: async ({ auth }) => {
    if (!auth.startsWith('live_') && !auth.startsWith('test_')) {
      return {
        valid: false,
        error: 'API key must start with "live_" or "test_"',
      };
    }

    try {
      await mollieApiService.fetchPaymentMethods({
        api_key: auth
      })

      return {
        valid: true,
      };
    } catch (error) {
      return {
        valid: false,
        error: 'Failed to validate API key',
      };
    }
  },
});

export const mollieOrgAuth = (scopes?: string[]) =>
  PieceAuth.SecretText({
    displayName: 'Organization Access Token',
    description: `Enter your Mollie Organization Access Token. ${
      scopes && scopes.length > 0 &&
      `Access Token With "${scopes?.join(', ')}" is required`
    }`,
    required: true,
    validate: async ({ auth }) => {
      try {
        await mollieApiService.fetchCurrentOrg({
          access_token: auth,
        });

        return {
          valid: true,
        };
      } catch (error) {
        return {
          valid: false,
          error: 'Failed to validate organization access token',
        };
      }
    },
  });