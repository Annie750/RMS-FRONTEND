# Renewal Management System — Frontend

React 19 + Vite + Material UI frontend for the Renewal Management System, built to talk to your existing Spring Boot backend.

## Setup

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Environment

Edit `.env` to point at your backend:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Backend API assumptions

Your prompt described Auth, Users, Customers, Products, and Renewals APIs. To wire up the Dashboard and other screens, this frontend also assumes a few endpoints that weren't explicitly listed — **adjust `src/services/*.js` if your backend uses different paths/shapes**:

- `POST /api/auth/login` → expected response shape: `{ token: string, user: { id, name, email, role } }`. If your backend returns a different shape (e.g. `accessToken` instead of `token`), update `src/services/authService.js`.
- `GET /api/dashboard/summary`, `/monthly-renewals`, `/revenue-trend`, `/product-distribution`, `/renewal-status`, `/recent-renewals`, `/upcoming-renewals` — used by the Dashboard page (`src/pages/dashboard/Dashboard.jsx`). If you don't have these yet, either add them to the backend or replace the calls in `src/services/dashboardService.js` with your actual endpoints.
- `PATCH /api/users/{id}/toggle-active` and `POST /api/users/{id}/reset-password` — used by the Users module for activate/deactivate and password reset.
- Customers/Products/Renewals list endpoints are assumed to return either a plain array or a paginated shape `{ content: [...] }`. Both are handled automatically in the list pages.

## Project structure

```
src/
 ├── api/            → axios instance + JWT interceptor
 ├── components/      → reusable UI (Loader, ConfirmDialog, StatCard, ChartCard, etc.)
 ├── context/          → AuthContext (JWT session)
 ├── layouts/          → DashboardLayout, Sidebar, Navbar
 ├── pages/            → auth, dashboard, customers, products, renewals, users, reports, settings
 ├── routes/           → AppRoutes, ProtectedRoute, AdminRoute
 ├── services/         → one file per backend resource
 ├── theme/            → MUI theme + dark/light mode context
 └── utils/            → constants, CSV export helper
```

## Notes

- Auth: JWT is stored in `localStorage` under `accessToken`, attached automatically to every request via the Axios interceptor. A 401 response triggers auto-logout and redirect to `/login`.
- Roles: the `Users` nav item and route are gated to `user.role === 'ADMIN'` (see `AdminRoute` in `src/routes/ProtectedRoute.jsx`).
- Theme: toggle in the top navbar persists to `localStorage` (`themeMode`).
- DataGrid tables (Customers, Products, Renewals, Users) support client-side search, sorting, and pagination out of the box; CSV export is wired on Customers and Renewals.
- Reports PDF/Excel export buttons are stubbed with toast notifications — connect them to your backend's report-generation endpoints when ready.
