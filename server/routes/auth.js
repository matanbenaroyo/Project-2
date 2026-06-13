const express = require('express');
const bcrypt = require('bcryptjs');
const { readDB } = require('../db/database');

const router = express.Router();

// POST /api/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'נא למלא אימייל וסיסמה' });
  }

  const db = readDB();
  const user = db.users.find(function(u) { return u.email === email; });

  if (!user) {
    return res.status(401).json({ error: 'אימייל או סיסמה שגויים' });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'אימייל או סיסמה שגויים' });
  }

  // Save user info in the session
  req.session.user = {
    id: user.id,
    email: user.email,
    paid: user.paid
  };

  res.json({ success: true });
});

// POST /api/logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// GET /api/me — returns current logged-in user (used by dashboard)
router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'לא מחובר' });
  }
  res.json({ email: req.session.user.email, paid: req.session.user.paid });
});

module.exports = router;
