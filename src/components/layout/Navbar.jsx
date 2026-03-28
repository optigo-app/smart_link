'use client';

import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Badge,
  Avatar,
  Button,
  useMediaQuery,
  useTheme,
  Tooltip
} from '@mui/material';
import { 
  QrCode, 
  Bell, 
  Settings, 
  BarChart3,
  LayoutDashboard
} from 'lucide-react';

const Navbar = ({ onReset }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'rgba(255, 255, 255, 0.95)', 
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <Toolbar 
        sx={{ 
          justifyContent: 'space-between', 
          px: { xs: 2, sm: 4, md: 8 }, 
          height: 72,
          maxWidth: 1800,
          width: '100%',
          mx: 'auto'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 3, md: 14 } }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              cursor: 'pointer',
              transition: 'opacity 0.2s ease',
              '&:hover': {
                opacity: 0.8,
              }
            }}
            onClick={onReset}
          >
            <Box 
              sx={{
                width: 42,
                height: 42,
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                borderRadius: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              }}
            >
              <QrCode size={22} strokeWidth={2.5} />
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 800, 
                fontSize: '1.35rem',
                color: '#0f172a',
                letterSpacing: '-0.02em',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              AppQR
            </Typography>
          </Box>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {[
                { label: 'Dashboard', icon: LayoutDashboard, active: true },
                { label: 'Analytics', icon: BarChart3, active: false },
                { label: 'Settings', icon: Settings, active: false },
              ].map((item) => (
                <Button 
                  key={item.label}
                  startIcon={<item.icon size={16} />}
                  sx={{ 
                    borderRadius: 2,
                    px: 2.5,
                    py: 1.25,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: item.active ? '#2563eb' : '#64748b',
                    bgcolor: item.active ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                    '&:hover': {
                      bgcolor: item.active ? 'rgba(37, 99, 235, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                      color: item.active ? '#1d4ed8' : '#0f172a',
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Notifications">
            <IconButton 
              sx={{ 
                color: '#64748b',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                  color: '#0f172a',
                }
              }}
            >
              <Badge 
                badgeContent={''} 
                color="error" 
                variant="dot"
                sx={{ 
                  '& .MuiBadge-badge': {
                    width: 8,
                    height: 8,
                    minWidth: 8,
                  }
                }}
              >
                <Bell size={20} />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Box 
            sx={{ 
              height: 28, 
              width: 1, 
              bgcolor: 'rgba(0, 0, 0, 0.08)',
              mx: 1,
              display: { xs: 'none', sm: 'block' }
            }} 
          />
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              pl: 2,
              pr: 2,
              cursor: 'pointer',
              py: 0.5,
              borderRadius: 2,
              transition: 'background 0.2s ease',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right', mr: 1, minWidth: 100 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 700, 
                  color: '#0f172a',
                  lineHeight: 1.2
                }}
              >
                Alex Rivera
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: '0.75rem', 
                  color: '#2563eb',
                  fontWeight: 600,
                  display: 'block',
                  mt: 0.5
                }}
              >
                Pro Member
              </Typography>
            </Box>
            <Avatar 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
              sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: 2.5,
                border: '2px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;