import type { INodeProperties } from 'n8n-workflow';

const showOnlyForWebsiteGet = {
	operation: ['get'],
	resource: ['website'],
};

export const websiteGetDescription: INodeProperties[] = [
	{
		displayName: 'Website ID',
		name: 'websiteId',
		type: 'string',
		required: true,
		displayOptions: { show: showOnlyForWebsiteGet },
		default: '',
		placeholder: '0e3e1b0f-1a2b-4c3d-9e8f-7a6b5c4d3e2f',
		description: 'UUID of the website. Use "Get Many" to look one up.',
	},
];
