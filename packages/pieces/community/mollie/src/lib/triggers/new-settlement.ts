
import { createTrigger, TriggerStrategy, PiecePropValueSchema  } from '@activepieces/pieces-framework';
import { DedupeStrategy, Polling, pollingHelper } from '@activepieces/pieces-common';
import { mollieApiService } from '../common/requests';
import { mollieOrgAuth } from '../common/auth';

const polling: Polling<string, Record<string, never>> = {
  strategy: DedupeStrategy.LAST_ITEM,
  items: async ({ auth, lastItemId }) => {
    try {
      const response = await mollieApiService.fetchSettlements({
        access_token: auth,
        from: lastItemId as string,
      });

      const settlements = response._embedded.settlements;

      return settlements.map((settlement) => ({
        id: settlement.id,
        data: settlement,
      }));
    } catch (error) {
      console.error('Error fetching settlements for polling:', error);
      return [];
    }
  },
};

export const newSettlement = createTrigger({
    auth: mollieOrgAuth(['organizations.read']),
    name: 'newSettlement',
    displayName: 'New Settlement',
    description: 'Fires when a new settlement is created in Mollie',
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