import React, { useState } from 'react';
import {
  Box, Typography, Button, Card, CardContent, Chip, Slider, Dialog,
  DialogTitle, DialogContent, DialogActions, IconButton, TextField,
  Avatar, List, ListItem, ListItemAvatar, ListItemText, Paper,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Add, Login as JoinIcon, EmojiEvents, MusicNote, Close, Group, Circle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSocketContext } from '@/context/SocketContext';

/* ------------------------------------------------------------------ */
/*  Cassette tape SVG component                                       */
/* ------------------------------------------------------------------ */
const CassetteSvg: React.FC<{ width?: number }> = ({ width = 320 }) => (
  <svg
    width={width}
    height={width * (480 / 760)}
    viewBox="0 0 760 480"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="shellOuter" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8a7014"/>
        <stop offset="40%" stopColor="#7a6010"/>
        <stop offset="100%" stopColor="#6a520c"/>
      </linearGradient>
      <linearGradient id="shellBody" x1="0" y1="0" x2="0.15" y2="1">
        <stop offset="0%" stopColor="#e2c044"/>
        <stop offset="8%" stopColor="#d8b63e"/>
        <stop offset="35%" stopColor="#ccaa36"/>
        <stop offset="65%" stopColor="#c09e2e"/>
        <stop offset="92%" stopColor="#b08a22"/>
        <stop offset="100%" stopColor="#a6821e"/>
      </linearGradient>
      <linearGradient id="shellBodyH" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#b89428" stopOpacity="0.3"/>
        <stop offset="15%" stopColor="transparent"/>
        <stop offset="85%" stopColor="transparent"/>
        <stop offset="100%" stopColor="#8a7018" stopOpacity="0.25"/>
      </linearGradient>
      <linearGradient id="topEdgeLight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.18"/>
        <stop offset="30%" stopColor="#f8e878" stopOpacity="0.08"/>
        <stop offset="100%" stopColor="transparent"/>
      </linearGradient>
      <linearGradient id="bottomEdgeShadow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="transparent"/>
        <stop offset="70%" stopColor="#6a5210" stopOpacity="0.15"/>
        <stop offset="100%" stopColor="#4a3a08" stopOpacity="0.3"/>
      </linearGradient>
      <linearGradient id="labelPaper" x1="0" y1="0" x2="0.05" y2="1">
        <stop offset="0%" stopColor="#faf5e0"/>
        <stop offset="20%" stopColor="#f4ecd0"/>
        <stop offset="50%" stopColor="#ede4c2"/>
        <stop offset="80%" stopColor="#e6dbb4"/>
        <stop offset="100%" stopColor="#e0d4aa"/>
      </linearGradient>
      <linearGradient id="labelEdgeShadow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c0a848" stopOpacity="0.4"/>
        <stop offset="5%" stopColor="transparent"/>
        <stop offset="95%" stopColor="transparent"/>
        <stop offset="100%" stopColor="#8a7428" stopOpacity="0.3"/>
      </linearGradient>
      <linearGradient id="windowBezel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5e5014"/>
        <stop offset="50%" stopColor="#4a3e0c"/>
        <stop offset="100%" stopColor="#3a3008"/>
      </linearGradient>
      <linearGradient id="windowGlass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e1e1e"/>
        <stop offset="30%" stopColor="#111"/>
        <stop offset="70%" stopColor="#0a0a0a"/>
        <stop offset="100%" stopColor="#161616"/>
      </linearGradient>
      <linearGradient id="windowReflect" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.06"/>
        <stop offset="40%" stopColor="#fff" stopOpacity="0.015"/>
        <stop offset="100%" stopColor="transparent"/>
      </linearGradient>
      <radialGradient id="reelDisc" cx="0.42" cy="0.36" r="0.6">
        <stop offset="0%" stopColor="#ddb838"/>
        <stop offset="30%" stopColor="#c8a42c"/>
        <stop offset="65%" stopColor="#aa8820"/>
        <stop offset="100%" stopColor="#907418"/>
      </radialGradient>
      <radialGradient id="reelDiscEdge" cx="0.5" cy="0.5" r="0.5">
        <stop offset="85%" stopColor="transparent"/>
        <stop offset="95%" stopColor="#6a5810" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#4a3c0a" stopOpacity="0.6"/>
      </radialGradient>
      <radialGradient id="reelHubG" cx="0.36" cy="0.32" r="0.65">
        <stop offset="0%" stopColor="#44381a"/>
        <stop offset="50%" stopColor="#2c2410"/>
        <stop offset="100%" stopColor="#1a1608"/>
      </radialGradient>
      <radialGradient id="reelHighlight" cx="0.3" cy="0.25" r="0.45">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.12"/>
        <stop offset="100%" stopColor="transparent"/>
      </radialGradient>
      <radialGradient id="housingDepth" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#1a1a1a"/>
        <stop offset="60%" stopColor="#111"/>
        <stop offset="100%" stopColor="#0a0a0a"/>
      </radialGradient>
      <radialGradient id="screwMetal" cx="0.32" cy="0.28" r="0.68">
        <stop offset="0%" stopColor="#d0b040"/>
        <stop offset="40%" stopColor="#b09028"/>
        <stop offset="100%" stopColor="#706018"/>
      </radialGradient>
      <radialGradient id="screwSlot" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#4a3c10"/>
        <stop offset="100%" stopColor="#2a2008"/>
      </radialGradient>
      <filter id="mainShadow" x="-6%" y="-4%" width="112%" height="114%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="blur"/>
        <feOffset dx="0" dy="8" result="offset"/>
        <feComponentTransfer result="shadow">
          <feFuncA type="linear" slope="0.45"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode in="shadow"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="labelInset" x="-2%" y="-2%" width="104%" height="104%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
        <feOffset dx="0" dy="1.5"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.2"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="plasticNoise" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="4" stitchTiles="stitch" result="noise"/>
        <feColorMatrix type="saturate" values="0" in="noise" result="gray"/>
        <feComponentTransfer in="gray" result="faint">
          <feFuncA type="linear" slope="0.035"/>
        </feComponentTransfer>
        <feBlend in="SourceGraphic" in2="faint" mode="overlay"/>
      </filter>
      <filter id="paperGrain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="2.5" numOctaves="5" stitchTiles="stitch" result="grain"/>
        <feColorMatrix type="saturate" values="0" in="grain" result="grayGrain"/>
        <feComponentTransfer in="grayGrain" result="subtle">
          <feFuncA type="linear" slope="0.05"/>
        </feComponentTransfer>
        <feBlend in="SourceGraphic" in2="subtle" mode="multiply"/>
      </filter>
      <filter id="innerShadowWin">
        <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="b"/>
        <feOffset dx="0" dy="3" in="b" result="o"/>
        <feComponentTransfer in="o" result="s"><feFuncA type="linear" slope="0.6"/></feComponentTransfer>
        <feComposite in="s" in2="SourceGraphic" operator="atop"/>
      </filter>
      <linearGradient id="moldLine" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#b89828" stopOpacity="0.15"/>
        <stop offset="50%" stopColor="#d4b838" stopOpacity="0.06"/>
        <stop offset="100%" stopColor="#8a7818" stopOpacity="0.2"/>
      </linearGradient>
    </defs>

    {/* Outer shell */}
    <rect x="22" y="16" width="716" height="448" rx="22" ry="22" fill="url(#shellOuter)" filter="url(#mainShadow)"/>

    {/* Main plastic body */}
    <rect x="28" y="20" width="704" height="440" rx="18" ry="18" fill="url(#shellBody)"/>
    <rect x="28" y="20" width="704" height="440" rx="18" ry="18" fill="url(#shellBodyH)"/>
    <rect x="28" y="20" width="704" height="440" rx="18" ry="18" fill="url(#shellBody)" filter="url(#plasticNoise)" opacity="0.7"/>
    <rect x="30" y="22" width="700" height="55" rx="16" ry="16" fill="url(#topEdgeLight)"/>
    <rect x="28" y="300" width="704" height="160" rx="0" ry="0" fill="url(#bottomEdgeShadow)" clipPath="inset(0 0 0 0 round 0 0 18px 18px)"/>

    {/* Mold seam line */}
    <line x1="50" y1="244" x2="710" y2="244" stroke="url(#moldLine)" strokeWidth="1.2"/>
    <line x1="50" y1="243" x2="710" y2="243" stroke="#ddc848" strokeWidth="0.3" opacity="0.15"/>
    <line x1="50" y1="245" x2="710" y2="245" stroke="#8a7018" strokeWidth="0.3" opacity="0.2"/>

    {/* Label */}
    <rect x="108" y="52" width="544" height="200" rx="6" ry="6" fill="url(#labelPaper)" filter="url(#labelInset)"/>
    <rect x="108" y="52" width="544" height="200" rx="6" ry="6" fill="url(#labelPaper)" filter="url(#paperGrain)" opacity="0.8"/>
    <rect x="108" y="52" width="544" height="200" rx="6" ry="6" fill="url(#labelEdgeShadow)"/>
    <rect x="108" y="52" width="544" height="200" rx="6" ry="6" fill="none" stroke="#b89830" strokeWidth="1.2"/>
    <rect x="109" y="53" width="542" height="198" rx="5" ry="5" fill="none" stroke="#d8c888" strokeWidth="0.4" opacity="0.5"/>

    {/* Ruled lines */}
    <g opacity="0.28" stroke="#bca070" strokeWidth="0.55">
      <line x1="126" y1="100" x2="634" y2="100"/>
      <line x1="126" y1="118" x2="634" y2="118"/>
      <line x1="126" y1="142" x2="634" y2="142"/>
      <line x1="126" y1="166" x2="634" y2="166"/>
      <line x1="126" y1="190" x2="634" y2="190"/>
      <line x1="126" y1="214" x2="634" y2="214"/>
      <line x1="126" y1="232" x2="634" y2="232"/>
    </g>

    {/* Label text */}
    <text x="380" y="93" textAnchor="middle" fontFamily="'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif" fontSize="27" fontWeight="bold" fill="#2e2206" letterSpacing="0.3" opacity="0.12" transform="translate(0.5,0.8)">SoundGuess Mix Vol. 1</text>
    <text x="380" y="93" textAnchor="middle" fontFamily="'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif" fontSize="27" fontWeight="bold" fill="#2e2206" letterSpacing="0.3">SoundGuess Mix Vol. 1</text>
    <text x="380" y="136" textAnchor="middle" fontFamily="'Palatino Linotype', Georgia, serif" fontSize="15" fill="#5e4e20" letterSpacing="1.8">{"60 min  \u2500\u2500  HIGH QUALITY"}</text>
    <text x="380" y="188" textAnchor="middle" fontFamily="'Courier New', Courier, monospace" fontSize="13.5" fill="#7a6838" letterSpacing="5.5" fontWeight="bold">GUESS THE SONG</text>

    {/* Tape window */}
    <rect x="100" y="272" width="560" height="144" rx="14" ry="14" fill="url(#windowBezel)"/>
    <rect x="101" y="273" width="558" height="4" rx="2" fill="#7a6a20" opacity="0.2"/>
    <rect x="106" y="277" width="548" height="134" rx="11" ry="11" fill="url(#windowGlass)"/>
    <rect x="106" y="277" width="548" height="134" rx="11" ry="11" fill="url(#windowGlass)" filter="url(#innerShadowWin)"/>
    <rect x="106" y="277" width="548" height="134" rx="11" ry="11" fill="url(#windowReflect)"/>
    <rect x="110" y="281" width="540" height="126" rx="9" ry="9" fill="none" stroke="#2a2a2a" strokeWidth="0.6"/>

    {/* Left reel */}
    <g transform="translate(272, 344)">
      <circle r="58" fill="#080808"/>
      <circle r="52" fill="url(#housingDepth)" stroke="#1e1e1e" strokeWidth="0.5"/>
      <circle r="46" fill="#1a1a1a" stroke="#222" strokeWidth="0.4"/>
      <circle r="42" fill="#151515"/>
      <circle r="36" fill="url(#reelDisc)" stroke="#8a7218" strokeWidth="2.5"/>
      <circle r="36" fill="url(#reelDiscEdge)"/>
      <circle r="35" fill="url(#reelHighlight)"/>
      <circle r="33" fill="none" stroke="#aa9028" strokeWidth="0.4" opacity="0.3"/>
      <circle r="30" fill="none" stroke="#806818" strokeWidth="0.3" opacity="0.2"/>
      <g fill="#c4a42e" fillOpacity="0.4" stroke="#7a6418" strokeWidth="0.7">
        <rect x="-4.5" y="-34" width="9" height="11" rx="1.5"/>
        <rect x="-4.5" y="23" width="9" height="11" rx="1.5"/>
        <rect x="-34" y="-4.5" width="11" height="9" rx="1.5"/>
        <rect x="23" y="-4.5" width="11" height="9" rx="1.5"/>
      </g>
      <circle r="22" fill="url(#reelHubG)" stroke="#4a3e14" strokeWidth="2"/>
      <circle r="21" fill="url(#reelHighlight)" opacity="0.5"/>
      <circle r="15" fill="#1e1a0c" stroke="#3a3010" strokeWidth="1"/>
      <circle r="10" fill="#14120a" stroke="#2a2408" strokeWidth="0.6"/>
      <circle r="5" fill="#0a0a06" stroke="#1e1a0a" strokeWidth="0.8"/>
      <rect x="-1.3" y="-19" width="2.6" height="38" rx="1" fill="#4a3c12" opacity="0.6"/>
      <rect x="-19" y="-1.3" width="38" height="2.6" rx="1" fill="#4a3c12" opacity="0.6"/>
    </g>

    {/* Right reel */}
    <g transform="translate(488, 344)">
      <circle r="58" fill="#080808"/>
      <circle r="52" fill="url(#housingDepth)" stroke="#1e1e1e" strokeWidth="0.5"/>
      <circle r="46" fill="#1a1a1a" stroke="#222" strokeWidth="0.4"/>
      <circle r="42" fill="#151515"/>
      <circle r="36" fill="url(#reelDisc)" stroke="#8a7218" strokeWidth="2.5"/>
      <circle r="36" fill="url(#reelDiscEdge)"/>
      <circle r="35" fill="url(#reelHighlight)"/>
      <circle r="33" fill="none" stroke="#aa9028" strokeWidth="0.4" opacity="0.3"/>
      <circle r="30" fill="none" stroke="#806818" strokeWidth="0.3" opacity="0.2"/>
      <g fill="#c4a42e" fillOpacity="0.4" stroke="#7a6418" strokeWidth="0.7">
        <rect x="-4.5" y="-34" width="9" height="11" rx="1.5"/>
        <rect x="-4.5" y="23" width="9" height="11" rx="1.5"/>
        <rect x="-34" y="-4.5" width="11" height="9" rx="1.5"/>
        <rect x="23" y="-4.5" width="11" height="9" rx="1.5"/>
      </g>
      <circle r="22" fill="url(#reelHubG)" stroke="#4a3e14" strokeWidth="2"/>
      <circle r="21" fill="url(#reelHighlight)" opacity="0.5"/>
      <circle r="15" fill="#1e1a0c" stroke="#3a3010" strokeWidth="1"/>
      <circle r="10" fill="#14120a" stroke="#2a2408" strokeWidth="0.6"/>
      <circle r="5" fill="#0a0a06" stroke="#1e1a0a" strokeWidth="0.8"/>
      <rect x="-1.3" y="-19" width="2.6" height="38" rx="1" fill="#4a3c12" opacity="0.6"/>
      <rect x="-19" y="-1.3" width="38" height="2.6" rx="1" fill="#4a3c12" opacity="0.6"/>
    </g>

    {/* Tape path */}
    <path d="M 308 344 C 345 392, 415 392, 452 344" fill="none" stroke="#4e4e4e" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M 308 344 C 345 388, 415 388, 452 344" fill="none" stroke="#3a3a3a" strokeWidth="0.8"/>
    <path d="M 310 343 C 347 388, 413 388, 450 343" fill="none" stroke="#666" strokeWidth="0.4" opacity="0.3"/>

    {/* Guide posts */}
    <circle cx="140" cy="382" r="7" fill="#1e1e1e" stroke="#3a3a3a" strokeWidth="1.4"/>
    <circle cx="140" cy="382" r="3.5" fill="#333" stroke="#4a4a4a" strokeWidth="0.5"/>
    <circle cx="140" cy="382" r="1.2" fill="#555"/>
    <circle cx="620" cy="382" r="7" fill="#1e1e1e" stroke="#3a3a3a" strokeWidth="1.4"/>
    <circle cx="620" cy="382" r="3.5" fill="#333" stroke="#4a4a4a" strokeWidth="0.5"/>
    <circle cx="620" cy="382" r="1.2" fill="#555"/>

    {/* Tape to guides */}
    <path d="M 140 382 Q 188 362, 238 348" fill="none" stroke="#3e3e3e" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M 620 382 Q 572 362, 522 348" fill="none" stroke="#3e3e3e" strokeWidth="1.4" strokeLinecap="round"/>

    {/* Screws */}
    <g>
      <circle cx="66" cy="56" r="10" fill="url(#screwMetal)" stroke="#5a4a10" strokeWidth="1.4"/>
      <circle cx="66" cy="56" r="9.5" fill="url(#reelHighlight)" opacity="0.4"/>
      <circle cx="66" cy="56" r="5.5" fill="url(#screwSlot)"/>
      <line x1="62.5" y1="52.5" x2="69.5" y2="59.5" stroke="#1e1808" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="69.5" y1="52.5" x2="62.5" y2="59.5" stroke="#1e1808" strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="694" cy="56" r="10" fill="url(#screwMetal)" stroke="#5a4a10" strokeWidth="1.4"/>
      <circle cx="694" cy="56" r="9.5" fill="url(#reelHighlight)" opacity="0.4"/>
      <circle cx="694" cy="56" r="5.5" fill="url(#screwSlot)"/>
      <line x1="690.5" y1="52.5" x2="697.5" y2="59.5" stroke="#1e1808" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="697.5" y1="52.5" x2="690.5" y2="59.5" stroke="#1e1808" strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="66" cy="424" r="10" fill="url(#screwMetal)" stroke="#5a4a10" strokeWidth="1.4"/>
      <circle cx="66" cy="424" r="9.5" fill="url(#reelHighlight)" opacity="0.4"/>
      <circle cx="66" cy="424" r="5.5" fill="url(#screwSlot)"/>
      <line x1="62.5" y1="420.5" x2="69.5" y2="427.5" stroke="#1e1808" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="69.5" y1="420.5" x2="62.5" y2="427.5" stroke="#1e1808" strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="694" cy="424" r="10" fill="url(#screwMetal)" stroke="#5a4a10" strokeWidth="1.4"/>
      <circle cx="694" cy="424" r="9.5" fill="url(#reelHighlight)" opacity="0.4"/>
      <circle cx="694" cy="424" r="5.5" fill="url(#screwSlot)"/>
      <line x1="690.5" y1="420.5" x2="697.5" y2="427.5" stroke="#1e1808" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="697.5" y1="420.5" x2="690.5" y2="427.5" stroke="#1e1808" strokeWidth="1.6" strokeLinecap="round"/>
    </g>

    {/* C-60 badge */}
    <rect x="335" y="432" width="90" height="24" rx="4" ry="4" fill="#7a6416" stroke="#5a4c0e" strokeWidth="1.3"/>
    <rect x="336" y="433" width="88" height="8" rx="3" fill="#8a7420" opacity="0.3"/>
    <rect x="336" y="448" width="88" height="6" rx="3" fill="#4a3c0a" opacity="0.2"/>
    <text x="380" y="449" textAnchor="middle" fontFamily="'Courier New', Courier, monospace" fontSize="13.5" fontWeight="bold" fill="#d8c040" letterSpacing="3">C-60</text>

    {/* Bottom head access slots */}
    <rect x="192" y="452" width="46" height="7" rx="3.5" fill="#9a8420" stroke="#7a6c16" strokeWidth="0.7"/>
    <rect x="193" y="452.5" width="44" height="3" rx="2" fill="#aa9228" opacity="0.2"/>
    <rect x="357" y="452" width="46" height="7" rx="3.5" fill="#9a8420" stroke="#7a6c16" strokeWidth="0.7"/>
    <rect x="358" y="452.5" width="44" height="3" rx="2" fill="#aa9228" opacity="0.2"/>
    <rect x="522" y="452" width="46" height="7" rx="3.5" fill="#9a8420" stroke="#7a6c16" strokeWidth="0.7"/>
    <rect x="523" y="452.5" width="44" height="3" rx="2" fill="#aa9228" opacity="0.2"/>

    {/* Surface reflection */}
    <ellipse cx="340" cy="120" rx="280" ry="100" fill="#fff" opacity="0.025"/>
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Hero word column (word + subtitle)                                */
/* ------------------------------------------------------------------ */
const HeroWord: React.FC<{ word: string; subtitle: string }> = ({
  word,
  subtitle,
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Typography
      variant="h1"
      sx={{
        fontSize: { xs: '14vw', sm: '13vw', md: '12vw' },
        lineHeight: 0.85,
        color: 'primary.main',
        letterSpacing: '-0.02em',
        textTransform: 'uppercase',
        fontFamily: '"Anton", "Impact", sans-serif',
        fontWeight: 400,
      }}
    >
      {word}
    </Typography>
    <Typography
      sx={{
        color: 'text.primary',
        fontSize: { xs: '0.8rem', md: '1rem' },
        fontWeight: 600,
        mt: 1,
        letterSpacing: '0.25em',
        textTransform: 'lowercase',
        fontFamily: '"Arial", sans-serif',
      }}
    >
      {subtitle}
    </Typography>
  </Box>
);

/* ------------------------------------------------------------------ */
/*  "How It Works" step card                                          */
/* ------------------------------------------------------------------ */
const StepCard: React.FC<{
  icon: React.ReactNode;
  step: string;
  title: string;
  description: string;
}> = ({ icon, step, title, description }) => (
  <Card
    elevation={2}
    sx={{
      height: '100%',
      textAlign: 'center',
      bgcolor: 'background.paper',
      borderRadius: 3,
    }}
  >
    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, py: 4, px: 3 }}>
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1,
        }}
      >
        {icon}
      </Box>
      <Chip label={step} size="small" variant="outlined" sx={{ borderColor: 'primary.main', color: 'primary.main' }} />
      <Typography variant="h6" fontWeight={700}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
  </Card>
);

