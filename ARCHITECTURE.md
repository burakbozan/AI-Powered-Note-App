# Architecture Overview

## 🎯 Vision
A productivity-focused note-taking application enhanced with AI summarization, smart tagging, and semantic search.

## 🧩 Core Components
- **Auth Service**: User registration, login, JWT authentication.
- **Note Service**: CRUD operations for notes, markdown rendering.
- **AI Integration Service**: Connects to OpenAI API for summarization, tagging, and embeddings.
- **Search Service**: Semantic search using embeddings stored in PostgreSQL or vector DB (e.g., Pinecone).
- **Frontend**: React client with rich text editor and markdown preview.

## 📐 Design Principles
- Modular services for notes, AI, and search
- RESTful APIs with clear versioning (`/api/v1/...`)
- Secure storage with PostgreSQL
- Extensible AI integration layer for future models
- Offline-first design (future roadmap)

## 🔮 Extension Ideas
- Collaborative editing with WebSockets
- Mobile app version (React Native)
- Offline mode with local storage sync
- Integration with cloud storage (OneDrive, Google Drive)
