# Semantic Search — Frontend

<div align="center">

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Sora&weight=700&size=22&duration=2800&pause=1000&color=6C63FF&center=true&vCenter=true&width=700&lines=Search+by+Meaning%2C+Not+Just+Words.;Semantic+%C2%B7+Keyword+%C2%B7+Hybrid+RRF+%E2%80%94+Side+by+Side.;Next.js+16+%C2%B7+TypeScript+%C2%B7+Tailwind+CSS+%C2%B7+SSE.;The+client+for+the+Semantic+Search+Platform+API.)](https://git.io/typing-svg)

</div>

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

## Overview

This is the **frontend client** for the [Semantic Search Platform](https://github.com/Fuad-Haque/semantic-search-backend) — a document search engine that runs semantic, keyword, and hybrid (RRF) search in parallel and shows all three side-by-side. This repo is the Next.js app: upload UI, search UI, and the three-column comparison view that renders whatever the backend API returns.

It doesn't run search itself — it's a typed client against the FastAPI backend's `/search/`, `/documents/upload`, `/documents/`, and `/documents/{id}` endpoints, plus an SSE listener for live upload/embedding progress.

**Live Dashboard** → [semantic-search-frontend-j6yp.vercel.app/search](https://semantic-search-frontend-j6yp.vercel.app/search)  
**Backend Repo** → [github.com/Fuad-Haque/semantic-search-backend](https://github.com/Fuad-Haque/semantic-search-backend)

---

## Table of Contents

- [Features](#features)
- [Stack](#stack)
- [How It Talks to the Backend](#how-it-talks-to-the-backend)
- [Environment Variables](#environment-variables)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Component Breakdown](#component-breakdown)
- [Author](#author)

---

## Features

| Feature | Detail |
|---|---|
| Three-Column Comparison | Semantic, keyword, and hybrid results rendered side-by-side for every query — the core UI of the app |
| SSE Upload Progress | Listens to the backend's Server-Sent Events stream during upload and renders live chunk-embedding progress |
| Drag-and-Drop Upload | Drop a `.txt`, `.pdf`, or `.md` file (up to 10MB) directly onto the upload zone |
| Selectable Chunking Strategy | Choose fixed-size, sentence-based, or paragraph-based chunking before upload, passed to the backend as a query param |
| Debounced Search | Search input debounces before firing a query, avoiding a request per keystroke |
| Typed API Client | All backend requests and responses are typed end-to-end in TypeScript |

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Realtime | Server-Sent Events (native `EventSource`, wrapped in a hook) |
| Deployment | Vercel |

---

## How It Talks to the Backend

This app is a pure client — no database, no embedding model, no vector store. It calls the FastAPI backend directly:

| Backend Endpoint | Used By | Purpose |
|---|---|---|
| `GET /search/?q=...` | `search/page.tsx`, `ComparisonView.tsx` | Fetches `semantic_results`, `keyword_results`, `hybrid_results`, and `latency_ms` for a query |
| `POST /documents/upload?strategy=...` | `DropZone.tsx`, `useSSE.ts` | Uploads a file and opens an SSE stream (`start` → `progress` → `complete` events) to track embedding |
| `GET /documents/` | `search/page.tsx` | Lists currently indexed documents |
| `DELETE /documents/{id}` | `search/page.tsx` | Removes a document and its vectors from the backend |

The base URL for all of the above is read from `NEXT_PUBLIC_API_URL` — see [Environment Variables](#environment-variables).

---

## Environment Variables

Create `.env.local` from the provided example:

```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

For local development against a backend running on its default port:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Quick Start

```bash
git clone https://github.com/Fuad-Haque/semantic-search-frontend
cd semantic-search-frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Runs at `http://localhost:3000`. Requires the [backend](https://github.com/Fuad-Haque/semantic-search-backend) running (locally or deployed) and reachable at whatever `NEXT_PUBLIC_API_URL` points to — this app has nothing to search against on its own.

---

## Project Structure

```
semantic-search-frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx                     # Root → redirects to /search
│   │   └── search/
│   │       └── page.tsx                 # Main search + upload page
│   ├── components/
│   │   ├── upload/
│   │   │   └── DropZone.tsx             # Drag-and-drop uploader with SSE progress
│   │   └── search/
│   │       ├── SearchBar.tsx            # Debounced search input
│   │       ├── ResultCard.tsx           # Single result with score bar
│   │       └── ComparisonView.tsx       # Three-column comparison layout
│   ├── hooks/
│   │   └── useSSE.ts                    # SSE upload progress hook
│   └── lib/
│       ├── api.ts                       # Typed API client
│       └── types.ts                     # TypeScript interfaces
├── public/                              # Static assets
├── .env.local                           # Local environment config (see note below)
├── .gitignore
├── AGENTS.md                            # Agent/assistant-specific project instructions
├── CLAUDE.md                            # Claude-specific project instructions
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

> **Note:** the repo currently has `.env.local` and `.next/` committed at the root. Both are typically excluded via `.gitignore` in a Next.js project — `.env.local` because it can hold environment-specific secrets, and `.next/` because it's a regenerated build artifact. Worth double-checking `.gitignore` covers both before your next commit, especially if `.env.local` ever points at anything other than a public API URL.

---

## Component Breakdown

| File | Role |
|---|---|
| `app/page.tsx` | Redirects `/` straight to `/search` — there's no separate landing page |
| `app/search/page.tsx` | The main page: hosts the search bar, upload zone, and comparison view |
| `components/upload/DropZone.tsx` | Handles file drop/selection, kicks off the upload request, and surfaces live progress via `useSSE` |
| `components/search/SearchBar.tsx` | Debounced input that triggers a search once the user pauses typing |
| `components/search/ResultCard.tsx` | Renders a single search result with its relevance score as a bar |
| `components/search/ComparisonView.tsx` | Lays out the three result sets (semantic / keyword / hybrid) side-by-side |
| `hooks/useSSE.ts` | Wraps `EventSource` to consume the backend's `start` / `progress` / `complete` upload events |
| `lib/api.ts` | Typed client wrapping all backend calls (search, upload, list, delete) |
| `lib/types.ts` | Shared TypeScript interfaces mirroring the backend's Pydantic response schemas |

---

## Author

Built by [Fuad Haque](https://fuadhaque.com)

[fuadhaque.dev@gmail.com](mailto:fuadhaque.dev@gmail.com) · [Book a Call](https://cal.com/fuad-haque) · [GitHub](https://github.com/Fuad-Haque)
