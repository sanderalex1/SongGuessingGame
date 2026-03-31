import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, Button, LinearProgress, Chip,
  List, ListItem, ListItemAvatar, ListItemText, Avatar, Paper, IconButton, Snackbar, Alert,
} from '@mui/material';
import {
  PlayArrow, Pause, EmojiEvents, MusicNote, Timer, ContentCopy, Send,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const MOCK_SONGS = [
  { title: 'Blinding Lights', artist: 'The Weeknd', preview: '' },
  { title: 'Shape of You', artist: 'Ed Sheeran', preview: '' },
  { title: 'Bohemian Rhapsody', artist: 'Queen', preview: '' },
  { title: 'Rolling in the Deep', artist: 'Adele', preview: '' },
  { title: 'Uptown Funk', artist: 'Bruno Mars', preview: '' },
];

interface Player {
  id: string;
  name: string;
  score: number;
  lastGuess?: string;
  correct?: boolean;
}

type GamePhase = 'lobby' | 'playing' | 'reveal' | 'finished';

const Game: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const { user } = useAuth();
  const [phase, setPhase] = useState<GamePhase>('lobby');
  const [round, setRound] = useState(1);
  const totalRounds = 5;
  const [guess, setGuess] = useState('');
  const [timeLeft, setTimeLeft] = useState(15);
  const [isPlaying, setIsPlaying] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: user?.username || 'You', score: 0 },
    { id: '2', name: 'MusicFan42', score: 0 },
    { id: '3', name: 'BeatDropper', score: 0 },
  ]);

  const currentSong = MOCK_SONGS[(round - 1) % MOCK_SONGS.length];

  // Timer countdown
  useEffect(() => {
    if (phase !== 'playing' || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  // Auto-reveal when time's up
  useEffect(() => {
    if (phase === 'playing' && timeLeft <= 0) {
      handleReveal();
    }
  }, [timeLeft, phase]);

  const handleStart = () => {
    setPhase('playing');
    setTimeLeft(15);