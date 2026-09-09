import type { INodeProperties } from 'n8n-workflow';

const showOnlyForMetrics = {
	resource: ['stats'],
	operation: ['getMetrics'],
};

/**
 * The values below are the dimensions Umami accepts in the `type` parameter:
 * event columns (page and campaign attributes) and session columns (visitor
 * attributes). Anything outside this set is rejected by the API.
 */
export const statsMetricsDescription: INodeProperties[] = [
	{
		displayName: 'Dimension',
		name: 'type',
		type: 'options',
		required: true,
		displayOptions: { show: showOnlyForMetrics },
		options: [
			{ name: 'Browser', value: 'browser' },
			{ name: 'City', value: 'city' },
			{ name: 'Country', value: 'country' },
			{ name: 'Device', value: 'device' },
			{ name: 'Entry Page', value: 'entry' },
			{ name: 'Event', value: 'event' },
			{ name: 'Exit Page', value: 'exit' },
			{ name: 'Hostname', value: 'hostname' },
			{ name: 'Language', value: 'language' },
			{ name: 'Operating System', value: 'os' },
			{ name: 'Page Title', value: 'title' },
			{ name: 'Query', value: 'query' },
			{ name: 'Referrer', value: 'referrer' },
			{ name: 'Region', value: 'region' },
			{ name: 'Screen Size', value: 'screen' },
			{ name: 'Tag', value: 'tag' },
			{ name: 'URL Path', value: 'path' },
			{ name: 'UTM Campaign', value: 'utmCampaign' },
			{ name: 'UTM Content', value: 'utmContent' },
			{ name: 'UTM Medium', value: 'utmMedium' },
			{ name: 'UTM Source', value: 'utmSource' },
			{ name: 'UTM Term', value: 'utmTerm' },
		],
		default: 'path',
		description:
			'Which dimension to break the traffic down by. Each row is returned as x (the value) and y (the number of visitors). Note that y counts unique visitors, not pageviews — one visitor loading a page four times counts once. Use Get Summary for pageview totals.',
		routing: {
			send: { type: 'query', property: 'type' },
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: showOnlyForMetrics },
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
		routing: {
			send: { type: 'query', property: 'limit' },
			output: {
				maxResults: '={{$value}}',
			},
		},
	},
];
