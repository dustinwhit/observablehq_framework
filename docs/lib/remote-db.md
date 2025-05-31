# RemoteDatabaseClient

The `RemoteDatabaseClient` allows you to run SQL queries against a remote database
via a simple HTTP POST API. Instantiate the client with the URL of an endpoint
that accepts JSON requests of the form `{sql, params}` and returns query results
as JSON.

```js run=false
import {RemoteDatabaseClient} from "observablehq:stdlib/remote-db";

const db = new RemoteDatabaseClient("https://example.com/query");
const rows = await db.sql`SELECT * FROM users WHERE id = ${id}`;
```

The endpoint should execute the provided SQL and return an array of result rows.
This lightweight connector is useful for dashboards that need to query an
existing database service without exposing credentials to the browser.
