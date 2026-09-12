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

// Explicit Start/End only apply when Period is set to a custom range.
const showForCustomRange = {
	...showForDatedStats,
	period: ['custom'],
};

/**
 * Umami wants an absolute millisecond timestamp at both ends of the range, but
 * asking for two absolute dates makes the node unusable by an AI agent: the
 * model has no clock, so "last week" leaves it guessing at today's date and it
 * stops to ask the user instead of calling the tool. Verified 2026-09-11 — the
 * agent replied with an example from 2023 rather than making the call.
 *
 * A relative period solves that. The agent picks a named window, and the
 * expressions below resolve it at execution time, when the real clock is
 * available. `custom` keeps the absolute pickers for anyone who needs an exact
 * range.
 *
 * The end of every relative window is the start of TOMORROW, not now. Umami
 * treats the end as an exact moment, so ending "today" at midnight would drop
 * everything that happened today and quietly report zero.
 */
// Chained ternaries keep each of these in one expression, which is what
// `routing.send` accepts — there is no hook to run code between reading the
// parameter and building the query string. `$now` is Luxon, evaluated on the
// n8n server at execution time.
const startExpression =
	'={{ $parameter.period === "custom" ? new Date($parameter.startDate).getTime()' +
	' : $parameter.period === "today" ? $now.startOf("day").toMillis()' +
	' : $parameter.period === "last24h" ? $now.minus({ hours: 24 }).toMillis()' +
	' : $parameter.period === "last30d" ? $now.minus({ days: 30 }).startOf("day").toMillis()' +
	' : $parameter.period === "thisMonth" ? $now.startOf("month").toMillis()' +
	' : $now.minus({ days: 7 }).startOf("day").toMillis() }}';

// `last24h` is a rolling window, so it ends now rather than at tomorrow's
// midnight — otherwise it would cover 24 hours plus the rest of today.
const endExpression =
	'={{ $parameter.period === "custom" ? new Date($parameter.endDate).getTime()' +
	' : $parameter.period === "last24h" ? $now.toMillis()' +
	' : $now.plus({ days: 1 }).startOf("day").toMillis() }}';

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
		displayName: 'Period',
		name: 'period',
		type: 'options',
		required: true,
		displayOptions: { show: showForDatedStats },
		// The linter requires these alphabetized by name, so the list does not
		// read chronologically. Default is Last 7 Days.
		options: [
			{ name: 'Custom Range', value: 'custom', description: 'Pick an exact start and end date' },
			{ name: 'Last 24 Hours', value: 'last24h', description: 'A rolling 24-hour window ending now' },
			{
				name: 'Last 30 Days',
				value: 'last30d',
				description: 'The previous thirty days, including today',
			},
			{
				name: 'Last 7 Days',
				value: 'last7d',
				description: 'The previous seven days, including today',
			},
			{ name: 'This Month', value: 'thisMonth', description: 'From the first of the month until now' },
			{ name: 'Today', value: 'today', description: 'Midnight this morning until now' },
		],
		default: 'last7d',
		description:
			'Reporting period. Relative periods are resolved when the workflow runs, so an AI agent can select one without knowing today\'s date.',
	},
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		displayOptions: { show: showForCustomRange },
		default: '',
		description: 'Beginning of the reporting period',
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		required: true,
		displayOptions: { show: showForCustomRange },
		default: '',
		description:
			'End of the reporting period. This is an exact moment, not a whole day — a date picked without a time means midnight, which excludes everything that happened that day. To include today, set tomorrow\'s date or an explicit end time.',
	},
	{
		displayName: 'Start At',
		name: 'startAt',
		type: 'hidden',
		displayOptions: { show: showForDatedStats },
		default: '',
		// Umami expects a UNIX timestamp in milliseconds.
		routing: { send: { type: 'query', property: 'startAt', value: startExpression } },
	},
	{
		displayName: 'End At',
		name: 'endAt',
		type: 'hidden',
		displayOptions: { show: showForDatedStats },
		default: '',
		routing: { send: { type: 'query', property: 'endAt', value: endExpression } },
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
