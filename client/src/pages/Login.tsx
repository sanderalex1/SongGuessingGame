import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Divider, Link as MuiLink,
  Snackbar, Alert,
} from '@mui/material';
import { MusicNote, Person, Login as JoinIcon } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

type GuestStep = 'name' | 'room';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [guestName, setGuestName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [showGuest, setShowGuest] = useState(false);
  const [guestStep, setGuestStep] = useState<GuestStep>('name');
  const [toast, setToast] = useState<string | null>(null);
  const { static: { error, isLoading }, action: { login, guestLogin: loginAsGuest } } = useAuth();
  const navigate = useNavigate();

  // Show error as toast whenever it changes
  useEffect(() => {
    if (error) setToast(error);
  }, [error]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch {
      // toast handles it
    }
  };

  const handleGuestName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    try {
      await loginAsGuest(guestName.trim());
      setGuestStep('room');
    } catch {
      // toast handles it
    }
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const code = roomCode.trim().toUpperCase();
    if (code.length >= 4) {
      navigate(`/game/${code}`);
    }
  };

  const handleCreateRoom = () => {
    navigate(`/`);
  };

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Card sx={{ maxWidth: 440, width: '100%', p: 1 }} elevation={8}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={{ textAlign: 'center', mb: 1 }}>
            <MusicNote sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight={800}>
              {showGuest && guestStep === 'room' ? 'Join a Room' : 'Welcome Back'}
            </Typography>
            <Typography color="text.secondary">
              {showGuest && guestStep === 'room'
                ? 'Enter a room code to start playing'
                : 'Sign in to continue playing'}
            </Typography>
          </Box>

          {/* ---- Regular login form ---- */}
          {!showGuest && (
            <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Email" type="email" fullWidth required value={email} onChange={(e) => setEmail(e.target.value)} />
              <TextField label="Password" type="password" fullWidth required value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button type="submit" variant="contained" size="large" fullWidth disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <Divider><Typography variant="caption" color="text.secondary">or</Typography></Divider>

              <Button
                variant="outlined"
                startIcon={<Person />}
                fullWidth
                onClick={() => { setShowGuest(true); setGuestStep('name'); }}
                sx={{ borderColor: 'divider', color: 'text.primary' }}
              >
                Continue as Guest
              </Button>

              <Typography variant="body2" textAlign="center" color="text.secondary">
                Don't have an account?{' '}
                <MuiLink component={Link} to="/register" color="primary" underline="hover">
                  Sign Up
                </MuiLink>
              </Typography>
            </Box>
          )}

          {/* ---- Guest step 1: Enter name ---- */}
          {showGuest && guestStep === 'name' && (
            <Box component="form" onSubmit={handleGuestName} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Guest Name"
                fullWidth
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                autoFocus
              />
              <Button type="submit" variant="contained" size="large" fullWidth disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Continue'}
              </Button>
              <Button variant="text" onClick={() => setShowGuest(false)}>
                Back to Sign In
              </Button>
            </Box>
          )}

          {/* ---- Guest step 2: Enter room code ---- */}
          {showGuest && guestStep === 'room' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box component="form" onSubmit={handleJoinRoom} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Room Code"
                  fullWidth
                  required
                  placeholder="e.g. ABC123"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  inputProps={{ maxLength: 8 }}
                  autoFocus
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={roomCode.trim().length < 4}
                  startIcon={<JoinIcon />}
                >
                  Join Room
                </Button>
              </Box>

              <Divider><Typography variant="caption" color="text.secondary">or</Typography></Divider>

              <Button variant="outlined" fullWidth onClick={handleCreateRoom}>
                Go to Home & Create a Room
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Error toast — bottom-right, auto-hide 7s */}
      <Snackbar
        open={!!toast}
        autoHideDuration={7000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToast(null)}
          severity="error"
          variant="filled"
          elevation={6}
          sx={{ minWidth: 280 }}
        >
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
