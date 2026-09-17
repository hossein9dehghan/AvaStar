/** Deployment origins. Configure NEXT_PUBLIC_SITE_URL in both Vercel projects. */
function origin(value: string): string {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol))
    throw new Error('Site URL must use HTTP or HTTPS');
  return url.origin;
}
export const siteOrigin = origin(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
function designOrigin(): string {
  if (process.env.NEXT_PUBLIC_DESIGN_SYSTEM_URL)
    return origin(process.env.NEXT_PUBLIC_DESIGN_SYSTEM_URL);
  const url = new URL(siteOrigin);
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') return 'http://localhost:3001';
  url.hostname = 'design.' + url.hostname.replace(/^www\./, '');
  return url.origin;
}
export const designSystemOrigin = designOrigin();
