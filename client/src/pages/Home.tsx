import React, { useState } from 'react';
import {
  Box, Typography, Button, Card, CardContent, Chip, Slider, Dialog,
  DialogTitle, DialogContent, DialogActions, IconButton, TextField,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Add, Login as JoinIcon, EmojiEvents, MusicNote, Close, Group } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import cassetteImg from '@/assets/cassette.png';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [rounds, setRounds] = useState(5);
  const [clipDuration, setClipDuration] = useState(15);

  const handleJoin = () => {
    if (joinCode.trim().length === 6) {
      navigate(`/game/${joinCode.toUpperCase()}`);
    }
  };

  const handleCreate = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCreateOpen(false);
    navigate(`/game/${code}?host=true&rounds=${rounds}&duration=${clipDuration}`);
  };

  return (
    <Box sx={{ mx: 'auto', px: 0 }}>
      {/* Hero Section — matches reference */}
      <Box sx={{ pt: { xs: 4, md: 6 }, pb: 2, px: { xs: 1, md: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: '100%' }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '12vw', md: '11vw' },
              lineHeight: 1,
              color: 'primary.main',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Guess
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '12vw', md: '11vw' },
              lineHeight: 1,
              color: 'primary.main',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            The
          </Typography>
          <Typography
            variant="h2"
            sx={{