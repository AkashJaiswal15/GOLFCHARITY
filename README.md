# Golf Charity Subscription Platform

A MERN + Bootstrap 5 platform for golf charity subscriptions with monthly prize draws.

## Stack
- **Backend**: Node.js, Express, MongoDB (Mongoose), Stripe
- **Frontend**: React 19, Bootstrap 5, React Router v7

## Project Structure
```
golfsystem/
├── server/          # Express API
│   ├── models/      # User, Score, Charity, Draw schemas
│   ├── controllers/ # Business logic
│   ├── routes/      # API routes
│   ├── middleware/  # JWT auth
│   ├── seed.js      # Seed charities + admin user
│   └── index.js
└── client/          # React app
    └── src/
        ├── api/       # Axios instance
        ├── context/   # Auth context
        ├── components/ # ScorePanel, SubscriptionCard, CharitySummary, Navbar
        └── pages/     # Dashboard, Login, Register, Subscribe, Charities, Draws, AdminPanel
```

## Setup

### 1. Configure Environment
Edit `server/.env`:
```
MONGO_URI=mongodb://localhost:27017/golfsystem
JWT_SECRET=your_secret_here
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_YEARLY_PRICE_ID=price_...
CLIENT_URL=http://localhost:3000
```

### 2. Install & Seed
```bash
# Backend
cd server
npm install
node seed.js        # Seeds 12 charities + admin user

# Frontend
cd ../client
npm install
```

### 3. Run
```bash
# Terminal 1 — Backend
cd server && npm start

# Terminal 2 — Frontend
cd client && npm start
```

### 4. Stripe Webhooks (local dev)
```bash
stripe listen --forward-to localhost:5000/api/webhook
```

## Key Features

### Rolling 5 Score System
- Users enter Stableford scores (1–45)
- Only the latest 5 are retained — 6th entry auto-deletes the oldest
- Enforced via Mongoose `post('save')` hook on the Score model

### Draw Engine
- Admin triggers monthly draw via `/api/draws/trigger`
- 5 random numbers drawn (1–45)
- Each active subscriber's latest 5 scores are matched
- Prize tiers: **5-match** (40% + jackpot), **4-match** (35%), **3-match** (25%)
- If no 5-match winner → jackpot rolls over to next month

### Charity Integration
- Minimum 10% of subscription fee allocated to user-selected charity
- Searchable directory of 12 pre-seeded UK charities
- Users can adjust their percentage (10–100%)

### Stripe Subscription
- Monthly (£10) and Yearly (£100) plans
- Webhooks update `subscriptionStatus` in MongoDB automatically
- Only `active` subscribers are eligible for draws

## Admin Credentials (after seed)
- Email: `admin@golfsystem.com`
- Password: `Admin1234!`

## Admin Panel Tabs
- **Users** — View/edit subscription status, role; delete users
- **Draws** — Trigger monthly draw, view history
- **Charities** — Add new charities to the directory
- **Proof** — Upload winner proof URLs to draw records
