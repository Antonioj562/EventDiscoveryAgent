# Event Discovery Agent Frontend

This frontend is the current UI for the Event Discovery Agent project. It is a small React + Vite app focused on one clear loop: describe the kind of live music experience you want, get recommended events back from the backend, and feed signals back into the system so the agent can learn over time.

The app already feels like a product instead of a wireframe. There is a lightweight auth flow, a recommendation workspace, visible agent activity, and a history view for reviewing or removing saved feedback.

## What is in the app right now

### Auth flow

- Users can register and sign in from dedicated screens.
- Auth is intentionally lightweight for now and stored in `localStorage`.
- Each user gets a stable `sessionId` derived from their email so the backend can tie recommendations and feedback history together.

### Recommendation workspace

- The main screen lets users describe the kind of concert night they want in plain language.
- There are starter prompts for quick testing and demos.
- The frontend sends the prompt to the backend recommendation endpoint and renders both:
  - a short explanation of why the recommendations fit
  - a list of suggested events

### Visible agent behavior

- The UI includes an "Agent Activity" panel to make the recommendation process feel more transparent.
- It shows the intended steps of the workflow: reading taste signals, scanning the catalog, ranking matches, and generating a summary.
- This is especially useful in demos because it helps people understand that the system is doing more than returning static search results.

### Feedback history

- Users can mark an event as `interested`, `not interested`, or `attended`.
- The history page pulls those saved signals back from the backend.
- Users can filter the history by feedback type and remove items if they want to correct what the agent has learned.

### Current visual direction

- The interface is built around a moody live-music look with warm accent colors, glassy panels, and responsive layouts.
- It works on both desktop and smaller screens without collapsing into a generic dashboard.

## Tech stack

- React 18
- TypeScript
- Vite
- React Router

## Project structure

```text
src/
  components/
    AppShell.tsx       # Protected app layout and navigation
    AgentPulse.tsx     # Agent activity panel
  context/
    AuthContext.tsx    # Local auth/session handling
  lib/
    api.ts             # Backend API calls
  pages/
    LoginPage.tsx
    RegisterPage.tsx
    RecommendedPage.tsx
    HistoryPage.tsx
  App.tsx
  main.tsx
  styles.css
```

## Running the frontend

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Backend connection

The frontend expects the backend API to be available at:

```text
http://127.0.0.1:8000
```

You can override that with:

```bash
VITE_API_BASE_URL=http://your-api-host:8000
```

The current frontend uses these endpoints:

- `POST /events/recommend`
- `POST /events/feedback`
- `GET /events/history/:sessionId`
- `DELETE /events/history/:sessionId`

## Notes on the current implementation

- Authentication is frontend-only right now and meant to support product flow, not production security.
- The recommendation and history flows are real API integrations.
- The app is in a good place for demos and iteration, especially around recommendation quality, agent transparency, and feedback-driven personalization.

## Good next steps

- Replace local-only auth with backend-backed authentication.
- Add loading and error states with a bit more granularity around recommendation requests.
- Expand event cards with richer metadata like date, venue, and ticket links.
- Add tests around the auth flow and API-driven pages.

This README is meant to reflect the app as it exists today: a solid frontend slice of the product, with a clear user loop and room to keep sharpening the recommendation experience.
