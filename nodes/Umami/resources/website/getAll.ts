import type { INodeProperties } from 'n8n-workflow';

const showOnlyForWebsiteGetMany = {
	operation: ['getAll'],
	resource: ['website'],
};

export const websiteGetManyDescription: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForWebsiteGetMany,
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		routing: {
			send: {
				paginate: '={{ $value }}',
			},
			operations: {
				pagination: {
					// Umami pages by page number, not by row offset.
					type: 'offset',
					properties: {
						limitParameter: 'pageSize',
						offsetParameter: 'page',
						pageSize: 100,
						rootProperty: 'data',
						type: 'query',
					},
				},
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				...showOnlyForWebsiteGetMany,
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		routing: {
			send: {
				type: 'query',
				property: 'pageSize',
			},
			output: {
				maxResults: '={{$value}}',
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add option',
		displayOptions: { show: showOnlyForWebsiteGetMany },
		default: {},
		options: [
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Filter websites by name or domain',
				routing: {
					send: { type: 'query', property: 'search' },
				},
			},
			{
				displayName: 'Include Teams',
				name: 'includeTeams',
				type: 'boolean',
				default: false,
				description: 'Whether to include websites shared through a team',
				routing: {
					// The API treats any non-empty value as true, so send the flag
					// only when it is switched on.
					send: {
						type: 'query',
						property: 'includeTeams',
						value: '={{ $value ? "1" : undefined }}',
					},
				},
			},
		],
	},
];
