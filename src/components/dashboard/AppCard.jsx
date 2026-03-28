'use client';

import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  IconButton,
  Button,
  Tooltip
} from '@mui/material';
import { 
  Smartphone, 
  QrCode, 
  Globe, 
  MoreHorizontal, 
  ChevronRight
} from 'lucide-react';

const AppCard = ({ app, onClick }) => {
  const isActive = app.status === 'Active';

  return (
    <Card 
      sx={{
        position: 'relative',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        borderRadius: '20px',
        p: 0,
        bgcolor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        overflow: 'visible',
        '&:hover': {
          boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
          transform: 'translateY(-4px)',
          borderColor: 'rgba(37, 99, 235, 0.3)',
          '& .app-icon': {
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: 'white',
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
          },
          '& .action-btn': {
            opacity: 1,
            transform: 'translateX(0)',
          }
        }
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
          <Box 
            className="app-icon"
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              transition: 'all 0.3s ease',
              overflow: 'hidden',
              bgcolor: app.icon ? 'transparent' : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)'
            }}
          >
            {app.icon ? (
              <img src={app.icon} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Smartphone size={24} />
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip 
              label={app.status}
              size="small"
              sx={{ 
                fontSize: '0.7rem',
                fontWeight: 700,
                borderRadius: 1.5,
                letterSpacing: '0.03em',
                bgcolor: isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                color: isActive ? '#059669' : '#d97706',
                height: 26,
                px: 1,
                border: `1px solid ${isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
              }}
            />
            <IconButton 
              size="small"
              sx={{ 
                color: '#cbd5e1',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                  color: '#64748b',
                }
              }}
            >
              <MoreHorizontal size={18} />
            </IconButton>
          </Box>
        </Box>
        
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700, 
            fontSize: '1.05rem',
            color: '#0f172a',
            mb: 1.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            lineHeight: 1.3,
          }}
        >
          {app.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <QrCode size={13} />
            <span>{app.scans} scans</span>
          </Box>
          <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#cbd5e1' }} />
          <span>{app.date}</span>
        </Box>
        
        <Box 
          sx={{ 
            mt: 3, 
            pt: 2.5, 
            borderTop: '1px solid #f1f5f9',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}
        >
          <Box sx={{ display: 'flex', ml: -0.5 }}>
            <Tooltip title="Web Link" placement="top">
              <Box 
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 2,
                  bgcolor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: '#f1f5f9',
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <Globe size={15} color="#64748b" />
              </Box>
            </Tooltip>
            <Tooltip title="QR Code" placement="top">
              <Box 
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 2,
                  bgcolor: 'rgba(37, 99, 235, 0.08)',
                  border: '1px solid rgba(37, 99, 235, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ml: -0.5,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'rgba(37, 99, 235, 0.15)',
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <QrCode size={15} color="#2563eb" />
              </Box>
            </Tooltip>
          </Box>
          <Button 
            sx={{ 
              color: '#2563eb',
              fontWeight: 700,
              fontSize: '0.85rem',
              gap: 0.5,
              px: 0,
              minWidth: 'auto',
              '&:hover': {
                bgcolor: 'transparent',
                color: '#1d4ed8',
              }
            }}
            endIcon={<ChevronRight size={16} strokeWidth={3} />}
          >
            View
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AppCard;