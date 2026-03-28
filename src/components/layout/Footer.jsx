'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Grid,
  Link,
  IconButton,
  Tooltip
} from '@mui/material';
import { QrCode, Mail, Code2, MessageCircle } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    Product: ['Features', 'Pricing', 'API', 'Integrations'],
    Company: ['About', 'Blog', 'Careers', 'Press'],
    Legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
    Resources: ['Documentation', 'Help Center', 'Community', 'Status'],
  };

  return (
    <Box 
      component="footer"
      sx={{ 
        py: 8, 
        borderTop: '1px solid #e2e8f0',
        bgcolor: '#ffffff'
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 4, md: 8 } }}>
        <Grid container spacing={5}>
          {/* Brand Section */}
          <Grid item size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box 
                sx={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                }}
              >
                <QrCode size={18} strokeWidth={2.5} />
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 800, 
                  fontSize: '1.35rem',
                  color: '#0f172a',
                  letterSpacing: '-0.02em'
                }}
              >
                AppQR
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#64748b',
                fontSize: '0.9rem',
                lineHeight: 1.7,
                fontWeight: 500,
                maxWidth: 300,
                mb: 3
              }}
            >
              The global standard for smart mobile link redirection. Trusted by top teams worldwide.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[
                { icon: Code2, label: 'GitHub' },
                { icon: MessageCircle, label: 'Discord' },
                { icon: Mail, label: 'Email' },
              ].map((social, i) => (
                <Tooltip key={i} title={social.label}>
                  <IconButton 
                    size="small"
                    sx={{ 
                      color: '#64748b',
                      bgcolor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      '&:hover': {
                        bgcolor: '#f1f5f9',
                        color: '#2563eb',
                        borderColor: '#2563eb',
                      }
                    }}
                  >
                    <social.icon size={16} />
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          </Grid>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <Grid item size={{ xs: 6, sm: 3, md: 2 }} key={title}>
              <Typography 
                sx={{ 
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#0f172a',
                  display: 'block',
                  mb: 2.5
                }}
              >
                {title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {links.map((link) => (
                  <Link
                    key={link}
                    href="#"
                    underline="none"
                    sx={{ 
                      color: '#64748b',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'color 0.2s ease',
                      '&:hover': {
                        color: '#2563eb',
                      }
                    }}
                  >
                    {link}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box 
          sx={{ 
            mt: 8,
            pt: 5,
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Typography 
            sx={{ 
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            © 2026 AppQR Technologies, Inc.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Link href="#" sx={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500, '&:hover': { color: '#2563eb' } }}>
              Privacy
            </Link>
            <Link href="#" sx={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500, '&:hover': { color: '#2563eb' } }}>
              Terms
            </Link>
            <Link href="#" sx={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500, '&:hover': { color: '#2563eb' } }}>
              Sitemap
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;