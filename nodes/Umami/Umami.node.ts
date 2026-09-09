import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { websiteDescription } from './resources/website';
import { statsDescription } from './resources/stats';

export class Umami implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Umami',
		name: 'umami',
		icon: { light: 'file:umami.svg', dark: 'file:umami.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Read website analytics from Umami',
		defaults: {
			name: 'Umami',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'umamiApi',
				required: true,
			},
		],
		requestDefaults: {
			// Umami Cloud is a fixed host; a self-hosted instance serves the same
			// API under <instance>/api, so the base URL follows the credential.
			baseURL:
				'={{$credentials.hostingType === "cloud" ? "https://api.umami.is/v1" : $credentials.instanceUrl.replace(/\\/$/, "") + "/api"}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Website',
						value: 'website',
					},
					{
						name: 'Statistic',
						value: 'stats',
					},
				],
				default: 'website',
			},
			...websiteDescription,
			...statsDescription,
		],
	};
}
