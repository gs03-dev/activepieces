import { createTrigger, TriggerStrategy } from '@activepieces/pieces-framework';
import { togglAuth } from '../common/constants';
import { workspacesDropdown } from '../common/props';
import { togglApiService } from '../common/requests';
import { WebhookHandshakeStrategy } from '@activepieces/shared';

const CACHE_KEY = 'toggl_new_client_trigger';
const MODULE_NAME = 'New Client';

export const newClientCreated = createTrigger({
  auth: togglAuth,
  name: 'newClient',
  displayName: `${MODULE_NAME} Created`,
  description: 'Triggers when a new client is created in a workspace',
  props: {
    workspaceId: workspacesDropdown(['auth']),
  },
  sampleData: {},
  type: TriggerStrategy.WEBHOOK,
  handshakeConfiguration: {
    strategy: WebhookHandshakeStrategy.BODY_PARAM_PRESENT,
    paramName: 'validation_code',
  },
  async onHandshake(context) {
    console.log('[HANDSHAKE] payload:', context.payload);

    const body = context.payload.body as any;
    if (body?.validation_code) {
      console.log('[HANDSHAKE] Found validation_code:', body.validation_code);
      return {
        status: 200,
        body: { validation_code: body.validation_code },
      };
    }

    return {
      status: 400,
      body: { error: 'No validation_code found' },
    };
  },
  async onEnable({ auth, webhookUrl, propsValue: { workspaceId }, store }) {
    if (!workspaceId) {
      throw new Error('Workspace ID is required. Please select a workspace.');
    }

    try {
      const response: any = await togglApiService.createWebhook(
        auth,
        workspaceId as string,
        {
          enabled: true,
          description: `Activepieces ${MODULE_NAME} Webhook Subscription ${Date.now()}`,
          event_filters: [
            {
              entity: 'client',
              action: 'created',
            },
          ],
          url_callback: webhookUrl,
        }
      );

      const webhookId = response.subscription_id;

      await store.put(CACHE_KEY, { webhookId });
    } catch (error) {
      console.error('Failed to create Toggl webhook:', error);
      throw new Error(
        `Failed to create webhook: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  },
  async onDisable({ auth, store, propsValue: { workspaceId } }) {
    const cachedData = (await store.get(CACHE_KEY)) as any;

    if (cachedData) {
      await togglApiService
        .deleteWebhook(auth, workspaceId as string, cachedData.webhookId)
        .then(async () => {
          await store.delete(CACHE_KEY);
        });
    }
  },
  async run(context) {
    const payload = context.payload.body as any;
    console.log('HEADERS', context.payload.headers);
    console.log('BODY', context.payload.body);
    return [payload];
  },
});
