import type { INodeProperties } from 'n8n-workflow';
import { websiteGetDescription } from './get';
import { websiteGetManyDescription } from './getAll';

const showOnlyForWebsites = {
	resource: ['website'],
};

export const websiteDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForWebsites,
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a website',
				description: 'Get a single tracked website',
				routing: {
					request: {
						method: 'GET',
						url: '=/websites/{{$parameter.websiteId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many websites',
				description: 'Get the websites this account can access',
				routing: {
					request: {
						method: 'GET',
						url: '/websites',
					},
					output: {
						// The list endpoint wraps its rows in a paged envelope.
						postReceive: [
							{
								type: 'rootProperty',
								properties: { property: 'data' },
							},
						],
					},
				},
			},
		],
		default: 'getAll',
	},
	...websiteGetDescription,
	...websiteGetManyDescription,
];
