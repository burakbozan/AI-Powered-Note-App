# AI-Powered Note App

A note-taking app with Markdown editing, account-based note storage, client-side search, and optional AI-generated summaries and tags.

## Features

- Register and sign in with JWT authentication.
- Create, edit, list, and delete notes stored in PostgreSQL.
- Write Markdown with a formatting toolbar and switch to rendered preview.
- Search loaded notes by title, content, summary, or tag; filter by AI insight status and tag.
- Generate and save a note summary and up to eight tags using the OpenAI API.

Semantic search, collaboration, and offline sync are planned; they are not implemented in the current version.

## Stack

- Frontend: React 18, Vite, React Router, Tailwind CSS, and `@uiw/react-md-editor`.
- Backend: Node.js 20+, Express, and Sequelize 6.
- Database: PostgreSQL.
- Authentication: bcrypt password hashing and signed JWT bearer tokens.
- AI: OpenAI Chat Completions API; the API key stays on the backend.

## Project Structure

```text
frontend/
  src/
    components/   Auth form, sidebar, note list, Markdown editor
    hooks/        Authentication context and notes state
    pages/        Notes dashboard
    services/     Auth and note API clients
backend/
  src/
    config/       Sequelize/PostgreSQL connection
    controllers/  Auth and note request handlers
    middleware/   JWT authentication and error handling
    models/       Sequelize User and Note models
    routes/       Versioned API routes
    services/     OpenAI summarization and tagging
```

## Local Development

Prerequisites: Node.js 20 or newer and a running PostgreSQL server. Create a database named `ai_notes`.

1. Copy `backend/.env.example` to `backend/.env`.
2. Set `DATABASE_URL` to your PostgreSQL connection string and replace `JWT_SECRET` with a long random value. Set `CLIENT_ORIGIN=http://localhost:5173` to match Vite's default origin. Set `OPENAI_API_KEY` to enable summaries and tagging; other app features work without it.
3. In `backend/`, run `npm install`, then `npm run dev`. The API listens on `http://localhost:4000`.
4. Copy `frontend/.env.example` to `frontend/.env`. In `frontend/`, run `npm install`, then `npm run dev`. Vite serves the app at `http://localhost:5173`.

The backend exposes `GET /health`. During development it creates missing Sequelize tables on startup with `sequelize.sync()`. Use migrations and review schema changes explicitly in production; do not rely on startup sync as a migration strategy.

## API

All note endpoints require `Authorization: Bearer <token>`. Registration requires a valid email and a password of at least eight characters. Notes are scoped to the authenticated user.

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/v1/auth/register` | Create an account; body: `{ "email", "password" }` |
| `POST` | `/api/v1/auth/login` | Sign in; returns `{ "user", "token" }` |
| `POST` | `/api/v1/notes` | Create a note; body: `{ "title", "content?" }` |
| `GET` | `/api/v1/notes` | List the authenticated user's notes |
| `PUT` | `/api/v1/notes/:id` | Update `title` and/or `content` |
| `DELETE` | `/api/v1/notes/:id` | Delete a note; returns `204` on success |
| `POST` | `/api/v1/notes/:id/summarize` | Generate and persist `summary` and `tags` |

The summarize endpoint returns `503` when `OPENAI_API_KEY` is not configured. The AI service currently provides summaries and tags only; it does not generate embeddings.

## Checks

- Backend syntax check: run `npm run check` in `backend/`.
- Frontend production build: run `npm run build` in `frontend/`.

## Roadmap

- Semantic search with stored embeddings.
- Collaborative editing.
- Offline mode and sync.
- Mobile client and CI/CD pipeline.
