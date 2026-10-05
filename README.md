# AI-Powered Note App

A productivity app for creating and managing notes, enhanced with AI summarization and smart tagging.

## 🚀 Features

- Create, edit, delete notes
- AI-powered summarization & tagging
- Semantic search with embeddings
- Markdown support
- User authentication
- Collaborative notes (future)

## Tech Stack

- Frontend: React + TailwindCSS (planned)
- Backend: Node.js + Express
- Database: PostgreSQL with Sequelize
- Authentication: JWT
- AI Integration: OpenAI API

## Project Structure

```text
frontend/
  src/
    components/   Auth, navigation, note list, and editor UI
    hooks/        Authentication and notes state
    pages/        Notes dashboard
    services/     Backend API clients
backend/
  src/
    config/       PostgreSQL connection
    controllers/  Auth and note request handlers
    middleware/   JWT authentication and error handling
    models/       Sequelize User and Note models
    routes/       Versioned API routes
    services/     OpenAI summarization and tagging
```

## Getting Started

1. Install Node.js 20+ and PostgreSQL, then create a database named `ai_notes`.
2. In `backend/`, copy `.env.example` to `.env` and set `DATABASE_URL`, a long random `JWT_SECRET`, and `OPENAI_API_KEY` to enable AI summaries.
3. Run `npm install` in `backend/`, then start the API with `npm run dev`. It listens on `http://localhost:4000`.
4. In another terminal, copy `frontend/.env.example` to `frontend/.env`, run `npm install` in `frontend/`, then start the client with `npm run dev`. Vite serves it at `http://localhost:5173`.

The API syncs its Sequelize models on startup. For production deployments, use migrations rather than relying on automatic schema changes.

## API

All note routes require `Authorization: Bearer <token>`.

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/v1/auth/register` | Create an account (`email`, `password`) |
| `POST` | `/api/v1/auth/login` | Sign in and receive a JWT |
| `POST` | `/api/v1/notes` | Create a note (`title`, optional `content`) |
| `GET` | `/api/v1/notes` | List the signed-in user's notes |
| `PUT` | `/api/v1/notes/:id` | Update a note's `title` and/or `content` |
| `DELETE` | `/api/v1/notes/:id` | Delete a note |
| `POST` | `/api/v1/notes/:id/summarize` | Generate and save summary and tags |

## 📌 Roadmap

- [ ] Collaborative editing
- [ ] Offline mode
- [ ] Mobile app version
- [ ] CI/CD pipeline
