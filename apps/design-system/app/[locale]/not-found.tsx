import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="not-found">
      <h1>۴۰۴ / 404</h1>
      <p>این صفحه پیدا نشد. / Page not found.</p>
      <Link className="av-button av-button--primary" href="/fa">
        دیزاین سیستم / Design system
      </Link>
    </main>
  );
}
