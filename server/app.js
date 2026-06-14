require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { initDatabase } = require('./db/database');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const paymentRoutes = require('./routes/payment');
const lessonRoutes = require('./routes/lessons');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize the database on startup
initDatabase();

// Parse JSON and form-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // needed for Meshulam webhook

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-this-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true only when using HTTPS in production
}));

// API routes
app.use('/api', authRoutes);
app.use('/api/payment', paymentRoutes);

// Protected page routes (must be before static middleware)
app.use('/', dashboardRoutes);
app.use('/', lessonRoutes);

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '../public')));

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Black Hat server is running' });
});

app.listen(PORT, () => {
  console.log(`Black Hat server running on http://localhost:${PORT}`);
});
