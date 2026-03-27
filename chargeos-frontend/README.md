# PBS ChargeOS Dashboard

React frontend for the ChargeOS CSMS platform.

## Local Development

```bash
npm install
npm run dev
```

Runs on `http://localhost:3000` with API calls proxied to `http://localhost:3001` (backend).

## Production Build

```bash
npm run build
```

Outputs to `dist/` — static files served by nginx in Docker.

## Docker

```bash
docker build -t chargeos-dashboard .
```

The Dockerfile is a multi-stage build:
1. Builds the React app with Vite
2. Serves the static output with nginx
3. nginx proxies `/api/*` to the backend container

## Project Structure

```
src/
  services/api.js     - API client (auth, fetch wrapper, all endpoints)
  hooks/useAppData.js  - Polling hook for live data
  theme.js             - Colors, status badge config
  components/
    UI.jsx             - Badge, Spinner, EmptyState, TableHead, StatCard
    Sidebar.jsx        - Navigation sidebar with live status
    TopBar.jsx         - Header bar with user info
    Toast.jsx          - Notification toasts
  pages/
    LoginPage.jsx      - Auth screen
    DashboardPage.jsx  - Stats, revenue chart, port status, active sessions
    ChargersPage.jsx   - Charger list with filter, reset, QR
    SessionsPage.jsx   - Session list with stop, refund
    SitesPage.jsx      - Site cards with revenue
    DriversPage.jsx    - Driver table
    SettingsPage.jsx   - Rate config, OCPP info, auth toggles
```
