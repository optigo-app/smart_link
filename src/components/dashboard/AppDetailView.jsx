'use client';

import React, { useRef, useState } from 'react';
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
  CircularProgress
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
  Trash2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const AppDetailView = ({ app, onBack, onDelete, isDeleting }) => {
  const qrRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const slug = app.slug || app.name.toLowerCase().replace(/\s+/g, '-');
  const smartLink = `/a/${slug}`;
  const fullUrl = typeof window !== 'undefined' ? window.location.origin + smartLink : smartLink;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        downloadLink.download = `${app.name.replace(/\s+/g, '-')}-qrcode.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  const stats = [
    { label: 'Total Scans', value: app.scans, icon: MousePointerClick, color: '#2563eb', change: '+12%' },
    { label: 'Unique Users', value: '342', icon: Users, color: '#059669', change: '+8%' },
    { label: 'Conversion Rate', value: '23.5%', icon: TrendingUp, color: '#7c3aed', change: '+2.1%' },
    { label: 'Avg. Session', value: '2m 34s', icon: Smartphone, color: '#dc2626', change: '-5%' },
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
        {/* Header */}
        <Button
          onClick={onBack}
          startIcon={<ArrowLeft size={18} strokeWidth={2.5} />}
          sx={{
            mb: 4,
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
                  label={app.status}
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    bgcolor: app.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: app.status === 'Active' ? '#059669' : '#d97706',
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
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                {app.name}
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.9rem', mb: 3 }}>
                Created on {app.date}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', mb: 2 }}>
                Store Links
              </Typography>

              <Grid container spacing={2}>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: '#2563eb',
                        bgcolor: 'rgba(37, 99, 235, 0.02)',
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Android_robot.svg" alt="Android" style={{ width: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Android</Typography>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {app.android || 'Not set'}
                      </Typography>
                    </Box>
                    <ExternalLink size={16} color="#64748b" />
                  </Box>
                </Grid>

                <Grid item size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: '#2563eb',
                        bgcolor: 'rgba(37, 99, 235, 0.02)',
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="iOS" style={{ width: 16 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>iOS</Typography>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {app.ios || 'Not set'}
                      </Typography>
                    </Box>
                    <ExternalLink size={16} color="#64748b" />
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

              {[
                { time: '2 min ago', action: 'Scan from iPhone 15 Pro', location: 'United States' },
                { time: '15 min ago', action: 'Scan from Samsung Galaxy S23', location: 'United Kingdom' },
                { time: '1 hour ago', action: 'Scan from Pixel 7', location: 'Germany' },
                { time: '3 hours ago', action: 'New user from App Store', location: 'Canada' },
                { time: '5 hours ago', action: 'Scan from iPhone 14', location: 'Australia' },
              ].map((activity, index) => (
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
                      borderRadius: '50%',
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
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#0f172a' }}>
          Delete App?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#64748b', fontSize: '0.95rem' }}>
            Are you sure you want to delete "{app.name}"? This action cannot be undone and the smart link will no longer work.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleDeleteCancel}
            sx={{ color: '#64748b', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={isDeleting}
            sx={{
              bgcolor: '#dc2626',
              fontWeight: 600,
              '&:hover': { bgcolor: '#b91c1c' }
            }}
          >
            {isDeleting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Delete'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AppDetailView;