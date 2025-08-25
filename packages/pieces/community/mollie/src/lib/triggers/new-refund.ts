
import { createTrigger, TriggerStrategy, PiecePropValueSchema  } from '@activepieces/pieces-framework';
import { DedupeStrategy, Polling, pollingHelper } from '@activepieces/pieces-common';
import dayjs from 'dayjs';
import { mollieApiService } from '../common/requests';
import { mollieAPIKeyAuth } from '../common/auth';


const polling: Polling<string, Record<string, never>> = {
  strategy: DedupeStrategy.LAST_ITEM,
  items: async ({ auth, lastItemId }) => {
    try {
      const response = await mollieApiService.fetchRefunds({
        api_key: auth,
        from: lastItemId as string,
      });

      const refunds = response._embedded.refunds;

      return refunds.map((refund) => ({
        id: refund.id,
        data: refund,
      }));
    } catch (error) {
      console.error('Error fetching refunds for polling:', error);
      return [];
    }
  },
};

export const newRefund = createTrigger({
    auth: mollieAPIKeyAuth,
    name: 'newRefund',
    displayName: 'New Refund',
    description: 'Fires when a payment refund is created.',
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