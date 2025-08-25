
import { createTrigger, TriggerStrategy, PiecePropValueSchema  } from '@activepieces/pieces-framework';
import { DedupeStrategy, Polling, pollingHelper } from '@activepieces/pieces-common';
import dayjs from 'dayjs';
import { mollieOrgAuth } from '../common/auth';
import { mollieApiService } from '../common/requests';

const polling: Polling<string, Record<string, never>> = {
  strategy: DedupeStrategy.LAST_ITEM,
  items: async ({ auth, lastItemId }) => {
    try {
      const response = await mollieApiService.fetchInvoices({
        access_token: auth,
        from: lastItemId as string,
      });

      const invoices = response._embedded.invoices;

      return invoices.map((invoice) => ({
        id: invoice.id,
        data: invoice,
      }));
    } catch (error) {
      console.error('Error fetching invoices for polling:', error);
      return [];
    }
  },
};

export const newInvoice = createTrigger({
    auth: mollieOrgAuth(['invoices.read']),
    name: 'newInvoice',
    displayName: 'New Invoice',
    description: 'Fired When an invoice is generated in Mollie',
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