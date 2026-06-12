require('dotenv').config();
const express = require('express');
const path = require('path');
const { initDatabase } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize the database on startup
initDatabase();

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '../public')));

// Health check route - just to confirm server is alive
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Black Hat server is running' });
});

app.listen(PORT, () => {
  console.log(`Black Hat server running on http://localhost:${PORT}`);
});
