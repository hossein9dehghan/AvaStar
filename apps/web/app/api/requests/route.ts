import { z } from 'zod';
import { requestsDb } from '@/lib/requests-db';
export const runtime = 'nodejs';
const schema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(2).max(100),
  contact: z
    .string()
    .trim()
    .min(6)
    .max(160)
    .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^\+?[\d\s()\-۰-۹٠-٩]{7,24}$/.test(v)),
  message: z.string().trim().min(10).max(2000),
  kind: z.enum(['learn', 'explore', 'shop', 'club', 'partners', 'general']),
  locale: z.enum(['fa', 'en']),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
});
export async function POST(request: Request) {
  try {
    const requestOrigin = request.headers.get('origin');
    if (!requestOrigin || requestOrigin !== new URL(request.url).origin)
      return Response.json({ error: 'Invalid origin' }, { status: 403 });
    if (!request.headers.get('content-type')?.includes('application/json'))
      return Response.json({ error: 'Invalid format' }, { status: 415 });
    const raw = await request.text();
    if (raw.length > 12000) return Response.json({ error: 'Request too large' }, { status: 413 });
    let json;
    try {
      json = JSON.parse(raw);
    } catch {
      return Response.json({ error: 'Invalid request' }, { status: 400 });
    }
    const parsed = schema.safeParse(json);
    if (!parsed.success)
      return Response.json({ error: 'Check contact details and required fields' }, { status: 400 });
    const d = parsed.data;
    const normalized = d.contact.toLowerCase().replace(/[\s()\-]/g, '');
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(normalized));
    const key = Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, '0')).join('');
    const db = requestsDb();
    const prior = await db
      .prepare('SELECT id FROM guidance_requests WHERE id = ?')
      .bind(d.id)
      .first();
    if (prior)
      return Response.json({
        reference: `AV-${d.id.slice(0, 8).toUpperCase()}`,
      });
    const count = await db
      .prepare(
        'SELECT COUNT(*) AS n FROM guidance_requests WHERE contact_key = ? AND created_at > ?',
      )
      .bind(key, Date.now() - 3600000)
      .first<{ n: number }>();
    if ((count?.n ?? 0) >= 5)
      return Response.json({ error: 'Please try again later' }, { status: 429 });
    await db
      .prepare(
        'INSERT INTO guidance_requests (id,name,contact,contact_key,kind,message,locale,created_at) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING',
      )
      .bind(d.id, d.name, d.contact, key, d.kind, d.message, d.locale, Date.now())
      .run();
    return Response.json({ reference: `AV-${d.id.slice(0, 8).toUpperCase()}` }, { status: 201 });
  } catch (error) {
    console.error(
      'Guidance request storage failed',
      error instanceof Error ? error.name : 'Unknown',
    );
    return Response.json({ error: 'Temporarily unavailable' }, { status: 503 });
  }
}
