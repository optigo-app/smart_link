'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  TextField
} from '@mui/material';
import {
  ArrowLeft,
  QrCode,
  Download,
  Copy,
  Share2,
  Smartphone,
  Globe,
  ExternalLink,
  Check,
  TrendingUp,
  Users,
  MousePointerClick,
  Trash2,
  Edit2,
  X,
  Upload
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const AppDetailView = ({ app, onBack, onDelete, onUpdate, isDeleting }) => {
  const qrRef = useRef(null);
  const fileInputRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    android: '',
    ios: '',
    icon: ''
  });
  const [uploading, setUploading] = useState(false);
  const [previewIcon, setPreviewIcon] = useState(null);
  const [saving, setSaving] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const slug = app.slug || app.name.toLowerCase().replace(/\s+/g, '-');
  const smartLink = `/a/${slug}`;
  const fullUrl = typeof window !== 'undefined' ? window.location.origin + smartLink : smartLink;
  const displayApp = isEditing ? { ...app, ...editData } : app;

  // Fetch analytics data
  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch(`/api/analytics?appId=${app.id}&period=30d`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAnalytics(data.stats);
          }
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoadingAnalytics(false);
      }
    }
    fetchAnalytics();
  }, [app.id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditClick = () => {
    setEditData({
      name: app.name,
      android: app.android || '',
      ios: app.ios || '',
      icon: app.icon || ''
    });
    setPreviewIcon(app.icon || null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setPreviewIcon(null);
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      const newSlug = editData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const response = await fetch('/api/apps', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: app.id,
          name: editData.name,
          android: editData.android,
          ios: editData.ios,
          icon: editData.icon,
          slug: newSlug
        })
      });
      
      if (response.ok && onUpdate) {
        const data = await response.json();
        onUpdate(data.app);
        setIsEditing(false);
        setPreviewIcon(null);
      }
    } catch (error) {
      console.error('Error updating app:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewIcon(e.target?.result);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('appName', editData.name || 'app-' + Date.now());
      uploadData.append('oldIcon', app.icon || '');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData
      });

      if (response.ok) {
        const data = await response.json();
        setEditData(prev => ({ ...prev, icon: data.iconPath }));
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(app.id);
    }
    setShowDeleteDialog(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = 400;
        canvas.height = 400;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 400, 400);
        
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `${displayApp.name.replace(/\s+/g, '-')}-qrcode.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  const stats = loadingAnalytics ? [
    { label: 'Total Scans', value: '-', icon: MousePointerClick, color: '#2563eb', change: '...' },
    { label: 'Unique Users', value: '-', icon: Users, color: '#059669', change: '...' },
    { label: 'Conversion Rate', value: '-', icon: TrendingUp, color: '#7c3aed', change: '...' },
    { label: 'Avg. Session', value: '-', icon: Smartphone, color: '#dc2626', change: '...' },
  ] : analytics ? [
    { label: 'Total Scans', value: analytics.totalClicks?.toString() || '0', icon: MousePointerClick, color: '#2563eb', change: '+12%' },
    { label: 'Unique Users', value: analytics.uniqueUsers?.toString() || '0', icon: Users, color: '#059669', change: '+8%' },
    { label: 'Conversion Rate', value: `${analytics.conversionRate || 0}%`, icon: TrendingUp, color: '#7c3aed', change: '+2.1%' },
    { label: 'Avg. Session', value: analytics.avgSessionTime || '0s', icon: Smartphone, color: '#dc2626', change: '-5%' },
  ] : [
    { label: 'Total Scans', value: '0', icon: MousePointerClick, color: '#2563eb', change: '+0%' },
    { label: 'Unique Users', value: '0', icon: Users, color: '#059669', change: '+0%' },
    { label: 'Conversion Rate', value: '0%', icon: TrendingUp, color: '#7c3aed', change: '+0%' },
    { label: 'Avg. Session', value: '0s', icon: Smartphone, color: '#dc2626', change: '+0%' },
  ];

  return (
    <>
    <Box 
      sx={{ 
        maxWidth: 1400, 
        mx: 'auto', 
        py: 5, 
        px: { xs: 3, sm: 4, md: 6, lg: 8 },
        animation: 'fadeIn 0.4s ease-out',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Button 
          onClick={onBack}
          startIcon={<ArrowLeft size={18} strokeWidth={2.5} />}
          sx={{ 
            color: '#64748b',
            fontWeight: 600,
            fontSize: '0.875rem',
            '&:hover': {
              color: '#0f172a',
              bgcolor: 'transparent',
            }
          }}
        >
          Back to Dashboard
        </Button>
        
        {!isEditing && (
          <Button
            variant="outlined"
            startIcon={<Edit2 size={16} />}
            onClick={handleEditClick}
            sx={{
              borderColor: '#e2e8f0',
              color: '#64748b',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#2563eb',
                color: '#2563eb'
              }
            }}
          >
            Edit
          </Button>
        )}
      </Box>

      <Grid container spacing={4}>
        {/* Left Column - QR Code & Info */}
        <Grid item size={{ xs: 12, lg: 4 }}>
          <Paper 
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              bgcolor: '#ffffff',
              position: 'sticky',
              top: 100
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                Smart QR Code
              </Typography>
              <Chip 
                label={displayApp.status}
                size="small"
                sx={{ 
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  bgcolor: displayApp.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: displayApp.status === 'Active' ? '#059669' : '#d97706',
                }}
              />
            </Box>

            {/* QR Code */}
            <Box 
              ref={qrRef}
              sx={{ 
                bgcolor: '#ffffff',
                borderRadius: 3,
                p: 3,
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: -2,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                  zIndex: 0,
                }
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1, bgcolor: 'white', p: 2, borderRadius: 2 }}>
                <QRCodeSVG 
                  value={fullUrl}
                  size={200}
                  level="H"
                  includeMargin={false}
                  fgColor="#0f172a"
                />
              </Box>
            </Box>

            {/* Smart Link */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Smart Link
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  p: 1.5,
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                  border: '1px solid #e2e8f0'
                }}
              >
                <Globe size={16} color="#64748b" />
                <Typography sx={{ flex: 1, fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', fontFamily: 'monospace' }}>
                  {fullUrl}
                </Typography>
                <IconButton size="small" onClick={handleCopy} sx={{ color: copied ? '#059669' : '#64748b' }}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </IconButton>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="contained"
                fullWidth
                startIcon={<Download size={18} />}
                onClick={handleDownload}
                sx={{ 
                  bgcolor: '#0f172a',
                  py: 1.5,
                  '&:hover': { bgcolor: '#1e293b' }
                }}
              >
                Download
              </Button>
              <Button 
                variant="outlined"
                fullWidth
                startIcon={<Share2 size={18} />}
                sx={{ 
                  borderColor: '#e2e8f0',
                  color: '#64748b',
                  py: 1.5,
                  '&:hover': { borderColor: '#2563eb', color: '#2563eb', bgcolor: 'rgba(37, 99, 235, 0.04)' }
                }}
              >
                Share
              </Button>
              <Button 
                variant="outlined"
                color="error"
                onClick={handleDeleteClick}
                disabled={isDeleting}
                sx={{ 
                  borderColor: '#dc2626',
                  color: '#dc2626',
                  py: 1.5,
                  '&:hover': { borderColor: '#b91c1c', color: '#b91c1c', bgcolor: 'rgba(220, 38, 38, 0.04)' }
                }}
              >
                {isDeleting ? <CircularProgress size={18} color="inherit" /> : <Trash2 size={18} />}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Stats & Details */}
        <Grid item size={{ xs: 12, lg: 8 }}>
          {/* App Info */}
          <Paper 
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              bgcolor: '#ffffff',
              mb: 4
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              {displayApp.icon && (
                <Box sx={{ width: 56, height: 56, borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <img src={displayApp.icon} alt={displayApp.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              )}
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                {displayApp.name}
              </Typography>
            </Box>
            <Typography sx={{ color: '#64748b', fontSize: '0.9rem', mb: 3 }}>
              Created on {displayApp.date}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', mb: 2 }}>
              Store Links
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12 }}>
                <Box 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'all 0.2s ease',
                    cursor: displayApp.android ? 'pointer' : 'default',
                    '&:hover': displayApp.android ? {
                      borderColor: '#2563eb',
                      bgcolor: 'rgba(37, 99, 235, 0.02)',
                    } : {}
                  }}
                  onClick={() => displayApp.android && window.open(displayApp.android, '_blank')}
                >
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 2, 
                      bgcolor: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Android_robot.svg" alt="Android" style={{ width: 20 }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Android</Typography>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: displayApp.android ? '#0f172a' : '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {displayApp.android || 'Not set'}
                    </Typography>
                  </Box>
                  {displayApp.android && <ExternalLink size={16} color="#64748b" style={{ flexShrink: 0 }} />}
                </Box>
              </Grid>
              
              <Grid item size={{ xs: 12 }}>
                <Box 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'all 0.2s ease',
                    cursor: displayApp.ios ? 'pointer' : 'default',
                    '&:hover': displayApp.ios ? {
                      borderColor: '#2563eb',
                      bgcolor: 'rgba(37, 99, 235, 0.02)',
                    } : {}
                  }}
                  onClick={() => displayApp.ios && window.open(displayApp.ios, '_blank')}
                >
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 2, 
                      bgcolor: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="iOS" style={{ width: 16 }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>iOS</Typography>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: displayApp.ios ? '#0f172a' : '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {displayApp.ios || 'Not set'}
                    </Typography>
                  </Box>
                  {displayApp.ios && <ExternalLink size={16} color="#64748b" style={{ flexShrink: 0 }} />}
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Stats Grid */}
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#64748b', mb: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Analytics Overview
          </Typography>
          
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item size={{ xs: 6, md: 3 }} key={index}>
                <Paper 
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box 
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: `${stat.color}10`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <stat.icon size={18} color={stat.color} />
                    </Box>
                    <Typography 
                      sx={{ 
                        fontSize: '0.7rem', 
                        fontWeight: 600, 
                        color: stat.change.startsWith('+') ? '#059669' : '#dc2626',
                        bgcolor: stat.change.startsWith('+') ? 'rgba(5, 150, 105, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                      }}
                    >
                      {stat.change}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b' }}>
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Recent Activity */}
          <Paper 
            elevation={0}
            sx={{
              mt: 4,
              p: 4,
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              bgcolor: '#ffffff',
            }}
          >
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', mb: 3 }}>
              Recent Activity
            </Typography>
            
            {(loadingAnalytics ? [
              { time: '...', action: 'Loading...', location: '-' },
              { time: '...', action: 'Loading...', location: '-' },
              { time: '...', action: 'Loading...', location: '-' },
              { time: '...', action: 'Loading...', location: '-' },
              { time: '...', action: 'Loading...', location: '-' },
            ] : (analytics?.recentActivity || [
              { time: 'No activity', action: 'No recent clicks', location: '-' },
            ])).map((activity, index) => (
              <Box 
                key={index}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  py: 2,
                  borderBottom: index < 4 ? '1px solid #f1f5f9' : 'none'
                }}
              >
                <Box 
                  sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50', 
                    bgcolor: '#2563eb',
                    flexShrink: 0
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#0f172a' }}>
                    {activity.action}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 400, color: '#64748b' }}>
                    {activity.location}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8' }}>
                  {activity.time}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>

    {/* Delete Confirmation Dialog */}
    <Dialog
      open={showDeleteDialog}
      onClose={handleDeleteCancel}
      PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#0f172a' }}>
        Delete App?
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: '#64748b', fontSize: '0.95rem' }}>
          Are you sure you want to delete "{displayApp.name}"? This action cannot be undone and the smart link will no longer work.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleDeleteCancel} sx={{ color: '#64748b', fontWeight: 600 }}>
          Cancel
        </Button>
        <Button 
          onClick={handleDeleteConfirm}
          variant="contained"
          color="error"
          disabled={isDeleting}
          sx={{ bgcolor: '#dc2626', fontWeight: 600, '&:hover': { bgcolor: '#b91c1c' } }}
        >
          {isDeleting ? <CircularProgress size={20} color="inherit" /> : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>

    {/* Edit Dialog */}
    <Dialog
      open={isEditing}
      onClose={handleCancelEdit}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, p: 2 } }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem', color: '#0f172a', pb: 1 }}>
        Edit App
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          {/* Icon Upload */}
          <Box>
            <Typography sx={{ fontWeight: 600, color: '#0f172a', mb: 1.5, fontSize: '0.9rem' }}>
              App Icon
            </Typography>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <Box
              onClick={handleIconClick}
              sx={{
                width: 80,
                height: 80,
                borderRadius: 2,
                border: '2px dashed #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
                bgcolor: '#f8fafc',
                transition: 'all 0.2s ease',
                '&:hover': { borderColor: '#2563eb', bgcolor: 'rgba(37, 99, 235, 0.04)' }
              }}
            >
              {uploading ? (
                <CircularProgress size={24} sx={{ color: '#2563eb' }} />
              ) : previewIcon ? (
                <img src={previewIcon} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : editData.icon ? (
                <img src={editData.icon} alt="Current" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Upload size={24} color="#94a3b8" />
              )}
            </Box>
          </Box>

          {/* App Name */}
          <TextField
            label="App Name"
            fullWidth
            value={editData.name}
            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': { borderColor: '#e2e8f0' },
                '&:hover fieldset': { borderColor: '#cbd5e1' },
                '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: 2 }
              }
            }}
          />

          {/* Android URL */}
          <TextField
            label="Android Store URL"
            fullWidth
            value={editData.android}
            onChange={(e) => setEditData(prev => ({ ...prev, android: e.target.value }))}
            placeholder="https://play.google.com/store/apps/..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': { borderColor: '#e2e8f0' },
                '&:hover fieldset': { borderColor: '#cbd5e1' },
                '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: 2 }
              }
            }}
          />

          {/* iOS URL */}
          <TextField
            label="iOS Store URL"
            fullWidth
            value={editData.ios}
            onChange={(e) => setEditData(prev => ({ ...prev, ios: e.target.value }))}
            placeholder="https://apps.apple.com/app/..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': { borderColor: '#e2e8f0' },
                '&:hover fieldset': { borderColor: '#cbd5e1' },
                '&.Mui-focused fieldset': { borderColor: '#2563eb', borderWidth: 2 }
              }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleCancelEdit}
          sx={{ color: '#64748b', fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSaveEdit}
          variant="contained"
          disabled={saving || !editData.name}
          sx={{ bgcolor: '#0f172a', fontWeight: 600, '&:hover': { bgcolor: '#1e293b' } }}
        >
          {saving ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default AppDetailView;