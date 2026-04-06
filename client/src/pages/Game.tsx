import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, Button, LinearProgress, Chip, Slider,
  List, ListItem, ListItemAvatar, ListItemText, Avatar, Paper, IconButton, Snackbar, Alert, Collapse,
} from '@mui/material';
import {
  PlayArrow, Pause, EmojiEvents, MusicNote, Timer, ContentCopy, Send,
  VolumeUp, VolumeOff, CheckCircle, Cancel,
} from '@mui/icons-material';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSocketContext } from '@/context/SocketContext';

interface Player {
  userId: string;
  username: string;
  score: number;
}

interface RoundStartData {
  roundNum: number;
  songUrl: string;
  duration: number;
}

interface GuessResultData {
  userId: string;
  correct: boolean;
  accuracy: number;
  artistMatch: boolean;
  points: number;
}

interface RoundEndData {
  answer: { title: string; artist: string };
  scores: { userId: string; score: number }[];
}

interface FinishedData {
  finalScores: { userId: string; score: number; rank: number }[];
}

interface RoomData {
  code: string;
  hostId: string;
  players: { userId: string; username: string }[];
  settings: { rounds: number; clipDuration: number };
  status: string;
}

type GamePhase = 'lobby' | 'playing' | 'reveal' | 'finished';

