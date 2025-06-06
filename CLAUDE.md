# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Football tactical board application with a JavaScript frontend and Python FastAPI backend. Users can create and manage team formations on an interactive football pitch canvas.

## Architecture

- **Backend**: FastAPI server serving both API endpoints and static frontend files
- **Frontend**: Vanilla JavaScript with HTML5 Canvas for the tactical board
- **API**: RESTful endpoints for formation management

## Development Commands

**Using uv (recommended):**
```bash
uv sync
uv run python main.py
```

**Using pip:**
```bash
pip install -e .
python main.py
```

**Using Docker (production):**
```bash
docker-compose up --build
```

**Access the application:**
- Development: http://localhost:8000 (direct backend)
- Production: http://localhost (nginx frontend with API proxy)
- API docs: http://localhost:8000/docs

## Project Structure

- `main.py` - FastAPI backend with API endpoints and static file serving
- `models.py` - SQLAlchemy database models (Formation, Player, Ball)
- `database.py` - Database connection and session management
- `frontend/` - JavaScript frontend application
  - `index.html` - Main application page
  - `app.js` - Tactical board logic and API integration
  - `styles.css` - Application styling
- `pyproject.toml` - Project dependencies and configuration
- `Dockerfile.backend` - Backend container configuration (uses uv)
- `Dockerfile.frontend` - Frontend container configuration (nginx)
- `docker-compose.yml` - Multi-container orchestration
- `nginx.conf` - Nginx configuration for frontend proxy

## Database

The application uses PostgreSQL for persistent formation storage:
- **Database**: PostgreSQL 15 Alpine
- **ORM**: SQLAlchemy 2.0+ with async support
- **Tables**: formations, players, balls
- **Features**: Formation save/load, player positioning, ball tracking

**Database Schema:**
- `formations`: id, name, created_at, description
- `players`: id, formation_id, player_id, name, position, x, y, team
- `balls`: id, formation_id, ball_id, x, y

## Docker Setup

The application uses a multi-container architecture:
- **Database**: PostgreSQL with persistent volume storage
- **Backend**: Python FastAPI with uv package manager and SQLAlchemy
- **Frontend**: Nginx serving static files with API proxy
- **Network**: Bridge network for container communication

## Key Features

- Interactive drag-and-drop player positioning (22 players + ball)
- Persistent formation storage in PostgreSQL database
- Formation save/load functionality with dropdown selection
- Responsive football pitch visualization with proper markings
- Team differentiation (home/away colors)
- Formation naming and timestamp tracking