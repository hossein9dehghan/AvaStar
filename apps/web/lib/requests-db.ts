/** Server-side D1 REST adapter, usable by a Vercel Node.js function. */
type Parameter = string | number | null;
type QueryResult<T> = { success: boolean; results?: T[] };
type D1Response<T> = { success: boolean; result?: QueryResult<T>[] };
export function createRequestsDb(
  config: { accountId: string; databaseId: string; token: string },
  fetcher: typeof fetch = fetch,
) {
  if (!config.accountId || !config.databaseId || !config.token) {
    throw new Error('Request storage is not configured');
  }
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(config.accountId)}/d1/database/${encodeURIComponent(config.databaseId)}/query`;
  async function query<T>(sql: string, params: Parameter[]) {
    const response = await fetcher(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql, params }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error('Request storage is temporarily unavailable');
    const body = (await response.json()) as D1Response<T>;
    const result = body.result?.[0];
    if (!body.success || !result?.success) throw new Error('Request storage query failed');
    return result.results ?? [];
  }
  return {
    prepare(sql: string) {
      return {
        bind(...params: Parameter[]) {
          return {
            async first<T = { id: string }>(): Promise<T | null> {
              return (await query<T>(sql, params))[0] ?? null;
            },
            async run() {
              await query(sql, params);
            },
          };
        },
      };
    },
  };
}
export function requestsDb() {
  return createRequestsDb({
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? '',
    databaseId: process.env.CLOUDFLARE_D1_DATABASE_ID ?? '',
    token: process.env.CLOUDFLARE_D1_API_TOKEN ?? '',
  });
}