const Game: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [searchParams] = useSearchParams();
  const isHost = searchParams.get('host') === 'true';
  const { static: { user } } = useAuth();
  const { socket } = useSocketContext();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<GamePhase>('lobby');
  const [round, setRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(5);
  const [guess, setGuess] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [duration, setDuration] = useState(15);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [answer, setAnswer] = useState<{ title: string; artist: string } | null>(null);
  const [lastResult, setLastResult] = useState<{ correct: boolean; accuracy: number; artistMatch: boolean; points: number } | null>(null);
  const [volume, setVolume] = useState(70);

  const audioRef = useRef<HTMLAudioElement>(null);
  const guessInputRef = useRef<HTMLInputElement>(null);
  // The server assigns its own room code; store it here so all emits use it.
  const roomCodeRef = useRef<string>(code || '');

  // Sync volume to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Autofocus guess input when round starts
  useEffect(() => {
    if (phase === 'playing' && !submitted) {
      guessInputRef.current?.focus();
    }
  }, [phase, submitted]);

  // Join / create room on mount
  useEffect(() => {
    if (!socket || !user || !code) return;

    roomCodeRef.current = code;

    if (isHost) {
      const rounds = Number(searchParams.get('rounds')) || 5;
      const duration = Number(searchParams.get('duration')) || 15;
      socket.emit('room:create', {
        id: user.id,
        username: user.username,
        code,
        settings: { rounds, clipDuration: duration },
      });
    } else {
      socket.emit('room:join', { code, id: user.id, username: user.username });
    }

    return () => {
      socket.emit('room:leave', { code: roomCodeRef.current, id: user.id });
    };
  }, [socket, user, code, isHost]);

  // Listen to socket events
  useEffect(() => {
    if (!socket) return;

    const onRoomUpdated = (room: RoomData) => {
      roomCodeRef.current = room.code;
      setPlayers(prev => {
        // Preserve existing scores when players list updates (e.g. someone joins mid-lobby)
        const scoreMap = new Map(prev.map(p => [p.userId, p.score]));
        return room.players.map(p => ({
          userId: p.userId,
          username: p.username,
          score: scoreMap.get(p.userId) ?? 0,
        }));
      });
      setTotalRounds(room.settings.rounds);
    };

    const onRoundStart = (data: RoundStartData) => {
      setPhase('playing');
      setRound(data.roundNum);
      setDuration(data.duration);
      setTimeLeft(data.duration);
      setGuess('');
      setSubmitted(false);
      setAnswer(null);
      setLastResult(null);

      // Play audio
      if (audioRef.current && data.songUrl) {
        audioRef.current.src = data.songUrl;
        audioRef.current.play().catch(() => {});
      }

    };

    const onTimerTick = (time: number) => {
      setTimeLeft(time);
    };

    const onGuessResult = (data: GuessResultData) => {
      if (data.userId === user?.id) {
        setLastResult({ correct: data.correct, accuracy: data.accuracy, artistMatch: data.artistMatch, points: data.points });
      }
      // Update player score
      setPlayers(prev => prev.map(p =>
        p.userId === data.userId ? { ...p, score: p.score + data.points } : p
      ));
    };

    const onRoundEnd = (data: RoundEndData) => {
      setPhase('reveal');
      setAnswer(data.answer);
      // Stop audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      // Sync scores from server
      setPlayers(prev => prev.map(p => {
        const serverScore = data.scores.find(s => s.userId === p.userId);
        return serverScore ? { ...p, score: serverScore.score } : p;
      }));
    };

    const onFinished = (data: FinishedData) => {
      setPhase('finished');
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayers(prev => prev.map(p => {
        const final = data.finalScores.find(s => s.userId === p.userId);
        return final ? { ...p, score: final.score } : p;
      }));
    };

    const onError = (data: { message: string }) => {
      console.error('Socket error:', data.message);
    };

    socket.on('room:updated', onRoomUpdated);
    socket.on('game:round-start', onRoundStart);
    socket.on('game:timer-tick', onTimerTick);
    socket.on('game:guess-result', onGuessResult);
    socket.on('game:round-end', onRoundEnd);
    socket.on('game:finished', onFinished);
    socket.on('error', onError);

    return () => {
      socket.off('room:updated', onRoomUpdated);
      socket.off('game:round-start', onRoundStart);
      socket.off('game:timer-tick', onTimerTick);
      socket.off('game:guess-result', onGuessResult);
      socket.off('game:round-end', onRoundEnd);
      socket.off('game:finished', onFinished);
      socket.off('error', onError);
    };
  }, [socket, user]);

  const handleStart = useCallback(() => {
    if (!socket) return;
    socket.emit('game:start', { code: roomCodeRef.current });
  }, [socket]);

  const handleSubmitGuess = useCallback(() => {
    if (!guess.trim() || !socket || !user || submitted) return;
    setSubmitted(true);
    socket.emit('game:guess', { code: roomCodeRef.current, userId: user.id, guess: guess.trim() });
  }, [socket, user, guess, submitted]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code || '');
    setCopied(true);
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      {/* Hidden audio element */}
      <audio ref={audioRef} />

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Room: {code}</Typography>
          <Chip
            label={phase === 'lobby' ? 'Waiting' : phase === 'finished' ? 'Finished' : `Round ${round}/${totalRounds}`}
            color={phase === 'playing' ? 'primary' : 'default'}
            size="small"
          />
        </Box>
        <IconButton onClick={handleCopyCode}>
          <ContentCopy />
        </IconButton>
      </Box>

      {/* Lobby */}
      {phase === 'lobby' && (
        <Card elevation={4}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <MusicNote sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" fontWeight={700} gutterBottom>Ready to Play?</Typography>
            <Typography color="text.secondary" gutterBottom>
              Share code <strong>{code}</strong> with friends
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {players.length} player(s) in room
            </Typography>
            {players.length > 0 && (
              <Box sx={{ mb: 3 }}>
                {players.map(p => (
                  <Chip key={p.userId} label={p.username} sx={{ m: 0.5 }} />
                ))}
              </Box>
            )}
            {isHost && (
              <Button variant="contained" size="large" onClick={handleStart} startIcon={<PlayArrow />}>
                Start Game
              </Button>
            )}
            {!isHost && (
              <Typography variant="body2" color="text.secondary">Waiting for host to start...</Typography>
            )}
          </CardContent>
        </Card>
      )}

      {/* Playing */}
      {phase === 'playing' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Card elevation={4}>
            <CardContent>
              {/* Timer bar */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Timer color="warning" />
                <Typography variant="h6" fontWeight={700}>{timeLeft}s</Typography>
                <LinearProgress
                  variant="determinate"
                  value={duration > 0 ? (timeLeft / duration) * 100 : 0}
                  sx={{ flex: 1, ml: 1, height: 8, borderRadius: 4 }}
                />
              </Box>

              {/* Music icon + volume control */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, gap: 2 }}>
                <MusicNote sx={{ fontSize: 56, color: 'primary.main' }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%', maxWidth: 280 }}>
                  <IconButton size="small" onClick={() => setVolume(v => v > 0 ? 0 : 70)} sx={{ color: 'text.secondary' }}>
                    {volume === 0 ? <VolumeOff /> : <VolumeUp />}
                  </IconButton>
                  <Slider
                    value={volume}
                    onChange={(_, v) => setVolume(v as number)}
                    min={0}
                    max={100}
                    size="small"
                    sx={{ color: 'primary.main' }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 30, textAlign: 'right' }}>
                    {volume}%
                  </Typography>
                </Box>
              </Box>

              {/* Guess result feedback */}
              <Collapse in={!!lastResult}>
                {lastResult && (() => {
                  const isPerfect = lastResult.correct;
                  const isPartial = !isPerfect && lastResult.points > 0;

                  let color: string;
                  let bgColor: string;
                  let label: string;
                  if (isPerfect) {
                    color = 'success.main';
                    bgColor = 'rgba(46, 125, 50, 0.15)';
                    label = 'Correct!';
                  } else if (isPartial) {
                    color = 'warning.main';
                    bgColor = 'rgba(237, 108, 2, 0.15)';
                    label = 'Close!';
                  } else {
                    color = 'error.main';
                    bgColor = 'rgba(211, 47, 47, 0.15)';
                    label = 'Wrong!';
                  }

                  return (
                    <Box
                      sx={{
                        mb: 2, p: 2, borderRadius: 2, textAlign: 'center',
                        bgcolor: bgColor, border: 1, borderColor: color,
                      }}
                    >
                      {isPerfect || isPartial ? (
                        <CheckCircle sx={{ fontSize: 40, color, mb: 0.5 }} />
                      ) : (
                        <Cancel sx={{ fontSize: 40, color, mb: 0.5 }} />
                      )}
                      <Typography variant="h6" fontWeight={700} color={color}>{label}</Typography>
                      {lastResult.points > 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          +{lastResult.points} points ({Math.round(lastResult.accuracy * 100)}% match)
                          {lastResult.artistMatch && ' + Artist bonus!'}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">Better luck next time</Typography>
                      )}
                    </Box>
                  );
                })()}
              </Collapse>

              {/* Guess input */}
              <Box component="form" onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleSubmitGuess(); }} sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Type the song title or artist..."
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  disabled={submitted}
                  inputRef={guessInputRef}
                />
                <Button variant="contained" onClick={handleSubmitGuess} disabled={submitted || !guess.trim()} endIcon={<Send />}>
                  Guess
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Reveal */}
      {phase === 'reveal' && answer && (
        <Card elevation={4}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            {lastResult && lastResult.points > 0 && (
              <CheckCircle sx={{ fontSize: 48, color: lastResult.correct ? 'success.main' : 'warning.main', mb: 1 }} />
            )}
            {lastResult && lastResult.points === 0 && (
              <Cancel sx={{ fontSize: 48, color: 'error.main', mb: 1 }} />
            )}
            <Typography variant="h5" fontWeight={700} gutterBottom>The answer was...</Typography>
            <Typography variant="h4" color="primary.main" fontWeight={800}>{answer.title}</Typography>
            <Typography color="text.secondary" gutterBottom>by {answer.artist}</Typography>
            {lastResult && lastResult.points > 0 && (
              <Typography variant="h6" color={lastResult.correct ? 'success.main' : 'warning.main'} sx={{ mt: 1 }}>
                {lastResult.correct ? 'You got it!' : `${Math.round(lastResult.accuracy * 100)}% match!`} +{lastResult.points} pts
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Next round starting automatically...
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Finished */}
      {phase === 'finished' && (
        <Card elevation={4}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <EmojiEvents sx={{ fontSize: 64, color: 'warning.main', mb: 1 }} />
            <Typography variant="h4" fontWeight={800} gutterBottom>Game Over!</Typography>
            {sortedPlayers[0] && (
              <Typography variant="h6" color="primary.main" gutterBottom>
                Winner: {sortedPlayers[0].username} ({sortedPlayers[0].score} pts)
              </Typography>
            )}
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
              sx={{ mt: 3 }}
            >
              Back Home
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Scoreboard */}
      <Paper elevation={2} sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          <EmojiEvents sx={{ verticalAlign: 'middle', mr: 1, color: 'warning.main' }} />
          Scoreboard
        </Typography>
        <List>
          {sortedPlayers.map((player, i) => (
            <ListItem key={player.userId}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: i === 0 ? 'warning.main' : 'grey.400' }}>
                  {i + 1}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${player.username}${player.userId === user?.id ? ' (You)' : ''}`}
                secondary={`${player.score} pts`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Snackbar open={copied} autoHideDuration={2000} onClose={() => setCopied(false)}>
        <Alert severity="success" onClose={() => setCopied(false)}>Room code copied!</Alert>
      </Snackbar>
    </Box>
  );
};

export default Game;
