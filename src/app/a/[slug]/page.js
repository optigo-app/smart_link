import { redirect } from 'next/navigation';
import { getAppBySlug } from '@/lib/apps';
import { encodeAppData } from '@/lib/utils';

export function generateStaticParams() {
  // This would be called at build time
  return [];
}

export default async function SmartRedirect({ params }) {
  const { slug } = await params;
  const app = getAppBySlug(slug);

  if (!app) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        fontFamily: 'system-ui, sans-serif',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>App Not Found</h1>
        <p style={{ color: '#64748b' }}>The smart link you're looking for doesn't exist.</p>
        <a href="/" style={{ marginTop: '1rem', color: '#2563eb', textDecoration: 'underline' }}>
          Go to Dashboard
        </a>
      </div>
    );
  }

  // Encode app data as query params
  const encodedData = encodeAppData(app);
  redirect(`/redirect/${slug}?data=${encodedData}`);
}