# Song Guessing Game

A real-time multiplayer song guessing game. Players join rooms, listen to song previews from Deezer, and compete to guess the correct title.

![Home page](../home-above-fold.png)

## Tech Stack

- **Client** — React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Socket.io client
- **Server** — Express 5, TypeScript, Socket.io, JWT auth
- **Database** — PostgreSQL 16
- **Infrastructure** — Docker Compose

## Getting Started

### Prerequisites

- Docker & Docker Compose

### Run

```bash
make build   # build images
make up      # start all services (db, server, client)
make seed    # populate songs from Deezer API
```

The app will be available at:

| Service  | URL                    |
|----------|------------------------|
| Client   | http://localhost:5173  |
| Server   | http://localhost:3000  |
| Postgres | localhost:5433         |

### Useful Commands

```bash
make logs          # tail all service logs
make logs-server   # tail server logs only
make rebuild       # rebuild and restart
make down          # stop services
make clean         # stop services and delete volumes
make ps            # show running containers
```

## Project Structure

```
├── client/            # React frontend
├── server/
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── db/            # Migrations & seed
│   │   ├── middleware/     # Auth guard, error handling
│   │   ├── routes/        # Express routes
│   │   ├── services/      # Business logic
│   │   ├── socket/        # Game engine, room manager, socket handler
│   │   └── utils/
│   └── Dockerfile
├── docker-compose.yml
└── Makefile
```

## How It Works

1. Players register or join as a guest
2. A host creates a room and shares the room code
3. Players join the room and the host starts the game
4. Each round plays a song preview — players type their guess
5. Points are awarded for correct guesses; faster answers score higher
6. After all rounds, a leaderboard shows the final standings
