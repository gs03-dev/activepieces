
import { createTrigger, TriggerStrategy, PiecePropValueSchema  } from '@activepieces/pieces-framework';
import { DedupeStrategy, Polling, pollingHelper } from '@activepieces/pieces-common';
import { mollieApiService } from '../common/requests';
import { mollieAPIKeyAuth } from '../common/auth';

const polling: Polling<string, Record<string, never>> = {
  strategy: DedupeStrategy.LAST_ITEM,
  items: async ({ auth, lastItemId }) => {
    try {
      const response = await mollieApiService.fetchOrders({
        api_key: auth,
        from: lastItemId as string,
      });

      const orders = response._embedded.orders;

      return orders.map((order) => ({
        id: order.id,
        data: order,
      }));
    } catch (error) {
      console.error('Error fetching orders for polling:', error);
      return [];
    }
  },
};

export const newOrder = createTrigger({
  auth: mollieAPIKeyAuth,
  name: 'newOrder',
  displayName: 'New Order',
  description: 'Fires When a new Order is created in Mollie',
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