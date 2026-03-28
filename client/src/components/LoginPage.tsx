import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Link as MuiLink,
  Alert,
} from "@mui/material";
import { MusicNote, Person } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [guestName, setGuestName] = useState("");
  const [showGuest, setShowGuest] = useState(false);
  const {
    static: { error },
    action: { login, guestLogin },
  } = useAuthContext();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch {
      console.log(error);
    }
  };

  const handleGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (guestName.trim()) {
      try {
        await guestLogin(guestName.trim());
        navigate("/");
      } catch {
        console.log(error);
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 440, width: "100%", p: 1 }} elevation={8}>
        <CardContent
          sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
        >
          <Box sx={{ textAlign: "center", mb: 1 }}>
            <MusicNote sx={{ fontSize: 48, color: "primary.main" }} />
            <Typography variant="h4" fontWeight={800}>
              Welcome Back
            </Typography>
            <Typography color="text.secondary">
              Sign in to continue playing
            </Typography>
          </Box>

          {!showGuest ? (
            <Box
              component="form"
              onSubmit={handleLogin}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" variant="contained" size="large" fullWidth>
                Sign In
              </Button>

              <Divider>
                <Typography variant="caption" color="text.secondary">
                  or
                </Typography>
              </Divider>

              <Button
                variant="outlined"
                startIcon={<Person />}
                fullWidth
                onClick={() => setShowGuest(true)}
                sx={{ borderColor: "divider", color: "text.primary" }}
              >
                Continue as Guest
              </Button>

              <Typography
                variant="body2"
                textAlign="center"
                color="text.secondary"
              >
                Don't have an account?{" "}
                <MuiLink
                  component={Link}
                  to="/register"
                  color="primary"
                  underline="hover"
                >
                  Sign Up
                </MuiLink>
              </Typography>
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={handleGuest}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Alert severity="info" sx={{ borderRadius: 3 }}>
                Guest players can join games but can't create rooms or track
                stats.
              </Alert>
              <TextField
                label="Display Name"
                fullWidth
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Enter a nickname"
              />
              <Button type="submit" variant="contained" size="large" fullWidth>
                Join as Guest
              </Button>
              <Button
                variant="text"
                onClick={() => setShowGuest(false)}
                sx={{ color: "text.secondary" }}
              >
                Back to Sign In
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
