'use client';

import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DashboardHome from '@/components/dashboard/DashboardHome';
import CreateAppView from '@/components/create/CreateAppView';
import AppDetailView from '@/components/dashboard/AppDetailView';

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function Home() {
  const [view, setView] = useState('dashboard');
  const [selectedApp, setSelectedApp] = useState(null);
  const [formData, setFormData] = useState({ name: '', android: '', ios: '', icon: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Load apps from JSON on mount
  useEffect(() => {
    async function loadApps() {
      try {
        const response = await fetch('/api/apps');
        if (response.ok) {
          const data = await response.json();
          setApps(data);
        }
      } catch (error) {
        console.error('Error loading apps:', error);
      } finally {
        setLoading(false);
      }
    }
    loadApps();
  }, []);

  const resetFlow = () => {
    setView('dashboard');
    setFormData({ name: '', android: '', ios: '', icon: '' });
    setSelectedApp(null);
  };

  const handleCreateNew = () => {
    setView('create');
  };

  const handleGenerateQR = async () => {
    setIsGenerating(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newApp = {
      id: Date.now(),
      name: formData.name || 'Untitled App',
      slug: generateSlug(formData.name || 'untitled-app'),
      status: 'Active',
      scans: '0',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      android: formData.android,
      ios: formData.ios,
      icon: formData.icon || ''
    };

    try {
      const response = await fetch('/api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp)
      });
      
      if (response.ok) {
        setApps([newApp, ...apps]);
        setView('detail');
        setSelectedApp(newApp);
      }
    } catch (error) {
      console.error('Error saving app:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewApp = (app) => {
    setSelectedApp(app);
    setView('detail');
  };

  const handleDeleteApp = async (appId) => {
    setDeletingId(appId);
    try {
      const response = await fetch(`/api/apps?id=${appId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setApps(apps.filter(app => app.id !== appId));
        resetFlow();
      }
    } catch (error) {
      console.error('Error deleting app:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateApp = (updatedApp) => {
    setApps(apps.map(app => app.id === updatedApp.id ? updatedApp : app));
    setSelectedApp(updatedApp);
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: '#ffffff',
        color: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2
      }}>
        <CircularProgress size={48} sx={{ color: '#2563eb' }} />
        <Typography sx={{ color: '#64748b', fontWeight: 500 }}>
          Loading your apps...
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        bgcolor: '#ffffff',
        color: '#0f172a',
      }}
    >
      <Navbar onReset={resetFlow} />
      
      <main>
        {view === 'create' && (
          <CreateAppView 
            formData={formData}
            setFormData={setFormData}
            isGenerating={isGenerating}
            onReset={resetFlow}
            onCreateNew={handleGenerateQR}
          />
        )}
        {view === 'detail' && selectedApp && (
          <AppDetailView 
            app={selectedApp}
            onBack={resetFlow}
            onDelete={handleDeleteApp}
            onUpdate={handleUpdateApp}
            isDeleting={deletingId === selectedApp.id}
          />
        )}
        {view === 'dashboard' && (
          <DashboardHome 
            apps={apps}
            onCreateNew={handleCreateNew}
            onViewApp={handleViewApp}
            isLoading={loading}
          />
        )}
      </main>

      {view === 'dashboard' && <Footer />}
    </Box>
  );
}
