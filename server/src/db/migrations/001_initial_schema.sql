CREATE TABLE users (
    id UUID PRIMARY KEY NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    is_guest BOOLEAN NOT NULL DEFAULT false,
    total_score INTEGER NOT NULL DEFAULT 0,
    games_played INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE songs (
    id UUID PRIMARY KEY NOT NULL,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    preview_url TEXT NOT NULL,
    year INTEGER,
    difficulty VARCHAR(20) NOT NULL,
    deezer_id BIGINT
);

CREATE TABLE game_sessions (
    id UUID PRIMARY KEY NOT NULL,
    room_code VARCHAR(8) NOT NULL,
    host_id UUID NOT NULL REFERENCES users(id),
    rounds INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE game_results (
    id UUID PRIMARY KEY NOT NULL,
    session_id UUID NOT NULL REFERENCES game_sessions(id),
    user_id UUID NOT NULL REFERENCES users(id),
    score INTEGER NOT NULL DEFAULT 0,
    correct_guesses INTEGER NOT NULL DEFAULT 0,
    rank INTEGER NOT NULL
);