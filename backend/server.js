require('dotenv').config(); // Load env vars first
console.log('Loaded MONGO_URI:', process.env.MONGO_URI ? '***LOADED*** (starts with mongodb+srv://)' : 'MISSING!'); // Hide full URI for security
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const cron = require('node-cron'); // For scheduled draws/refunds

// Direct requires—no duplicates!
const authRoutes = require('./routes/auth');
const raffleRoutes = require('./routes/raffles');
const userRoutes = require('./routes/users');

// Configs
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Sockets
const raffleSockets = require('./sockets/raffleSockets');

// Create app & server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } // Tighten in prod
});
app.set('io', io); // Attach for use in controllers

// Middleware
app.use(cors());

// TEMP DEBUG: Custom raw collector + manual JSON parse (consumes stream but sets parsed req.body)
app.use((req, res, next) => {
  if (req.method !== 'POST' && req.method !== 'PUT') return next();
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) return next();

  let rawBody = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => { rawBody += chunk; });
  req.on('end', () => {
    console.log(`\n=== RAW BODY DEBUG for ${req.method} ${req.url} ===\n'${rawBody}'\n=== END RAW (length: ${rawBody.length}) ===`);
    if (rawBody.trim() !== rawBody) {
      console.log('WARNING: Whitespace trimmed!');
      rawBody = rawBody.trim();
    }
    try {
      const parsedBody = JSON.parse(rawBody);
      console.log(`\n=== MANUALLY PARSED BODY for ${req.method} ${req.url} ===\n${JSON.stringify(parsedBody, null, 2)}\n=== END PARSED ===`);
      req.body = parsedBody;  // Set for routes (bypasses express.json())
    } catch (parseErr) {
      console.error(`\n=== PARSE ERROR for ${req.method} ${req.url} ===\n${parseErr.message}\nRaw was: ${rawBody}\n=== END ERROR ===`);
      req.body = {};  // Empty for validation fail
    }
    next();
  });
});

app.use(express.urlencoded({ extended: true }));  // Keep for form data if needed
// Note: Skipping express.json() during debug—manual handles it

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/raffles', raffleRoutes);
app.use('/api/users', userRoutes);

// Test routes
app.get('/', (req, res) => {
  res.json({ message: 'Raffle Backend API is running! 🚀' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), mongoConnected: true });
});

// Error handler (last)
app.use(errorHandler);

// Connect DB
connectDB();

// Sockets setup
raffleSockets(io);

// Cron for raffle ends (check every minute—optimize to hourly in prod)
cron.schedule('* * * * *', async () => {
  console.log(`[${new Date().toISOString()}] Checking for ended raffles...`);
  // Implement: Find { status: 'active', endAt: { $lt: new Date() } }, then draw or fail
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});