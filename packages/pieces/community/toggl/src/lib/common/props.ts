import { Property } from '@activepieces/pieces-framework';
import { togglApiService } from './requests';

export const workspacesDropdown = (refreshers: string[]) =>
  Property.Dropdown({
    displayName: 'Workspace',
    description: 'Select A Workspace',
    required: true,
    refreshers,
    options: async ({ auth }: any) => {
      if (!auth) {
        return {
          disabled: true,
          options: [],
          placeholder: 'Please connect your Toggl account first',
        };
      }

      try {
        const workspaces = await togglApiService.fetchWorkspaces(auth);

        return {
          options: workspaces.map((workspace: any) => ({
            label: workspace.name,
            value: workspace.id,
          })),
        };
      } catch (error) {
        return {
          disabled: true,
          options: [],
          placeholder:
            'Failed to load workspaces. Please check your authentication.',
        };
      }
    },
  });
