import type { INodeProperties } from 'n8n-workflow';
import { statsSharedDescription } from './shared';
import { statsMetricsDescription } from './metrics';

const showOnlyForStats = {
	resource: ['stats'],
};

export const statsDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForStats,
		},
		options: [
			{
				name: 'Get Summary',
				value: 'getSummary',
				action: 'Get a summary of website statistics',
				description:
					'Get totals for pageviews, visitors, visits, bounces and time on site',
				routing: {
					request: {
						method: 'GET',
						url: '=/websites/{{$parameter.websiteId}}/stats',
					},
				},
			},
			{
				name: 'Get Pageviews',
				value: 'getPageviews',
				action: 'Get pageviews over time',
				description: 'Get a pageview and session time series for a date range',
				routing: {
					request: {
						method: 'GET',
						url: '=/websites/{{$parameter.websiteId}}/pageviews',
					},
				},
			},
			{
				name: 'Get Metrics',
				value: 'getMetrics',
				action: 'Get metrics for a dimension',
				description:
					'Get the top values for one dimension, such as URL, referrer, browser or country',
				routing: {
					request: {
						method: 'GET',
						url: '=/websites/{{$parameter.websiteId}}/metrics',
					},
				},
			},
			{
				name: 'Get Active Visitors',
				value: 'getActive',
				action: 'Get active visitors',
				description: 'Get the number of visitors currently on the site',
				routing: {
					request: {
						method: 'GET',
						url: '=/websites/{{$parameter.websiteId}}/active',
					},
				},
			},
		],
		default: 'getSummary',
	},
	...statsSharedDescription,
	...statsMetricsDescription,
];