/* ================================================================== */
/*  Home page                                                         */
/* ================================================================== */
const Home: React.FC = () => {
  const { static: { user } } = useAuth();
  const { onlineUsers } = useSocketContext();
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
      {/* ============================================================ */}
      {/*  HERO SECTION  - fills viewport                              */}
      {/* ============================================================ */}
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, md: 4 },
          pt: { xs: 2, md: 4 },
          pb: 4,
        }}
      >
        {/* Giant hero words */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-end',
            width: '100%',
            gap: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, md: 2 },
          }}
        >
          <HeroWord word="Guess" subtitle="find" />
          <HeroWord word="The" subtitle="your" />
          <HeroWord word="Song" subtitle="sound" />
        </Box>

        {/* Cassette tape image */}
        <Box>
          <CassetteSvg width={380} />
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 3, pb: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => (user ? setJoinOpen(true) : navigate('/login'))}
            sx={{
              px: { xs: 4, md: 7 },
              py: 1.8,
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              fontWeight: 700,
              bgcolor: '#D4A017',
              color: '#1a1a1a',
              '&:hover': { bgcolor: '#b8860b' },
              minWidth: 180,
            }}
          >
            Join a game
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={() => (user ? setCreateOpen(true) : navigate('/login'))}
            sx={{
              px: { xs: 4, md: 7 },
              py: 1.8,
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              fontWeight: 700,
              bgcolor: '#D4A017',
              color: '#1a1a1a',
              '&:hover': { bgcolor: '#b8860b' },
              minWidth: 180,
            }}
          >
            Create a game
          </Button>
        </Box>
      </Box>

      {/* ============================================================ */}
      {/*  HOW IT WORKS SECTION                                        */}
      {/* ============================================================ */}
      <Box sx={{ px: { xs: 2, md: 6 }, py: { xs: 4, md: 6 } }}>
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          sx={{ mb: { xs: 4, md: 6 } }}
        >
          How It Works
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StepCard
              icon={<Group sx={{ fontSize: 32, color: '#1a1a1a' }} />}
              step="Step 1"
              title="Join or Create"
              description="Create a room or join with a code"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StepCard
              icon={<MusicNote sx={{ fontSize: 32, color: '#1a1a1a' }} />}
              step="Step 2"
              title="Listen"
              description="A short audio clip plays for everyone"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StepCard
              icon={<EmojiEvents sx={{ fontSize: 32, color: '#1a1a1a' }} />}
              step="Step 3"
              title="Guess & Win"
              description="Type your guess -- speed earns more points"
            />
          </Grid>
        </Grid>
      </Box>

      {/* ============================================================ */}
      {/*  ONLINE USERS                                                */}
      {/* ============================================================ */}
      {onlineUsers.length > 0 && (
        <Box sx={{ px: { xs: 2, md: 6 }, pb: { xs: 4, md: 6 } }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Group sx={{ color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={700}>
                Online Now
              </Typography>
              <Chip
                label={onlineUsers.length}
                size="small"
                color="success"
                sx={{ ml: 1 }}
              />
            </Box>
            <List dense disablePadding>
              {onlineUsers.map((u) => (
                <ListItem key={u.userId} disablePadding sx={{ py: 0.5 }}>
                  <ListItemAvatar sx={{ minWidth: 40 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
                      {u.username[0]?.toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={u.username}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                  />
                  <Circle sx={{ fontSize: 10, color: 'success.main' }} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      )}

      {/* ============================================================ */}
      {/*  CREATE ROOM DIALOG                                          */}
      {/* ============================================================ */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Create Room
          <IconButton onClick={() => setCreateOpen(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Rounds: {rounds}</Typography>
            <Slider value={rounds} onChange={(_, v) => setRounds(v as number)} min={3} max={10} step={1} />
            <Typography gutterBottom sx={{ mt: 2 }}>Clip Duration: {clipDuration}s</Typography>
            <Slider value={clipDuration} onChange={(_, v) => setClipDuration(v as number)} min={5} max={30} step={5} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreate} variant="contained" fullWidth>Create Game</Button>
        </DialogActions>
      </Dialog>

      {/* ============================================================ */}
      {/*  JOIN ROOM DIALOG                                            */}
      {/* ============================================================ */}
      <Dialog open={joinOpen} onClose={() => setJoinOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Join Room
          <IconButton onClick={() => setJoinOpen(false)}><Close /></IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Room Code"
            placeholder="Enter 6-digit code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            inputProps={{ maxLength: 6 }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleJoin} variant="contained" fullWidth disabled={joinCode.trim().length !== 6}>
            Join Game
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
