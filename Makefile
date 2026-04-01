.PHONY: up down build rebuild logs logs-server logs-client logs-db seed ps clean

up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build

rebuild:
	docker compose up -d --build

logs:
	docker compose logs -f

logs-server:
	docker compose logs -f server

logs-client:
	docker compose logs -f client

logs-db:
	docker compose logs -f db

seed:
	docker compose exec server npx tsx src/db/seed.ts

ps:
	docker compose ps

clean:
	docker compose down -v
