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
- `frontend/` - JavaScript frontend application
  - `index.html` - Main application page
  - `app.js` - Tactical board logic and API integration
  - `styles.css` - Application styling
- `pyproject.toml` - Project dependencies and configuration
- `Dockerfile.backend` - Backend container configuration (uses uv)
- `Dockerfile.frontend` - Frontend container configuration (nginx)
- `docker-compose.yml` - Multi-container orchestration
- `nginx.conf` - Nginx configuration for frontend proxy

## Docker Setup

The application uses a multi-container architecture:
- **Backend**: Python FastAPI with uv package manager
- **Frontend**: Nginx serving static files with API proxy
- **Network**: Bridge network for container communication

## Key Features

- Interactive drag-and-drop player positioning
- Formation save/load functionality via API
- Responsive football pitch visualization
- Team differentiation (home/away colors)