# Cursor Project Rules

## General
- Language: JavaScript (no TypeScript).
- Folder structure:
  - `/backend` → Node.js + Express + lowdb
  - `/mobile` → React Native (Expo)
  - `/web` → React.js (Vite + TailwindCSS)
  - `/shared` → shared constants or helper functions
- Code style: ESLint + Prettier defaults (2 spaces, semicolons, single quotes).

## Mobile App
- React Native (Expo).
- Functional components + hooks only.
- Bottom tab navigation with:
  1. **Home** → grid of service cards (icon + name), opens in WebView on press.
  2. **Notifications** → list of messages from backend, optional description & link.
- Pull-to-refresh for both tabs.
- AsyncStorage to cache last loaded data.
- Styling: NativeWind or React Native Paper.
- Cards: rounded corners, shadow, adaptive layout.
- Notifications list: simple, clean, clickable link opens in WebView/browser.

## Web Admin Panel
- React.js + TailwindCSS.
- Pages:
  - Login
  - Services (CRUD, reorder, active toggle)
  - Notifications (CRUD, send)
  - Settings (future use)
- Services: table with Name, Icon URL, Service URL, Active toggle, Edit/Delete, drag-and-drop reorder.
- Notifications: table with title, description, optional URL, created date; Add form with validation.
- All CRUD operations update lowdb JSON in backend.
- Responsive layout.

## Backend
- Node.js + Express.
- lowdb for JSON storage (`services.json`, `notifications.json`).
- Endpoints:
  - Services: GET `/services`, POST `/services`, PUT `/services/:id`, DELETE `/services/:id`
  - Notifications: GET `/notifications`, POST `/notifications`, DELETE `/notifications/:id`
- Serve `services.json` and `notifications.json` for mobile app fetch.
- Simple authentication for admin panel endpoints (username/password in `.env`).

## Security
- Validate all inputs on backend.
- Admin panel routes protected with basic session or token.

## Deliverables Order
1. Monorepo setup with `backend`, `mobile`, `web`, `shared`.
2. Backend endpoints with dummy data.
3. Mobile app with Home + Notifications tabs fetching from backend.
4. Admin panel with Services CRUD.
5. Admin panel with Notifications CRUD.
6. Connect everything end-to-end.
