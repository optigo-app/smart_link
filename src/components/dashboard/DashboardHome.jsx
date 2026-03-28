'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  InputBase,
  Grid,
  Paper
} from '@mui/material';
import { 
  Plus, 
  Search, 
  Smartphone,
  TrendingUp,
  Users,
  Link2
} from 'lucide-react';
import AppCard from './AppCard';

const DashboardHome = ({ apps, onCreateNew, onViewApp }) => {
  return (
    <Box sx={{ 
      maxWidth: 1600, 
      mx: 'auto', 
      py: 5, 
      px: { xs: 3, sm: 4, md: 6, lg: 8 },
      bgcolor: '#f8fafc',
      minHeight: 'calc(100vh - 72px)'
    }}>
      {/* Header Section */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          alignItems: { xs: 'flex-start', md: 'center' }, 
          justifyContent: 'space-between',
          gap: 4,
          mb: 5
        }}
      >
        <Box>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              color: '#0f172a',
              letterSpacing: '-0.025em',
              mb: 1
            }}
          >
            My Smart Links
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#64748b',
              fontWeight: 500,
              fontSize: '1rem'
            }}
          >
            Cross-platform redirection and real-time analytics.
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, width: { xs: '100%', md: 'auto' } }}>
          <Box 
            sx={{ 
              position: 'relative',
              flex: 1,
              display: { xs: 'none', md: 'block' }
            }}
          >
            <Search 
              size={18}
              style={{ 
                position: 'absolute', 
                left: 16, 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#94a3b8',
                zIndex: 1
              }} 
            />
            <InputBase
              placeholder="Search your apps..."
              sx={{
                pl: 5.5,
                pr: 3,
                py: 1.75,
                bgcolor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 2.5,
                fontSize: '0.875rem',
                fontWeight: 500,
                width: 280,
                color: '#0f172a',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.2s ease',
                '&:focus-within': {
                  bgcolor: '#ffffff',
                  borderColor: '#2563eb',
                  boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1)',
                }
              }}
            />
          </Box>
          <Button 
            variant="contained"
            startIcon={<Plus size={18} strokeWidth={2.5} />}
            onClick={onCreateNew}
            sx={{
              bgcolor: '#0f172a',
              color: 'white',
              px: 4,
              py: 1.75,
              borderRadius: 2.5,
              fontWeight: 700,
              fontSize: '0.9rem',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#1e293b',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                transform: 'translateY(-1px)',
              },
              '&:active': {
                transform: 'scale(0.98)',
              }
            }}
          >
            Create New
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {[
          { label: 'Total Links', value: '12', icon: Link2, change: '+2 this week', color: '#2563eb' },
          { label: 'Total Scans', value: '4,450', icon: Smartphone, change: '+18%', color: '#059669' },
          { label: 'Active Users', value: '1,234', icon: Users, change: '+8%', color: '#7c3aed' },
          { label: 'Conversion', value: '23.5%', icon: TrendingUp, change: '+2.1%', color: '#dc2626' },
        ].map((stat, index) => (
          <Grid item size={{ xs: 6, md: 3 }} key={index}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: '#ffffff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                <Box 
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    bgcolor: `${stat.color}10`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <stat.icon size={20} color={stat.color} />
                </Box>
                <Typography 
                  sx={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 600, 
                    color: '#059669',
                    bgcolor: '#ecfdf5',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  {stat.change}
                </Typography>
              </Box>
              <Typography 
                sx={{ 
                  fontSize: '1.75rem', 
                  fontWeight: 800, 
                  color: '#0f172a',
                  mb: 0.5
                }}
              >
                {stat.value}
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 500, 
                  color: '#64748b'
                }}
              >
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Apps Grid */}
      <Box sx={{ mb: 2 }}>
        <Typography 
          sx={{ 
            fontSize: '0.875rem', 
            fontWeight: 700, 
            color: '#64748b',
            mb: 3,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          Your Smart Links ({apps.length})
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item size={{ xs: 12, sm: 6, lg: 3 }}>
          <Box
            onClick={onCreateNew}
            sx={{
              border: '2px dashed #cbd5e1',
              borderRadius: '20px',
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              minHeight: 240,
              cursor: 'pointer',
              bgcolor: '#f8fafc',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#2563eb',
                bgcolor: 'rgba(37, 99, 235, 0.04)',
                '& .add-icon': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: 'white',
                  boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
                },
              }
            }}
          >
            <Box 
              className="add-icon"
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3.5,
                bgcolor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              <Plus size={28} color="#64748b" />
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#0f172a',
                  display: 'block',
                  fontSize: '1rem',
                  mb: 0.5
                }}
              >
                New Smart Link
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#94a3b8',
                  fontWeight: 500,
                  fontSize: '0.8rem'
                }}
              >
                Add iOS & Android stores
              </Typography>
            </Box>
          </Box>
        </Grid>
        {apps.map(app => (
          <Grid item size={{ xs: 12, sm: 6, lg: 3 }} key={app.id}>
            <AppCard app={app} onClick={() => onViewApp(app)} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardHome;