# Mini Compliance Tracker

A simple web application to track compliance tasks (filings, taxes, audits, etc.) for multiple clients.

## Live Demo

> **Deployed URL**: https://mini-compliance-tracker-api.onrender.com

---

## Features

### Core
- **Client List** — View all clients with search and summary stats (total/pending/overdue tasks)
- **Task Management** — View, add, and update compliance tasks per client
- **Status Updates** — Change task status (Pending / In Progress / Completed) inline
- **Filters** — Filter tasks by status and category
- **Sorting** — Sort tasks by due date, priority, status, or creation date
- **Overdue Highlighting** — Overdue pending tasks are clearly highlighted in red

### Bonus
- Client search
- Summary statistics (total, pending, in progress, completed, overdue)
- Seed data with realistic compliance tasks
- Docker setup
- Responsive design (works on mobile)

---

## Tech Stack

| Layer     | Technology                |
|-----------|--------------------------|
| Frontend  | React 19 + Vite          |
| Backend   | Express.js               |
| Database  | SQLite (better-sqlite3)   |
| Styling   | Vanilla CSS (no framework)|

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd mini-compliance-tracker

# Install dependencies
npm install
cd client && npm install && cd ..

# Seed the database
npm run seed

# Start development (backend + frontend concurrently)
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

### Production Build

```bash
npm run build
npm start
# App serves at http://localhost:3001
```

### Docker

```bash
docker build -t compliance-tracker .
docker run -p 3001:3001 compliance-tracker
```

---

## API Endpoints

| Method | Endpoint                        | Description             |
|--------|---------------------------------|-------------------------|
| GET    | `/api/clients`                  | List all clients        |
| GET    | `/api/clients/:id`              | Get a single client     |
| GET    | `/api/clients/:clientId/tasks`  | Get tasks for a client  |
| POST   | `/api/clients/:clientId/tasks`  | Create a new task       |
| PATCH  | `/api/tasks/:id/status`         | Update task status      |
| GET    | `/api/tasks/categories`         | List valid categories   |
| GET    | `/api/tasks/statuses`           | List valid statuses     |
| GET    | `/api/health`                   | Health check            |

### Query Parameters (GET tasks)

- `status` — Filter by status (Pending, In Progress, Completed)
- `category` — Filter by category
- `sort_by` — Sort column (due_date, priority, status, created_at)
- `sort_order` — Sort direction (asc, desc)

### Example: Create a task

```bash
curl -X POST http://localhost:3001/api/clients/1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Monthly GST Filing",
    "description": "File GSTR-3B for April",
    "category": "GST Filing",
    "due_date": "2026-04-15",
    "priority": "High"
  }'
```

---

## Project Structure

```
mini-compliance-tracker/
├── server/
│   ├── index.js          # Express server entry point
│   ├── database.js       # SQLite setup and schema
│   ├── seed.js           # Seed data script
│   └── routes/
│       ├── clients.js    # Client API routes
│       └── tasks.js      # Task API routes
├── client/
│   ├── src/
│   │   ├── App.jsx       # Main app component
│   │   ├── App.css       # All styles
│   │   ├── api.js        # API client functions
│   │   └── components/
│   │       ├── ClientList.jsx
│   │       ├── TaskList.jsx
│   │       ├── AddTaskForm.jsx
│   │       ├── TaskFilters.jsx
│   │       └── SummaryStats.jsx
│   └── vite.config.js    # Vite config with API proxy
├── Dockerfile
├── package.json
└── README.md
```

---

## Tradeoffs & Assumptions

### Tradeoffs
- **SQLite over PostgreSQL**: Chose SQLite for zero-config setup and portability. Fine for a small app, but would need PostgreSQL for multi-instance production deployments.
- **No authentication**: Skipped auth to focus on core functionality. In production, would add user login and role-based access.
- **Inline status dropdown vs. modal**: Opted for inline status updates for faster workflow—fewer clicks to change task status.
- **Vanilla CSS over Tailwind/CSS-in-JS**: Keeps the dependency tree small and the styles easy to understand in a single file.
- **No client CRUD**: Clients are pre-seeded. Adding/editing/deleting clients was deprioritized in favor of solid task management.

### Assumptions
- A single user uses the app (no multi-tenancy or concurrent editing).
- Categories are fixed (GST Filing, Tax Return, Audit, etc.)—matching common Indian compliance categories.
- "Overdue" means any non-completed task whose due date is before today.
- The app runs as a single server instance; SQLite is fine for this scale.
