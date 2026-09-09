# n8n-nodes-umami

This is an n8n community node. It lets you read website analytics from
[Umami](https://umami.is) in your n8n workflows.

Umami is an open source, privacy-first web analytics platform — a lightweight
alternative to Google Analytics that collects no cookies and no personal data.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/)
workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)

## Installation

Follow the
[installation guide](https://docs.n8n.io/integrations/community-nodes/installation/)
in the n8n community nodes documentation.

In short: go to **Settings → Community Nodes**, select **Install**, and enter
`n8n-nodes-umami`.

## Operations

### Website

- **Get** — retrieve a single tracked website by its ID.
- **Get Many** — list the websites the account can access, optionally including
  websites shared through a team.

### Statistic

- **Get Summary** — totals for pageviews, visitors, visits, bounces and time on
  site over a date range, with a comparison against the preceding period.
- **Get Pageviews** — a pageview and session time series, grouped by hour, day,
  month or year.
- **Get Metrics** — the top values for one dimension: URL path, referrer,
  browser, operating system, device, country, city, event, UTM parameters and
  more.
- **Get Active Visitors** — how many visitors are on the site right now.

All statistics operations accept optional filters (path, referrer, browser, OS,
device, country, timezone, UTM source and campaign) to narrow the results to a
segment of traffic.

## Credentials

This node supports both Umami deployments. Select which one you use in the
credential's **Hosting** field.

### Umami Cloud

API access on Umami Cloud requires a paid plan — it is not part of the free
Hobby tier. Self-hosted Umami has no such restriction.

1. Sign in at [cloud.umami.is](https://cloud.umami.is).
2. Go to **Settings → API keys** and create a key.
3. In n8n, choose **Umami Cloud** and paste the key into **API Key**.

Requests go to `https://api.umami.is/v1` with an `x-umami-api-key` header.

### Self-hosted

Self-hosted Umami authenticates with a bearer token rather than an API key.

1. Request a token from your instance:

   ```
   curl -X POST https://analytics.example.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"your-username","password":"your-password"}'
   ```

2. Copy the `token` value from the response.
3. In n8n, choose **Self-Hosted**, enter your **Instance URL** (for example
   `https://analytics.example.com`, with no trailing slash and no `/api`) and
   paste the token into **Bearer Token**.

Requests go to `<instance>/api` with an `Authorization: Bearer` header.

Changing the account's password invalidates its tokens, so if the credential
starts returning 401 after a password change, request a new token and update
the credential.

Use the credential's **Test** button to confirm the connection — it calls `/me`
and reports whether the credentials are accepted.

## Compatibility

Tested against n8n 1.x and the Umami v2 API. The endpoints this node uses
(`/websites`, `/websites/:id/stats`, `/pageviews`, `/metrics`, `/active`) are
stable across Umami v2 releases.

## Usage

A common pattern is a scheduled traffic report: a **Schedule Trigger** set to
run every Monday, an **Umami** node with *Get Summary* over the previous seven
days, and a **Slack** or **Gmail** node that posts the numbers to your team.

For a breakdown rather than a total, use *Get Metrics* with the **Dimension**
field — for example `Referrer` to see where visitors came from, or `URL Path`
to see the most-read pages.

*Get Metrics* returns rows of `x` (the value) and `y` (a count of **unique
visitors**, not pageviews). One visitor loading the same page four times counts
once, so these numbers are smaller than the pageview total from *Get Summary*.
That is Umami's behaviour, not a quirk of this node.

Dates are entered as ordinary date values; the node converts them to the
millisecond timestamps the Umami API expects.

**Start and End Date are exact moments, not whole days.** A date picked with no
time is midnight, so an end date of today excludes everything that happened
today — the result is zero rather than an error. To cover today, set the end to
tomorrow's date, or give an explicit end time.

If you are new to n8n, see the
[Try it out](https://docs.n8n.io/try-it-out/) documentation.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Umami documentation](https://umami.is/docs)
- [Umami API reference](https://umami.is/docs/api)

## License

[MIT](LICENSE)
