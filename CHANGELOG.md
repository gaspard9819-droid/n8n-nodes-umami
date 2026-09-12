# Changelog

## 0.1.6

### Statistics operations take a relative period

The three dated statistics operations — Get Summary, Get Pageviews and Get
Metrics — now take a **Period** dropdown (Today, Last 24 Hours, Last 7 Days,
Last 30 Days, This Month, Custom Range) instead of two required dates. Last 7
Days is the default; **Custom Range** brings back the exact Start and End Date
pickers.

**Why this changed.** The node declares `usableAsTool`, so an AI agent can call
it — but an agent has no clock. Asked "how many visitors last week", it could
not work out what "last week" meant and stopped to ask the user for two dates
rather than calling the tool at all. A named period removes the problem
entirely: the agent picks a window, and the node resolves it against the real
clock when the workflow runs.

**It also fixes the midnight trap.** Every relative period ends at tomorrow's
midnight, so today's traffic is included. Previously an end date of today meant
midnight this morning, and the node returned zero for a site with traffic —
no error, just a wrong number. Confirmed both ways against a live instance:
the old boundary returns 0 where the new one returns 105.

Last 24 Hours is the exception, ending at the current moment, since a rolling
window that ran to tomorrow's midnight would cover more than 24 hours.

**Upgrading.** Existing workflows using Get Summary, Get Pageviews or Get
Metrics need their Period set — pick Custom Range to keep the dates they
already have.
