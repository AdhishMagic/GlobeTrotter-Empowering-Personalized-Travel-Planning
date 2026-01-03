# GlobeTrotter — Empowering Personalized Travel Planning 🌍

GlobeTrotter is a full-stack travel planning web application designed to make multi-city trip planning **centralized, visual, and manageable**. Instead of juggling notes, spreadsheets, and chat threads, users can create a trip, add multiple cities, explore activities, and track budgets—all in one place.

This project was built for a hackathon with a focus on **speed + clarity + extensibility**: a clean UI for judges to understand quickly, and a scalable architecture for developers to build on confidently.

---

## 1) Project Overview

### Why GlobeTrotter exists
Travel planning today is fragmented across tools that don’t work well together—especially for **multi-city itineraries** where activities, timing, and costs quickly become hard to track. GlobeTrotter solves this by providing a structured travel workspace where users can:

- Create trips with **multi-city support**
- Explore and add activities per city
- Track spending through a **budget summary**
- Expand into itinerary and calendar views for time-based planning (in progress)

---

## 2) Key Features

### ✅ Implemented
- **Landing Page**: Clear entry point and product introduction
- **Dashboard**: Central hub for viewing and managing trips
- **Create New Trip**: Add trip name, dates, and basic details
- **Add Cities (Multi-city support)**: Build trips across multiple destinations
- **Activity Search**: Find activities and add them to your plan
- **Budget Summary**: Consolidated view of planned costs and categories

### 🛠️ In Progress / Planned
- **Login & Registration** (authentication + protected routes)
- **Itinerary View** (day-by-day planning)
- **Calendar View** (timeline-based visualization)
- **Community / Shared Trips** (shareable trips + collaborative planning)
- **User Profile & Settings** (preferences, currency, theme, account controls)

---

## 3) Application Flow

GlobeTrotter is designed around an intuitive user journey:

1. **Landing Page**
   - Users understand the value proposition and start planning.
2. **Authentication (Planned)**
   - Users sign up / log in to save trips and access personalized features.
3. **Dashboard**
   - Users view existing trips, resume planning, or create a new trip.
4. **Trip Creation**
   - Users create a trip and define the base details (dates, title).
5. **Itinerary (Planned)**
   - Users organize activities by day and city.
6. **Budget**
   - Users monitor total planned spending and category-level breakdowns.
7. **Calendar View (Planned)**
   - Users visualize the trip schedule across a calendar timeline.

---

## 4) Tech Stack

### Frontend
- **React.js**
  - Component-based UI for rapid iteration and clean separation of concerns.
- **React Router**
  - Enables a multi-page app feel with route-based navigation (Dashboard, Trip, etc.).
- **Context API**
  - Lightweight global state management for trip/session UI state without extra dependencies.
- **Tailwind CSS**
  - Fast UI development with consistent styling, responsive utilities, and clean design tokens.

### Backend
- **Node.js + Express.js**
  - Simple, fast API layer for hackathon development while remaining production-friendly.
  - Clear REST endpoints for trips, cities, activities, and budgets (with room to evolve).

### Database
- **PostgreSQL**
  - Reliable relational structure for trip entities (users → trips → cities → activities → budget items).
  - Strong foundation for queries, constraints, and future analytics.

### Version Control
- **GitHub**
  - Collaboration-ready workflow with issues/PRs, project visibility, and clean deployment integration.

---

## 5) Folder Structure

A clean full-stack structure designed for readability and scalable growth:

```text
GlobeTrotter/
├── client/                      # React frontend
│   ├── public/
│   └── src/
│       ├── assets/              # Images, icons
│       ├── components/          # Reusable UI components
│       ├── pages/               # Route-level pages (Landing, Dashboard, Trip, etc.)
│       ├── context/             # Context providers (TripContext, AuthContext, etc.)
│       ├── services/            # API clients (fetch/axios wrappers)
│       ├── hooks/               # Custom hooks
│       ├── styles/              # Global styles (if needed)
│       ├── utils/               # Helpers, formatters
│       ├── App.jsx
│       └── main.jsx
│
├── server/                      # Node/Express backend
│   ├── src/
│   │   ├── config/              # DB config, environment setup
│   │   ├── middleware/          # Auth, error handling, logging
│   │   ├── routes/              # Express routes
│   │   ├── controllers/         # Request handlers
│   │   ├── services/            # Business logic + integrations
│   │   ├── db/                  # SQL schema, migrations (optional)
│   │   ├── utils/               # Shared utilities
│   │   └── index.js             # Server entry
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json                 # Optional: root scripts (concurrently)
```

---

## 6) UI / UX Highlights

- **Responsive design**
  - Layouts are designed to work cleanly across mobile, tablet, and desktop for quick access while traveling.
- **Light/Dark mode**
  - Theme-friendly design approach (implemented or ready to enable based on Tailwind configuration).
- **Component-based UI**
  - Reusable components (cards, forms, modals, navigation) keep the UI consistent and easy to extend.
- **Reusability-focused architecture**
  - Shared UI primitives and centralized API services reduce duplication and keep iteration fast during the hackathon.

---

## 7) Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm** (or yarn/pnpm)
- **PostgreSQL** (v14+ recommended)

### Installation

Clone the repository:
```bash
git clone https://github.com/AdhishMagic/GlobeTrotter-Empowering-Personalized-Travel-Planning.git
cd GlobeTrotter-Empowering-Personalized-Travel-Planning
```

Install dependencies:

Frontend:
```bash
cd client
npm install
```

Backend:
```bash
cd ../server
npm install
```

### Running the application

Start PostgreSQL and ensure your database exists (and credentials match your `.env`).

Run backend (Express API):
```bash
cd server
npm run dev
```

Run frontend (React):
```bash
cd ../client
npm run dev
```

Typical local URLs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

> If your ports differ, update the frontend API base URL in `client/src/services/` (or wherever API configuration lives).

---

## 8) Environment Variables

Create environment files:

### `server/.env`
```bash
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/globetrotter

# CORS
CLIENT_ORIGIN=http://localhost:5173

# Auth (planned)
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
```

### `client/.env`
```bash
VITE_API_BASE_URL=http://localhost:5000
```

> Keep secrets out of source control. Add `.env` files to `.gitignore`.

---

## 9) Scalability & Future Enhancements

GlobeTrotter is built with growth in mind:

- **API expansion**
  - Add richer endpoints for itinerary scheduling, recurring expenses, tagging, and trip templates.
- **Real-time collaboration (future)**
  - Shared trips with live updates using WebSockets (or a hosted real-time layer).
  - Conflict handling for concurrent edits (optimistic updates + server reconciliation).
- **AI recommendations (future scope)**
  - Personalized suggestions for activities, route optimization between cities, and budget-aware recommendations.
  - Smart itinerary generation based on trip duration, interests, and constraints.

```
