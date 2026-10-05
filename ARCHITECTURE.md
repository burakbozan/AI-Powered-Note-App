# Architecture Overview

The application is a React/Vite client backed by a versioned Express API. PostgreSQL is the source of truth for accounts and notes. OpenAI enrichment is optional and runs only in the backend.

## Components

### Frontend

The Vite client provides `/login`, `/register`, and a protected `/notes` dashboard. React Router handles navigation; the authentication context stores the returned JWT and user in browser local storage. The API service adds the bearer token to requests and clears the session on an unauthorized response.

The dashboard loads the signed-in user's notes, then filters that loaded collection in the browser by text, AI insight status, and tag. The editor stores note content as Markdown, offers edit and rendered-preview modes, and explicitly saves changes through the API.

### API

Express exposes `/api/v1/auth` and `/api/v1/notes`. Helmet, JSON parsing (1 MB limit), configured CORS, authentication middleware, and a shared error handler are applied at the application level. `GET /health` provides a basic process health response.

Registration hashes passwords with bcrypt before persistence. Login verifies the hash and returns a JWT. Authenticated note handlers constrain reads, updates, deletes, and AI enrichment to the token's user ID.

### Persistence

Sequelize connects to PostgreSQL using `DATABASE_URL`.

| Model | Fields | Relationship |
| --- | --- | --- |
| `User` | `id`, `email`, `passwordHash` | Has many notes |
| `Note` | `id`, `title`, `content`, `summary`, `tags`, `userId` | Belongs to one user; deleted with that user |

The server calls `sequelize.sync()` at startup to create missing tables for development. Production schema changes should use versioned migrations rather than automatic synchronization.

### AI Enrichment

`POST /api/v1/notes/:id/summarize` loads a note owned by the authenticated user, calls OpenAI Chat Completions, validates the returned summary and tags, and saves both on the note. The feature requires the backend `OPENAI_API_KEY`; without it the API responds with `503`. The current service does not create or store embeddings.

## Request Flow

1. The client sends credentials to `/api/v1/auth/register` or `/api/v1/auth/login`.
2. The API returns a signed JWT and public user fields; the client stores these in local storage.
3. The client sends the JWT as `Authorization: Bearer <token>` for note operations.
4. Authentication middleware verifies the JWT, and controllers scope note queries to the authenticated user.
5. For summarization, the AI service enriches the owned note and persists the result through Sequelize.

## Current Boundaries

- Search is client-side over the notes returned by `GET /api/v1/notes`; semantic/vector search is not implemented.
- AI is limited to summaries and tags. OpenAI credentials remain server-side.
- Collaboration, offline synchronization, and mobile clients are future work.
- The client stores the JWT in local storage; production deployments should use HTTPS and consider a hardened cookie-based session strategy if the threat model requires it.

## Extension Points

- Add embeddings and a vector-capable search path behind a dedicated search service.
- Add collaborative editing with authenticated WebSocket channels.
- Add offline storage and conflict-aware synchronization.
- Add migrations and deployment automation for production environments.
