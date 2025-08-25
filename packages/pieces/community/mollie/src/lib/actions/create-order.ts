import { createAction, Property } from '@activepieces/pieces-framework';

export const createOrder = createAction({
  // auth: check https://www.activepieces.com/docs/developers/piece-reference/authentication,
  name: 'createOrder',
  displayName: 'Create Order',
  description: 'Create a new order in Mollie.',
  props: {},
  async run() {
    // Action logic here
  },
});
