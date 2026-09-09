import type { INodeProperties } from 'n8n-workflow';

// Every statistics operation is scoped to one website.
const showForAllStats = {
	resource: ['stats'],
};

// The active-visitor count is a live reading, so it takes no date range.
const showForDatedStats = {
	resource: ['stats'],
	operation: ['getSummary', 'getPageviews', 'getMetrics'],
};

export const statsSharedDescription: INodeProperties[] = [
	{
		displayName: 'Website ID',
		name: 'websiteId',
		type: 'string',
		required: true,
		displayOptions: { show: showForAllStats },
		default: '',
		placeholder: '0e3e1b0f-1a2b-4c3d-9e8f-7a6b5c4d3e2f',
		description: 'UUID of the website. Use the Website resource to look one up.',
	},
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		displayOptions: { show: showForDatedStats },
		default: '',
		description: 'Beginning of the reporting period',
		routing: {
			send: {
				type: 'query',
				property: 'startAt',
				// Umami expects a UNIX timestamp in milliseconds.
				value: '={{ new Date($value).getTime() }}',
			},
		},
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		required: true,
		displayOptions: { show: showForDatedStats },
		default: '',
		description:
			'End of the reporting period. This is an exact moment, not a whole day — a date picked without a time means midnight, which excludes everything that happened that day. To include today, set tomorrow\'s date or an explicit end time.',
		routing: {
			send: {
				type: 'query',
				property: 'endAt',
				value: '={{ new Date($value).getTime() }}',
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add filter',
		displayOptions: { show: showForDatedStats },
		default: {},
		description: 'Narrow the results to a segment of traffic',
		options: [
			{
				displayName: 'Browser',
				name: 'browser',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'browser' } },
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				placeholder: 'HU',
				description: 'Two-letter ISO country code',
				routing: { send: { type: 'query', property: 'country' } },
			},
			{
				displayName: 'Device',
				name: 'device',
				type: 'string',
				default: '',
				placeholder: 'mobile',
				routing: { send: { type: 'query', property: 'device' } },
			},
			{
				displayName: 'Operating System',
				name: 'os',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'os' } },
			},
			{
				displayName: 'Path',
				name: 'path',
				type: 'string',
				default: '',
				placeholder: '/pricing',
				routing: { send: { type: 'query', property: 'path' } },
			},
			{
				displayName: 'Referrer',
				name: 'referrer',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'referrer' } },
			},
			{
				displayName: 'Timezone',
				name: 'timezone',
				type: 'string',
				default: '',
				placeholder: 'Europe/Budapest',
				description: 'Timezone the results are grouped by',
				routing: { send: { type: 'query', property: 'timezone' } },
			},
			{
				displayName: 'UTM Campaign',
				name: 'utmCampaign',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'utmCampaign' } },
			},
			{
				displayName: 'UTM Source',
				name: 'utmSource',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'utmSource' } },
			},
		],
	},
	{
		displayName: 'Group By',
		name: 'unit',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['stats'],
				operation: ['getPageviews'],
			},
		},
		options: [
			{ name: 'Hour', value: 'hour' },
			{ name: 'Day', value: 'day' },
			{ name: 'Month', value: 'month' },
			{ name: 'Year', value: 'year' },
		],
		default: 'day',
		description: 'Time bucket each data point covers',
		routing: {
			send: { type: 'query', property: 'unit' },
		},
	},
];
