import React from 'react';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Box, Avatar, Chip,
} from '@mui/material';
import { MusicNote, DarkMode, LightMode, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useThemeMode } from '@/context/ThemeContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        backdropFilter: 'blur(20px)',
        backgroundColor: mode === 'dark' ? 'rgba(18,18,18,0.85)' : 'rgba(255,255,255,0.85)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <MusicNote sx={{ color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h6" fontWeight={800} color="text.primary">
            SoundGuess
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={toggleTheme} color="inherit" sx={{ color: 'text.secondary' }}>
            {mode === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>

          {user ? (
            <>
              <Chip
                avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>{user.username[0].toUpperCase()}</Avatar>}
                label={user.username}
                variant="outlined"
                sx={{ color: 'text.primary', borderColor: 'divider' }}
              />
              {user.isGuest && (
                <Chip label="Guest" size="small" color="warning" variant="outlined" />
              )}
              <IconButton onClick={() => { logout(); navigate('/'); }} sx={{ color: 'text.secondary' }}>
                <Logout />
              </IconButton>
            </>
          ) : (
            <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>