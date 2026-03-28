'use client';

import React, { useRef, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField,
  Grid,
  Paper,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  ArrowLeft, 
  Smartphone, 
  Globe, 
  Apple, 
  CheckCircle2,
  Sparkles,
  Loader2,
  Upload,
  X
} from 'lucide-react';

const CreateAppView = ({ formData, setFormData, isGenerating, onReset, onCreateNew }) => {
  const fileInputRef = useRef(null);
  const [uploadedIcon, setUploadedIcon] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedIcon(e.target?.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('appName', formData.name || 'app-' + Date.now());

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, icon: data.iconPath }));
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveIcon = () => {
    setUploadedIcon(null);
    setFormData(prev => ({ ...prev, icon: '' }));
  };

  return (
    <Box 
      sx={{ 
        maxWidth: 900, 
        mx: 'auto', 
        py: 5, 
        px: { xs: 3, sm: 4, md: 6 },
        bgcolor: '#f8fafc',
        minHeight: 'calc(100vh - 72px)'
      }}
    >
      <Button 
        onClick={onReset}
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
        {/* Left Side - Form */}
        <Grid item size={{ xs: 12, md: 7 }}>
          <Paper 
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              bgcolor: '#ffffff',
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800, 
                  color: '#0f172a',
                  mb: 1,
                  letterSpacing: '-0.02em'
                }}
              >
                Create New Smart Link
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.95rem' }}>
                Enter your app details to generate a smart QR code that directs users to the right store.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
              {/* App Icon Upload */}
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
                    width: 100,
                    height: 100,
                    borderRadius: 3,
                    border: '2px dashed #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    bgcolor: '#f8fafc',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#2563eb',
                      bgcolor: 'rgba(37, 99, 235, 0.04)'
                    }
                  }}
                >
                  {uploading ? (
                    <CircularProgress size={32} sx={{ color: '#2563eb' }} />
                  ) : uploadedIcon ? (
                    <>
                      <img 
                        src={uploadedIcon} 
                        alt="App Icon" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); handleRemoveIcon(); }}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                          width: 24,
                          height: 24
                        }}
                      >
                        <X size={14} />
                      </IconButton>
                    </>
                  ) : (
                    <Box sx={{ textAlign: 'center', color: '#94a3b8' }}>
                      <Upload size={24} />
                      <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>Upload</Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* App Name */}
              <Box>
                <Typography sx={{ fontWeight: 600, color: '#0f172a', mb: 1.5, fontSize: '0.9rem' }}>
                  App Name
                </Typography>
                <TextField
                  fullWidth
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your app name"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2.5,
                      bgcolor: '#f8fafc',
                      '& fieldset': {
                        borderColor: '#e2e8f0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#cbd5e1',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2563eb',
                        borderWidth: 2,
                      }
                    },
                    '& .MuiInputBase-input': {
                      py: 1.75,
                      fontWeight: 500,
                      fontSize: '0.95rem',
                    }
                  }}
                />
              </Box>

              {/* Store Links */}
              <Box>
                <Typography sx={{ fontWeight: 600, color: '#0f172a', mb: 1.5, fontSize: '0.9rem' }}>
                  Store Links
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {/* Android Link */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box 
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2.5,
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Smartphone size={20} color="#64748b" />
                    </Box>
                    <TextField
                      fullWidth
                      value={formData.android}
                      onChange={(e) => handleInputChange('android', e.target.value)}
                      placeholder="https://play.google.com/store/app..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2.5,
                          bgcolor: '#f8fafc',
                          '& fieldset': {
                            borderColor: '#e2e8f0',
                          },
                          '&:hover fieldset': {
                            borderColor: '#cbd5e1',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#2563eb',
                            borderWidth: 2,
                          }
                        },
                        '& .MuiInputBase-input': {
                          py: 1.5,
                          fontWeight: 500,
                          fontSize: '0.9rem',
                        }
                      }}
                    />
                  </Box>

                  {/* iOS Link */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box 
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2.5,
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Apple size={20} color="#64748b" />
                    </Box>
                    <TextField
                      fullWidth
                      value={formData.ios}
                      onChange={(e) => handleInputChange('ios', e.target.value)}
                      placeholder="https://apps.apple.com/store/app..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2.5,
                          bgcolor: '#f8fafc',
                          '& fieldset': {
                            borderColor: '#e2e8f0',
                          },
                          '&:hover fieldset': {
                            borderColor: '#cbd5e1',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#2563eb',
                            borderWidth: 2,
                          }
                        },
                        '& .MuiInputBase-input': {
                          py: 1.5,
                          fontWeight: 500,
                          fontSize: '0.9rem',
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Create Button */}
              <Button
                variant="contained"
                onClick={onCreateNew}
                disabled={isGenerating}
                sx={{
                  mt: 2,
                  bgcolor: '#0f172a',
                  color: 'white',
                  py: 2,
                  borderRadius: 2.5,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: '#1e293b',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                    transform: 'translateY(-1px)',
                  },
                  '&:disabled': {
                    bgcolor: '#94a3b8',
                    color: 'white',
                  }
                }}
                startIcon={isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              >
                {isGenerating ? 'Generating QR Code...' : 'Generate Smart QR Code'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right Side - Preview */}
        <Grid item size={{ xs: 12, md: 5 }}>
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
            <Typography sx={{ fontWeight: 700, color: '#0f172a', mb: 3, fontSize: '1rem' }}>
              Preview
            </Typography>
            
            <Box 
              sx={{ 
                p: 3, 
                borderRadius: 3, 
                border: '1px solid #e2e8f0',
                bgcolor: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 200,
                gap: 2
              }}
            >
              <Box 
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 3,
                  bgcolor: uploadedIcon ? 'transparent' : '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                {uploadedIcon ? (
                  <img src={uploadedIcon} alt="App Icon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : formData.name ? (
                  <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#64748b' }}>
                    {formData.name.charAt(0).toUpperCase()}
                  </Typography>
                ) : (
                  <Smartphone size={32} color="#94a3b8" />
                )}
              </Box>
              
              <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '1.1rem' }}>
                {formData.name || 'Your App Name'}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                {formData.android && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CheckCircle2 size={14} color="#059669" />
                    <Typography sx={{ fontSize: '0.75rem', color: '#059669', fontWeight: 500 }}>Android</Typography>
                  </Box>
                )}
                {formData.ios && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CheckCircle2 size={14} color="#059669" />
                    <Typography sx={{ fontSize: '0.75rem', color: '#059669', fontWeight: 500 }}>iOS</Typography>
                  </Box>
                )}
              </Box>
              
              {!formData.name && !formData.android && !formData.ios && (
                <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', mt: 2 }}>
                  Enter app details to see preview
                </Typography>
              )}
            </Box>

            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography sx={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                Features included:
              </Typography>
              {[
                'Smart redirect based on device',
                'Real-time analytics',
                'Custom QR code design',
                'Unlimited scans'
              ].map((feature, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle2 size={14} color="#2563eb" />
                  <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>{feature}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateAppView;