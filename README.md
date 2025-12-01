# Raffle Marketplace 🎟️

A gamified e-commerce platform where items are sold through raffles instead of direct purchases.

## 🎯 Features
- **Raffle Listings**: Users post items with ticket-based pricing
- **Ticket Purchases**: Buy tickets to increase winning chances
- **Automatic Draws**: Winners selected when all tickets are sold
- **Refund System**: Full refunds if raffle doesn't complete
- **Real-time Updates**: Live progress tracking and notifications

## 🏗️ Architecture
raffle-marketplace/
├── README.md                  # Project overview, setup instructions
├── package.json               # Root deps (e.g., for shared tools)
├── .env.example               # Template for env vars (STRIPE_KEY, JWT_SECRET, MONGO_URI)
├── .gitignore
│
├── backend/                   # Node.js API Server
│   ├── package.json           # Backend deps (express, mongoose, stripe, jsonwebtoken, bcryptjs, socket.io, node-cron)
│   ├── server.js              # Entry point: App setup, connect DB, start server
│   ├── .env                   # Secrets: DB URI, Stripe keys, JWT secret
│   │
│   ├── config/                # Shared configs
│   │   ├── db.js              # MongoDB connection
│   │   └── stripe.js          # Stripe client init
│   │
│   ├── models/                # Mongoose schemas
│   │   ├── User.js            # User model (email, password hash, role: buyer/seller)
│   │   ├── Raffle.js          # Raffle schema (as before, + seller ref)
│   │   ├── Ticket.js          # Ticket purchases (buyer, raffle, quantity, numbers)
│   │   └── Draw.js            # Winner records
│   │
│   ├── routes/                # API endpoints
│   │   ├── auth.js            # POST /register, /login (JWT tokens)
│   │   ├── raffles.js         # GET/POST /raffles, /:id/buy, /:id/draw
│   │   └── users.js           # GET /profile, PUT /profile
│   │
│   ├── controllers/           # Business logic
│   │   ├── authController.js  # Hash passwords, generate/verify JWT
│   │   ├── raffleController.js# Create raffle, buy tickets (update sold), draw winner
│   │   └── paymentController.js# Stripe intents, refunds on failure
│   │
│   ├── middleware/            # Helpers
│   │   ├── auth.js            # JWT verification for protected routes
│   │   └── errorHandler.js    # Global error middleware
│   │
│   ├── sockets/               # Real-time (Socket.io)
│   │   └── raffleSockets.js   # Emit progress updates, live draws
│   │
│   └── utils/                 # Helpers
│       ├── crypto.js          # Secure RNG for ticket numbers/winners
│       └── email.js           # Nodemailer for notifications/refunds
│
├── frontend/                  # React Native App (Expo)
│   ├── package.json           # Frontend deps (react-native, @react-navigation, stripe-react-native, socket.io-client, expo-notifications)
│   ├── app.json               # Expo config (app name, icons)
│   ├── babel.config.js        # Transpiler setup
│   │
│   ├── src/                   # Source code
│   │   ├── components/        # Reusable UI pieces
│   │   │   ├── RaffleCard.js  # Card for browse page (progress bar, timer)
│   │   │   ├── TicketSlider.js# Bulk buy input
│   │   │   ├── CountdownTimer.js # Real-time clock
│   │   │   └── AuthForm.js    # Login/register modals
│   │   │
│   │   ├── screens/           # Page components
│   │   │   ├── BrowseRaffles.js # Home: Grid of cards, filters
│   │   │   ├── RaffleDetails.js # Details: Hero, buy modal
│   │   │   ├── CreateRaffle.js # Wizard form (multi-step)
│   │   │   ├── MyRaffles.js   # Tabbed: Created/Entered
│   │   │   └── Profile.js     # User settings, auth wrapper
│   │   │
│   │   ├── navigation/        # App routing
│   │   │   └── AppNavigator.js # Stack + Tab nav (react-navigation)
│   │   │
│   │   ├── services/          # API integrations
│   │   │   ├── api.js         # Axios instance with JWT auth headers
│   │   │   ├── stripe.js      # Payment sheet setup
│   │   │   └── socket.js      # Socket.io client for real-time
│   │   │
│   │   ├── utils/             # Helpers
│   │   │   ├── auth.js        # Store/retrieve JWT (AsyncStorage)
│   │   │   └── notifications.js # Expo push/email alerts
│   │   │
│   │   └── store/             # State management (Redux or Zustand)
│   │       ├── rafflesSlice.js # Raffle state (active list, my entries)
│   │       └── store.js       # Provider setup
│   │
│   └── assets/                # Static files
│       ├── images/            # Icons, placeholders (e.g., default-product.png)
│       └── fonts/             # Custom fonts for modern look
│
└── docs/                      # Optional: Wireframes, API spec
    └── wireframes/            # (We'll add generated images here)


## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB Atlas account
- Stripe account (for payments)
- Expo CLI (for mobile app)

### Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
npm install
npm start