import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

/**
 * Umami supports two deployments with different authentication schemes:
 *
 *   - Umami Cloud sends an API key in the `x-umami-api-key` header against
 *     https://api.umami.is/v1.
 *   - Self-hosted Umami sends a JWT in the `Authorization: Bearer` header
 *     against <your-instance>/api.
 *
 * Both header fields are always declared. Each one resolves to an empty string
 * when the other hosting type is selected, and n8n omits headers whose value is
 * empty, so exactly one credential is sent per request.
 */
export class UmamiApi implements ICredentialType {
	name = 'umamiApi';

	displayName = 'Umami API';

	icon: Icon = {
		light: 'file:../nodes/Umami/umami.svg',
		dark: 'file:../nodes/Umami/umami.dark.svg',
	};

	documentationUrl = 'https://github.com/gaspard9819-droid/n8n-nodes-umami?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'Hosting',
			name: 'hostingType',
			type: 'options',
			options: [
				{
					name: 'Umami Cloud',
					value: 'cloud',
					description: 'Hosted at cloud.umami.is, authenticated with an API key',
				},
				{
					name: 'Self-Hosted',
					value: 'selfHosted',
					description: 'Your own Umami instance, authenticated with a bearer token',
				},
			],
			default: 'cloud',
			description: 'Which Umami deployment to connect to',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			displayOptions: { show: { hostingType: ['cloud'] } },
			default: '',
			description: 'Create one under Settings → API keys in Umami Cloud',
		},
		{
			displayName: 'Instance URL',
			name: 'instanceUrl',
			type: 'string',
			displayOptions: { show: { hostingType: ['selfHosted'] } },
			default: '',
			placeholder: 'https://analytics.example.com',
			description: 'Base URL of your Umami instance, without a trailing slash or /api',
		},
		{
			displayName: 'Bearer Token',
			name: 'token',
			type: 'string',
			typeOptions: { password: true },
			displayOptions: { show: { hostingType: ['selfHosted'] } },
			default: '',
			description:
				'Token returned by POST /api/auth/login on your instance. See the README for how to obtain one.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-umami-api-key':
					'={{$credentials.hostingType === "cloud" ? $credentials.apiKey : ""}}',
				Authorization:
					'={{$credentials.hostingType === "selfHosted" ? "Bearer " + $credentials.token : ""}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL:
				'={{$credentials.hostingType === "cloud" ? "https://api.umami.is/v1" : $credentials.instanceUrl.replace(/\\/$/, "") + "/api"}}',
			url: '/me',
		},
	};
}
