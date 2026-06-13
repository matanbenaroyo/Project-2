const express = require('express');
const path = require('path');

const router = express.Router();

// GET /dashboard — only logged-in paid users can access this
router.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login.html');
  }
  if (!req.session.user.paid) {
    return res.redirect('/index.html#pricing');
  }
  res.sendFile(path.join(__dirname, '../views/dashboard.html'));
});

module.exports = router;
