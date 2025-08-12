# Municipality Services App

A 2-part project consisting of a React Native mobile app and React.js admin panel for managing municipality services.

## Project Structure

```
belyanimda/
├── backend/          # Node.js + Express API with lowdb
├── mobile/           # React Native Expo app
├── web/             # React.js admin panel
├── shared/          # Shared constants and types
└── package.json     # Monorepo configuration
```

## Features

### Mobile App (React Native + Expo)
- **Home Tab**: Grid of service cards with icons, opens URLs in WebView
- **Notifications Tab**: List of notifications from admin panel
- Pull-to-refresh functionality
- AsyncStorage caching
- No authentication required

### Admin Panel (React.js + Vite)
- **Services Management**: CRUD operations, drag-and-drop reordering
- **Notifications Management**: Send notifications instantly
- Authentication with username/password
- Responsive design with TailwindCSS

### Backend (Node.js + Express)
- RESTful API endpoints for services and notifications
- lowdb for JSON-based data storage
- Static file serving for mobile app

## Quick Start

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Fix missing dependency (if needed):**
   ```bash
   cd web
   npm install @dnd-kit/modifiers@^7.0.0
   cd ..
   ```

3. **Create environment files:**
   
   Create `backend/.env`:
   ```
   PORT=3000
   NODE_ENV=development
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   ```
   
   Create `web/.env`:
   ```
   VITE_API_URL=http://localhost:3000
   ```
   
   Create `mobile/.env`:
   ```
   EXPO_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Start development servers:**
   ```bash
   npm run dev          # Backend + Web admin panel
   npm run dev:mobile   # Mobile app (separate terminal)
   ```

5. **Access applications:**
   - Backend API: http://localhost:3000
   - Admin Panel: http://localhost:5173
   - Mobile App: Use Expo Go app with QR code

## Tech Stack

- **Mobile**: React Native, Expo, AsyncStorage
- **Web**: React.js, Vite, TailwindCSS
- **Backend**: Node.js, Express, lowdb
- **Shared**: Constants and utilities
- **Tools**: ESLint, Prettier

## Environment Setup

Create `.env` files in respective directories:

### Backend (.env)
```
PORT=3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_password
```

### Web (.env)
```
VITE_API_URL=http://localhost:3000
```

### Mobile (.env)
```
EXPO_PUBLIC_API_URL=http://localhost:3000
```
