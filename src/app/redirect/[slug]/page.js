'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Smartphone, ExternalLink, ArrowLeft } from 'lucide-react';

export default function RedirectPage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug;
  const data = searchParams?.get('data');
  
  // Parse app data from URL param (instant - no API call needed)
  const parsedApp = (() => {
    try {
      if (data) {
        return JSON.parse(atob(data));
      }
    } catch (e) {
      console.error('Error parsing app data:', e);
    }
    return null;
  })();
  
  const [app, setApp] = useState(parsedApp);
  const [redirecting, setRedirecting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Verify app from API in background (non-blocking)
  useEffect(() => {
    if (!slug) return;
    
    async function verifyApp() {
      setIsVerifying(true);
      try {
        const response = await fetch(`/api/apps?slug=${slug}`);
        if (response.ok) {
          const apps = await response.json();
          if (apps.length > 0 && apps[0].name !== parsedApp?.name) {
            // Update with fresh data from server
            setApp(apps[0]);
          }
        }
      } catch (error) {
        console.error('Error verifying app:', error);
      } finally {
        setIsVerifying(false);
      }
    }
    
    // Only verify if URL data looks incomplete or different
    if (!parsedApp || !parsedApp.name) {
      verifyApp();
    }
  }, [slug, parsedApp]);

  // Auto-redirect based on device detection
  useEffect(() => {
    if (!app || redirecting) return;

    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.includes('android');
    const isIOS = /iphone|ipad|ipod/.test(userAgent) || (userAgent.includes('os') && userAgent.includes('mobile'));
    
    // Track the scan/visit
    const trackScan = async () => {
      try {
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            appId: app.id,
            appSlug: app.slug || slug,
            appName: app.name,
            platform: isAndroid ? 'android' : isIOS ? 'ios' : 'web',
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error('Error tracking scan:', error);
      }
    };

    // Auto-redirect based on device
    if (isAndroid && app.android) {
      setRedirecting(true);
      trackScan();
      window.location.href = app.android;
      return;
    }
    
    if (isIOS && app.ios) {
      setRedirecting(true);
      trackScan();
      window.location.href = app.ios;
      return;
    }

    // If no auto-redirect happened, track as a web visit
    trackScan();
  }, [app, slug, redirecting]);

  // Manual click handlers (fallback when auto-redirect doesn't work)
  const handleAndroidClick = (e) => {
    e.preventDefault();
    if (app?.android) {
      // Track click
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: app.id,
          appSlug: app.slug || slug,
          appName: app.name,
          platform: 'android',
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      });
      window.location.href = app.android;
    }
  };

  const handleIOSClick = (e) => {
    e.preventDefault();
    if (app?.ios) {
      // Track click
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: app.id,
          appSlug: app.slug || slug,
          appName: app.name,
          platform: 'ios',
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      });
      window.location.href = app.ios;
    }
  };

  // Show redirecting state
  if (redirecting) {
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
            Redirecting...
          </Typography>
          <Typography sx={{ color: '#64748b' }}>
            Taking you to the app store.
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
            {isVerifying ? 'Loading...' : 'App Not Found'}
          </Typography>
          <Typography sx={{ color: '#64748b', mb: 3 }}>
            {isVerifying ? 'Please wait...' : 'The smart link you\'re looking for doesn\'t exist.'}
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
          
          {!app.android && !app.ios && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography sx={{ color: '#64748b' }}>
                No store links available for this app.
              </Typography>
            </Box>
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