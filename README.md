# Webhook Inspector — Frontend

<div align="center">

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Sora&weight=700&size=22&duration=2800&pause=1000&color=6C63FF&center=true&vCenter=true&width=700&lines=Live+Webhook+Feed%2C+No+Refresh+Needed.;Inspect+%C2%B7+Verify+%C2%B7+Replay+%E2%80%94+In+One+Dashboard.;Next.js+16+%C2%B7+TypeScript+%C2%B7+Tailwind+CSS+%C2%B7+WebSocket.;The+client+for+the+Webhook+Inspector+API.)](https://git.io/typing-svg)

</div>

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

## Overview

This is the **frontend client** for [Webhook Inspector](https://github.com/Fuad-Haque/webhook-inspector-backend) — a self-hosted, real-time webhook debugging platform. This repo is the Next.js dashboard: the live event feed, endpoint management UI, event payload inspector, and replay panel that render whatever the backend pushes over WebSocket or returns over REST.

It doesn't receive, verify, or store webhooks itself — it's a typed client that opens a WebSocket connection to the backend's `/ws` endpoint for live events, and calls the REST API for endpoint CRUD, event lookup, and replay.

**Live Dashboard** → [webhook-inspector-frontend.vercel.app](https://webhook-inspector-frontend.vercel.app)  
**Backend Repo / Swagger Docs** → [github.com/Fuad-Haque/webhook-inspector-backend](https://github.com/Fuad-Haque/webhook-inspector-backend) · [webhook-handler-production-99e2.up.railway.app/docs](https://webhook-handler-production-99e2.up.railway.app/docs)

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
| Real-time Event Feed | Subscribes to the backend's WebSocket stream — new events appear instantly, no polling or manual refresh |
| Endpoint Management | Create, view, and delete named receiver endpoints from the dashboard |
| Event Payload Inspector | View full headers and raw body of any stored event, with syntax highlighting |
| Replay Panel | Re-send any stored event to a target URL and see the delivery result inline |
| Connection Resilience | Reconnects automatically if the WebSocket drops, so a flaky connection doesn't require a manual page refresh |
| Typed API Client | All REST requests and WebSocket payloads are typed end-to-end in TypeScript |

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Realtime | Native WebSocket client (`ws.ts`), consuming the backend's FastAPI `/ws` broadcast |
| Deployment | Vercel |

---

## How It Talks to the Backend

This app holds no state of its own beyond what's in memory for the current session — no database, no signature verification, no persistence. Every piece of data it shows comes from the FastAPI backend:

| Backend Endpoint | Used By | Purpose |
|---|---|---|
| `WS /ws` | `ws.ts`, `EventFeed.tsx` | Opens a persistent WebSocket connection; receives a broadcast JSON payload the instant a new event is verified and stored |
| `POST /endpoints` | Endpoint management pages | Creates a new named receiver, optionally with a signing secret |
| `GET /endpoints` | Endpoint management pages | Lists all registered receivers |
| `DELETE /endpoints/{id}` | Endpoint management pages | Deletes a receiver and its associated events |
| `GET /endpoints/{id}/events` | Dashboard feed | Loads event history for a given endpoint |
| `GET /events/{id}` | `EventDetail.tsx` | Fetches full headers and body for a single event |
| `POST /events/{id}/replay` | `ReplayPanel.tsx` | Re-POSTs a stored event to a target URL |
| `GET /events/{id}/replays` | `ReplayPanel.tsx` | Lists prior replay attempts and their delivery status for an event |

The base URLs for both the REST API and the WebSocket connection are read from environment variables — see [Environment Variables](#environment-variables).

---

## Environment Variables

Create `.env.local` (not currently committed to this repo — copy from `.env.example` once one exists, or create it manually):

```env
# Backend API base URL
NEXT_PUBLIC_API_URL=https://webhook-handler-production-99e2.up.railway.app

# WebSocket URL
NEXT_PUBLIC_WS_URL=wss://webhook-handler-production-99e2.up.railway.app/ws
```

For local development against a backend running on its default port:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

> **Note:** unlike the backend repo, this frontend doesn't currently have an `.env.example` file committed. Worth adding one with the placeholder values above so the [Quick Start](#quick-start) `cp` step below actually has something to copy from.

---

## Quick Start

```bash
git clone https://github.com/Fuad-Haque/webhook-inspector-frontend
cd webhook-inspector-frontend
cp .env.example .env.local   # see note above — create .env.example first if it doesn't exist yet
npm install
npm run dev
```

Runs at `http://localhost:3000`. Requires the [backend](https://github.com/Fuad-Haque/webhook-inspector-backend) running (locally or deployed) and reachable at whatever `NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_WS_URL` point to — this dashboard has no events to show without it.

---

## Project Structure

```
webhook-inspector-frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Dashboard — real-time event feed
│   │   ├── endpoints/                # Endpoint management pages
│   │   └── events/
│   │       └── [id]/                 # Event detail and replay UI
│   ├── components/
│   │   ├── EventFeed.tsx             # WebSocket-driven live event list
│   │   ├── EventDetail.tsx           # Payload inspector with syntax highlighting
│   │   └── ReplayPanel.tsx           # Replay form and delivery log
│   └── lib/
│       ├── api.ts                    # Typed API client (REST)
│       └── ws.ts                     # WebSocket connection manager
├── public/                           # Static assets
├── .gitignore
├── AGENTS.md                         # Agent/assistant-specific project instructions
├── CLAUDE.md                         # Claude-specific project instructions
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## Component Breakdown

| File | Role |
|---|---|
| `app/page.tsx` | The dashboard root — hosts the live event feed |
| `app/endpoints/` | Pages for creating, listing, and deleting receiver endpoints |
| `app/events/[id]/` | Dynamic route for a single event's detail view and replay controls |
| `components/EventFeed.tsx` | Subscribes via `ws.ts` and renders incoming events as they arrive, live |
| `components/EventDetail.tsx` | Renders a single event's full headers and raw body with syntax highlighting |
| `components/ReplayPanel.tsx` | Form for entering a target URL, triggering a replay, and showing the delivery log |
| `lib/api.ts` | Typed client wrapping all backend REST calls (endpoints, events, replays) |
| `lib/ws.ts` | Manages the WebSocket connection to `/ws`, including reconnect logic |

---

## Author

Built by [Fuad Haque](https://fuadhaque.com)

[fuadhaque.dev@gmail.com](mailto:fuadhaque.dev@gmail.com) · [Book a Call](https://cal.com/fuad-haque) · [GitHub](https://github.com/Fuad-Haque)
