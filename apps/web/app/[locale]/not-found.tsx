import Link from 'next/link';
export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeContent: 'center',
        textAlign: 'center',
        padding: 30,
      }}
    >
      <p style={{ fontSize: 70, color: '#789bff' }}>404</p>
      <h1>این بخش از آسمان را پیدا نکردیم</h1>
      <p>We couldn’t find this part of the universe.</p>
      <Link href="/fa" style={{ marginTop: 25, color: '#8faeff' }}>
        بازگشت به منظومه · Back to Avastar
      </Link>
    </main>
  );
}
