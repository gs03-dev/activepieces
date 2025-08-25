
import { createTrigger, TriggerStrategy, PiecePropValueSchema  } from '@activepieces/pieces-framework';
import { DedupeStrategy, Polling, pollingHelper } from '@activepieces/pieces-common';
import dayjs from 'dayjs';
import { mollieAPIKeyAuth } from '../common/auth';
import { mollieApiService } from '../common/requests';

const polling: Polling<string, Record<string, never>> = {
  strategy: DedupeStrategy.LAST_ITEM,
  items: async ({ auth, lastItemId }) => {
    try {
      const response = await mollieApiService.fetchChargebacks({
        api_key: auth,
        from: lastItemId as string,
      });

      const chargebacks = response._embedded.chargebacks;

      return chargebacks.map((chargeback) => ({
        id: chargeback.id,
        data: chargeback,
      }));
    } catch (error) {
      console.error('Error fetching chargebacks for polling:', error);
      return [];
    }
  },
};

export const newPaymentChargeback = createTrigger({
    auth: mollieAPIKeyAuth,
    name: 'newPaymentChargeback',
    displayName: 'New Payment Chargeback',
    description: 'Fires upon a payment chargeback event.',
    props: {},
    sampleData: {},
    type: TriggerStrategy.POLLING,
    async test(context) {
        return await pollingHelper.test(polling, context);
    },
    async onEnable(context) {
        const { store, auth, propsValue } = context;
        await pollingHelper.onEnable(polling, { store, auth, propsValue });
    },

    async onDisable(context) {
        const { store, auth, propsValue } = context;
        await pollingHelper.onDisable(polling, { store, auth, propsValue });
    },

    async run(context) {
        return await pollingHelper.poll(polling, context);
    },
});