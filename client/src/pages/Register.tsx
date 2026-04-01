import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Link as MuiLink,
  Snackbar, Alert,
} from '@mui/material';
import { MusicNote } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const { static: { error, isLoading }, action: { register } } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) setToast(error);
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return;
    try {
      await register(username, email, password);
      navigate('/');
    } catch {
      // toast handles it
    }
  };

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Card sx={{ maxWidth: 440, width: '100%', p: 1 }} elevation={8}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={{ textAlign: 'center', mb: 1 }}>
            <MusicNote sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight={800}>Create Account</Typography>
            <Typography color="text.secondary">Join the music guessing fun</Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Username" fullWidth required value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField label="Email" type="email" fullWidth required value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Password" type="password" fullWidth required value={password} onChange={(e) => setPassword(e.target.value)} />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={confirm.length > 0 && password !== confirm}
              helperText={confirm.length > 0 && password !== confirm ? 'Passwords do not match' : ''}
            />
            <Button type="submit" variant="contained" size="large" fullWidth disabled={password !== confirm || !password || isLoading}>
              {isLoading ? 'Creating...' : 'Create Account'}
            </Button>

            <Typography variant="body2" textAlign="center" color="text.secondary">
              Already have an account?{' '}
              <MuiLink component={Link} to="/login" color="primary" underline="hover">
                Sign In
              </MuiLink>
            </Typography>
          </Box>
        </CardContent>
      </Card>

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

export default Register;
