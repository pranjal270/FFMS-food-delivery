# FFMS Food Delivery

A full-stack food delivery web app built with `React + Vite` on the frontend and `Node.js + Express + MongoDB` on the backend.

This project includes menu browsing, veg/non-veg filtering, cart flow, order placement, delivery tracking, authentication, password recovery, and a profile page with saved recovery code support.

## Features

- Browse menu by category
- Veg / Non-Veg toggle like food delivery apps
- Updated menu pricing in INR
- Cart management with checkout flow
- Auto-updating order tracking timer
- Login, signup, logout, forgot password
- Access token + refresh token based auth flow
- Recovery code storage and display in profile
- Password change support
- Sticky navbar with active section highlight
- Mobile responsive UI

## Tech Stack

- Frontend: `React`, `Vite`, `React Router`, `Axios`
- Backend: `Node.js`, `Express`
- Database: `MongoDB`, `Mongoose`
- Auth: `JWT`, `bcryptjs`

## Project Structure

```text
FFMS-food-delivery/
├── Frontend/
│   ├── src/
│   └── package.json
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── package.json
└── README.md
```

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/pranjal270/FFMS-food-delivery.git
cd FFMS-food-delivery
```

### 2. Install dependencies

Frontend:

```bash
cd Frontend
npm install
```

Backend:

```bash
cd ../Backend
npm install
```

## Environment Variables

Create a `.env.example` file inside `Backend/` with:

```env
PORT=5000
MONGO_URI=YOUR MONGO URI
JWT_SECRET=JWT SECRET
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=REFRESH TOKEN
REFRESH_TOKEN_EXPIRES_IN=7d
RECOVERY_CODE_SECRET=recoveryCode123
```

Use your real secrets locally in a separate `.env` file and do not commit that file to GitHub.

## Run the App

### Start backend

```bash
cd Backend
npm run dev
```

### Start frontend

```bash
cd Frontend
npm run dev
```

Frontend runs on Vite dev server and backend runs on `http://localhost:5000`.

## Main Flows

### Authentication

- User can sign up and receive a recovery code
- User can log in using email and password
- Access token is used for protected APIs
- Refresh token is used to renew expired access sessions
- Forgot password uses recovery code

### Orders

- Add items to cart
- Place order after login
- Order status starts active and updates to delivered automatically after timer
- Orders page shows ETA instead of manual delivery click

### Profile

- Update name
- Change password
- View saved recovery code in profile card

## Recent UI/UX Improvements

- Fixed `View Menu` smooth scroll behavior
- Fixed navbar active highlight for `Home`, `Menu`, and `Contact Us`
- Removed unnecessary search icon for hardcoded menu
- Improved profile recovery code UI
- Improved cart and section navigation behavior
- Better mobile responsiveness

## API Routes

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/forgot-password`
- `GET /api/auth/me`
- `PUT /api/auth/update-profile`
- `PUT /api/auth/change-password`
- `POST /api/auth/logout`

### Orders

- `POST /api/orders`
- `GET /api/orders/mine`
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/status`

## Build

Frontend production build:

```bash
cd Frontend
npm run build
```

## Notes

- This repo currently uses hardcoded frontend menu items from `Frontend/src/assets/assets.js`
- Default backend config uses local MongoDB
- Demo delivery time is set to `2 minutes` for easier testing

## Author

Developed for the FFMS Food Delivery project.
