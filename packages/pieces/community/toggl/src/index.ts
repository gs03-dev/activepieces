import { createPiece, PieceAuth } from '@activepieces/pieces-framework';
import { togglAuth } from './lib/common/constants';
import { newClientCreated } from './lib/triggers/new-client';

export const toggl = createPiece({
  displayName: 'Toggl',
  auth: togglAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/toggl.png',
  authors: ['gs03-dev'],
  actions: [],
  triggers: [newClientCreated],
});
