export class RemoteDatabaseClient {
  constructor(endpoint) {
    Object.defineProperty(this, "endpoint", {value: `${endpoint}`});
  }
  async query(sql, params) {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({sql, params})
    });
    if (!response.ok) throw new Error(`query failed: ${response.status}`);
    return await response.json();
  }
  async sql(strings, ...values) {
    const text = strings.join("?");
    return this.query(text, values);
  }
}
