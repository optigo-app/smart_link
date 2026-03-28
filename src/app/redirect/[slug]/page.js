'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Smartphone, ExternalLink, ArrowLeft } from 'lucide-react';

export default function RedirectPage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug;
  const data = searchParams?.get('data');
  
  let app = null;
  try {
    if (data) {
      app = JSON.parse(atob(data));
    }
  } catch (e) {
    // Invalid data
  }
  
  // Fallback for demo purposes
  if (!app) {
    const appData = {
      'fitnesstracker-pro': { name: 'FitnessTracker Pro', android: 'https://play.google.com', ios: 'https://apps.apple.com' },
      'ecoeat-delivery': { name: 'EcoEat Delivery', android: 'https://play.google.com', ios: 'https://apps.apple.com' },
      'zenmind-meditation': { name: 'ZenMind Meditation', android: 'https://play.google.com', ios: 'https://apps.apple.com' },
      'taskflow-manager': { name: 'TaskFlow Manager', android: 'https://play.google.com', ios: 'https://apps.apple.com' },
      'cryptotracker': { name: 'CryptoTracker', android: 'https://play.google.com', ios: 'https://apps.apple.com' },
    };
    app = appData[slug];
  }
  
  useEffect(() => {
    if (!app) return;
    
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.includes('android');
    const isIOS = /iphone|ipad|ipod/.test(userAgent) || (userAgent.includes('os') && userAgent.includes('mobile'));
    
    if (isAndroid && app.android) {
      window.location.href = app.android;
    } else if (isIOS && app.ios) {
      window.location.href = app.ios;
    }
  }, [app]);

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
              href={app.android}
              target="_blank"
              rel="noopener noreferrer"
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
              href={app.ios}
              target="_blank"
              rel="noopener noreferrer"
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