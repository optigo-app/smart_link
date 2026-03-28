'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Smartphone, ExternalLink, ArrowLeft } from 'lucide-react';

export default function RedirectPage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug;
  const data = searchParams?.get('data');
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch app data from API
  useEffect(() => {
    async function fetchApp() {
      try {
        const response = await fetch(`/api/apps?slug=${slug}`);
        if (response.ok) {
          const apps = await response.json();
          if (apps.length > 0) {
            setApp(apps[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching app:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchApp();
  }, [slug]);

  // Try to parse from query param as fallback
  let queryApp = null;
  try {
    if (data) {
      queryApp = JSON.parse(atob(data));
    }
  } catch (e) {
    // Invalid data
  }

  // Use query app as fallback
  useEffect(() => {
    if (!app && queryApp) {
      setApp(queryApp);
      setLoading(false);
    }
  }, [app, queryApp]);

  // Track click function
  const trackClick = async (platform) => {
    if (!app) return;
    
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: app.id,
          appSlug: app.slug,
          appName: app.name,
          platform,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  const handleAndroidClick = () => {
    trackClick('android');
    if (app?.android) {
      window.location.href = app.android;
    }
  };

  const handleIOSClick = () => {
    trackClick('ios');
    if (app?.ios) {
      window.location.href = app.ios;
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3
      }}>
        <Paper sx={{ p: 5, maxWidth: 500, textAlign: 'center', borderRadius: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>
            Loading...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (!app) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3
      }}>
        <Paper sx={{ p: 5, maxWidth: 500, textAlign: 'center', borderRadius: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>
            App Not Found
          </Typography>
          <Typography sx={{ color: '#64748b', mb: 3 }}>
            The smart link you're looking for doesn't exist.
          </Typography>
          <Button 
            variant="contained"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => router.push('/')}
            sx={{ bgcolor: '#0f172a', '&:hover': { bgcolor: '#1e293b' } }}
          >
            Go to Dashboard
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3
    }}>
      <Paper sx={{ p: 5, maxWidth: 500, borderRadius: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box 
            sx={{
              width: 80,
              height: 80,
              borderRadius: 3,
              bgcolor: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
            }}
          >
            <Smartphone size={36} color="white" />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
            {app.name}
          </Typography>
          <Typography sx={{ color: '#64748b' }}>
            Select your platform to download
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {app.android && (
            <Button
              variant="contained"
              fullWidth
              startIcon={<Smartphone size={20} />}
              endIcon={<ExternalLink size={16} />}
              onClick={handleAndroidClick}
              sx={{
                bgcolor: '#0f172a',
                py: 2,
                borderRadius: 2.5,
                fontWeight: 700,
                '&:hover': { bgcolor: '#1e293b' }
              }}
            >
              Get on Android
            </Button>
          )}
          
          {app.ios && (
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Smartphone size={20} />}
              endIcon={<ExternalLink size={16} />}
              onClick={handleIOSClick}
              sx={{
                borderColor: '#e2e8f0',
                color: '#0f172a',
                py: 2,
                borderRadius: 2.5,
                fontWeight: 700,
                '&:hover': { borderColor: '#2563eb', bgcolor: 'rgba(37, 99, 235, 0.04)' }
              }}
            >
              Get on iOS
            </Button>
          )}
        </Box>

        <Button
          fullWidth
          sx={{ mt: 3, color: '#64748b', fontWeight: 600 }}
          onClick={() => router.push('/')}
        >
          Go to Dashboard
        </Button>
      </Paper>
    </Box>
  );
}