import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRequestsDb } from '../apps/web/lib/requests-db.ts';
const config = { accountId: 'test-account', databaseId: 'test-database', token: 'test-token' };
test('uses server-side authorization and bound parameters without interpolating user input', async () => {
  let captured;
  const db = createRequestsDb(config, async (url, options) => {
    captured = { url, options };
    return Response.json({ success: true, result: [{ success: true, results: [{ id: 'known-id' }] }] });
  });
  const value = "'; DROP TABLE guidance_requests;--";
  const row = await db.prepare('SELECT id FROM guidance_requests WHERE id = ?').bind(value).first();
  assert.equal(row.id, 'known-id');
  assert.equal(captured.options.headers.Authorization, 'Bearer test-token');
  assert.deepEqual(JSON.parse(captured.options.body), { sql: 'SELECT id FROM guidance_requests WHERE id = ?', params: [value] });
  assert.equal(captured.options.cache, 'no-store');
});
test('does not report success on HTTP or database errors', async () => {
  for (const response of [new Response('Unavailable', { status: 503 }), Response.json({ success: false }), Response.json({ success: true, result: [{ success: false }] })]) {
    const db = createRequestsDb(config, async () => response);
    await assert.rejects(db.prepare('INSERT INTO guidance_requests VALUES (?)').bind('value').run());
  }
});
test('missing credentials fail before any network request', () => {
  assert.throws(() => createRequestsDb({ ...config, token: '' }), /not configured/);
});
